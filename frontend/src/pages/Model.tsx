import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FEATURE_NAMES } from "@/lib/api";
import { BrainCircuit, Database, FileCode, GitBranch, Layers, TreePine } from "lucide-react";

const Model = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Model Information</h1>
        <p className="mt-1 text-muted-foreground">Architecture, features, and serving details.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TreePine className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Isolation Forest</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            An ensemble of randomly partitioned binary trees. Each tree isolates samples by random splits;
            anomalies require fewer splits to isolate, yielding shorter average path lengths and higher
            anomaly scores. The model is unsupervised and well-suited to fraud's severe class imbalance.
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: "Algorithm", v: "Isolation Forest" },
              { k: "Trees", v: "100" },
              { k: "Max samples", v: "256" },
              { k: "Contamination", v: "0.0017" },
            ].map((d) => (
              <div key={d.k} className="rounded-lg border border-border bg-muted/30 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{d.k}</dt>
                <dd className="mt-1 font-mono text-sm font-semibold">{d.v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Pipeline</h2>
          </div>
          <ol className="space-y-3 text-sm">
            {[
              { t: "Input", d: "11 features + Hour" },
              { t: "Scale", d: "StandardScaler (joblib)" },
              { t: "Isolation Forest scoring", d: "ONNX Runtime inference" },
              { t: "Threshold", d: "0.05 anomaly score" },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className="text-xs text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Input features</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            11 features from the Kaggle credit-card fraud dataset + the transaction Hour.
          </p>
          <div className="flex flex-wrap gap-2">
            {FEATURE_NAMES.map((f) => (
              <Badge key={f} variant="outline" className="font-mono">
                {f}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Serving</h2>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Runtime</span><span className="font-mono">ONNX Runtime</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Backend</span><span className="font-mono">FastAPI</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Database</span><span className="font-mono">PostgreSQL</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Endpoint</span><span className="font-mono text-xs">/api/predict</span></li>
          </ul>
        </Card>

        <Card className="border-border bg-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <FileCode className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Sample request</h2>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs">
{`curl -X POST http://localhost:8000/api/predict \\
  -H "Content-Type: application/json" \\
  -d '{
    "features": [0.12, -0.34, 0.05, -0.11, 0.22,
                -0.18, 0.09, 0.14, -0.05, 0.08, 14]
  }'`}
          </pre>
        </Card>

        <Card className="border-border bg-card p-6 lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Source</h2>
          </div>
          <a
            href="https://github.com/ather8/Fraud_Detection_System"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            github.com/ather8/Fraud_Detection_System
          </a>
        </Card>
      </div>
    </div>
  );
};

export default Model;
