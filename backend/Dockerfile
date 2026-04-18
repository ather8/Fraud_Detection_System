FROM python:3.9-slim

# Install system dependencies for psycopg2 (PostgreSQL driver)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend folder
COPY . .

# Set Python path so it can find the 'app' folder
ENV PYTHONPATH=/app

EXPOSE 8000

# Run from the root of the backend folder
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
