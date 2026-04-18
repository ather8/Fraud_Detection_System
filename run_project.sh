#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# run_project.sh — One-shot launcher for the Fraud Detection System
#
# Boots the full stack (PostgreSQL + FastAPI backend + React frontend) using
# Docker Compose, waits until each service is healthy, and prints the URLs.
#
# Usage:
#   ./run_project.sh              # build (if needed) and start in foreground
#   ./run_project.sh -d           # start detached (background)
#   ./run_project.sh --rebuild    # force a clean rebuild of the images
#   ./run_project.sh --down       # stop and remove containers
#   ./run_project.sh --reset      # stop containers AND wipe the DB volume
#   ./run_project.sh --logs       # tail logs from all services
# ---------------------------------------------------------------------------

set -euo pipefail

# --- Pretty output --------------------------------------------------------
RED="\033[0;31m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"
BLUE="\033[0;34m"; BOLD="\033[1m"; RESET="\033[0m"

info()    { echo -e "${BLUE}ℹ${RESET}  $*"; }
ok()      { echo -e "${GREEN}✓${RESET}  $*"; }
warn()    { echo -e "${YELLOW}⚠${RESET}  $*"; }
err()     { echo -e "${RED}✗${RESET}  $*" >&2; }
section() { echo -e "\n${BOLD}── $* ──${RESET}"; }

# --- Locate project root --------------------------------------------------
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# --- Pick the right docker compose command --------------------------------
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DC="docker-compose"
else
    err "Docker (with Compose) is required but was not found."
    err "Install Docker Desktop or the docker-compose plugin and try again."
    exit 1
fi

# --- Sanity checks --------------------------------------------------------
if [[ ! -f "docker-compose.yml" ]]; then
    err "docker-compose.yml not found in $SCRIPT_DIR"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    err "Docker daemon is not running. Please start Docker and retry."
    exit 1
fi

# --- Argument parsing -----------------------------------------------------
DETACHED=false
REBUILD=false
ACTION="up"

for arg in "$@"; do
    case "$arg" in
        -d|--detach)   DETACHED=true ;;
        --rebuild)     REBUILD=true ;;
        --down)        ACTION="down" ;;
        --reset)       ACTION="reset" ;;
        --logs)        ACTION="logs" ;;
        -h|--help)
            sed -n '2,15p' "$0"
            exit 0
            ;;
        *) warn "Unknown argument: $arg" ;;
    esac
done

# --- Action dispatch ------------------------------------------------------
case "$ACTION" in
    down)
        section "Stopping containers"
        $DC down
        ok "All containers stopped."
        exit 0
        ;;
    reset)
        section "Stopping containers and wiping database volume"
        $DC down -v
        ok "Containers removed and volumes purged."
        exit 0
        ;;
    logs)
        section "Tailing logs (Ctrl+C to exit)"
        $DC logs -f
        exit 0
        ;;
esac

# --- Build / start --------------------------------------------------------
section "Fraud Detection System — launcher"
info "Project dir: $SCRIPT_DIR"
info "Compose cmd: $DC"

if $REBUILD; then
    section "Rebuilding images from scratch"
    $DC build --no-cache
fi

section "Starting services (db, backend, frontend)"
if $DETACHED; then
    $DC up -d --build
else
    # When running in foreground we still want the URL banner first,
    # so spin up detached, wait for health, then attach to logs.
    $DC up -d --build
fi

# --- Wait for backend health ---------------------------------------------
section "Waiting for backend to be ready"
BACKEND_URL="http://localhost:8000/docs"
for i in $(seq 1 40); do
    if curl -sf "$BACKEND_URL" >/dev/null 2>&1; then
        ok "Backend is up."
        break
    fi
    if [[ $i -eq 40 ]]; then
        warn "Backend did not respond within 80s — check logs with: $DC logs backend"
    fi
    sleep 2
done

# --- Wait for frontend ----------------------------------------------------
section "Waiting for frontend to be ready"
FRONTEND_URL="http://localhost"
for i in $(seq 1 30); do
    if curl -sf "$FRONTEND_URL" >/dev/null 2>&1; then
        ok "Frontend is up."
        break
    fi
    if [[ $i -eq 30 ]]; then
        warn "Frontend did not respond within 60s — check logs with: $DC logs frontend"
    fi
    sleep 2
done

# --- Banner ---------------------------------------------------------------
echo
echo -e "${GREEN}${BOLD}🛡  Fraud Detection System is running!${RESET}"
echo -e "   ${BOLD}Frontend:${RESET}  http://localhost"
echo -e "   ${BOLD}Backend:${RESET}   http://localhost:8000"
echo -e "   ${BOLD}API Docs:${RESET}  http://localhost:8000/docs"
echo -e "   ${BOLD}Database:${RESET}  postgresql://postgres:postgres@localhost:5432/fraud_db"
echo
echo -e "Useful commands:"
echo -e "   ${YELLOW}./run_project.sh --logs${RESET}     tail logs"
echo -e "   ${YELLOW}./run_project.sh --down${RESET}     stop everything"
echo -e "   ${YELLOW}./run_project.sh --reset${RESET}    stop + wipe DB volume"
echo

if ! $DETACHED; then
    section "Attaching to logs (Ctrl+C to detach — containers keep running)"
    $DC logs -f
fi
