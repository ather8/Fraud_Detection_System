import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Activity, ArrowRight, BrainCircuit, Lock, ShieldAlert, Sparkles, TreePine, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  { icon: TreePine, title: "Isolation Forest", desc: "Unsupervised anomaly detection trained on credit-card transaction patterns." },
  { icon: Zap, title: "ONNX Runtime", desc: "Sub-100ms inference compiled to ONNX for production-grade serving." },
  { icon: Activity, title: "Real-Time Scoring", desc: "FastAPI streaming endpoint scores transactions as they arrive." },
  { icon: BrainCircuit, title: "Explainable AI", desc: "Per-feature attribution shows exactly why a transaction was flagged." },
];

const stack = ["FastAPI", "PostgreSQL", "scikit-learn", "ONNX", "React", "Recharts", "Tailwind"];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="gradient-primary text-primary-foreground hover:opacity-90">
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary animate-fade-in">
              <Sparkles className="h-3 w-3" />
              Real-time anomaly detection
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl animate-fade-in-up">
              Catch fraud before it{" "}
              <span className="text-gradient-primary">drains accounts</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up">
              FraudWatch AI scores every transaction in milliseconds using an Isolation Forest model
              served from FastAPI. Catch outliers, understand the why, and stop losses in real time.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up">
              <Button size="lg" asChild className="gradient-primary text-primary-foreground hover:opacity-90 glow-primary">
                <Link to="/register">
                  Try the demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign in to dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Stat band */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { v: "<100ms", l: "Inference time" },
              { v: "11", l: "PCA features" },
              { v: "ONNX", l: "Runtime" },
              { v: "FastAPI", l: "Backend" },
            ].map((s) => (
              <Card key={s.l} className="border-border bg-card/50 p-5 text-center backdrop-blur">
                <p className="text-2xl font-bold text-gradient-primary">{s.v}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Built for production fraud teams
          </h2>
          <p className="text-muted-foreground">
            Every component is engineered for speed, explainability, and operational trust.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="group relative overflow-hidden border-border bg-card p-6 transition-smooth hover:border-primary/50 hover:shadow-card">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">The Pipeline</p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
              From raw transaction to risk score in milliseconds
            </h2>
            <div className="space-y-4">
              {[
                { n: "01", t: "Ingest", d: "11 PCA-reduced features streamed via REST." },
                { n: "02", t: "Scale", d: "StandardScaler normalizes input distribution." },
                { n: "03", t: "Score", d: "Isolation Forest computes anomaly score via ONNX." },
                { n: "04", t: "Explain", d: "Per-feature attribution surfaces top contributors." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 rounded-xl border border-border bg-card/40 p-4">
                  <div className="font-mono text-2xl font-bold text-gradient-primary">{s.n}</div>
                  <div>
                    <p className="font-semibold">{s.t}</p>
                    <p className="text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden border-border bg-card p-8 scan-line">
            <div className="absolute right-4 top-4 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
            </div>
            <pre className="mt-6 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
{`POST /api/predict
Content-Type: application/json

{
  "features": [0.12, -0.34, 0.05, -0.11,
               0.22, -0.18, 0.09, 0.14,
              -0.05, 0.08, 14]
}

→ 200 OK
{
  "is_fraud": false,
  "reconstruction_error": 0.0142,
  "threshold": 0.05,
  "feature_importance": [...]
}`}
            </pre>
            <div className="mt-6 flex items-center gap-2 text-xs text-success">
              <ShieldAlert className="h-4 w-4" />
              <span>Average response time: 87ms</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Stack */}
      <section className="container mx-auto px-4 py-16">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Built with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {stack.map((s) => (
            <span key={s} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <Card className="relative overflow-hidden border-primary/30 bg-card p-12 text-center">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-radial)" }} />
          <div className="relative">
            <Lock className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to score your first transaction?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Make sure your FastAPI backend is running on <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">localhost:8000</code>, then sign in to start.
            </p>
            <Button size="lg" asChild className="gradient-primary text-primary-foreground hover:opacity-90 glow-primary">
              <Link to="/register">
                Create account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <Logo size="sm" />
          <p className="text-xs text-muted-foreground">© 2026 FraudWatch AI · Built on FastAPI + ONNX</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
