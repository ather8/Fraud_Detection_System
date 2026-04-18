import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Loader2, RefreshCw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { api, FEATURE_NAMES, FeatureName, PredictionResponse, SAMPLE_FRAUD, SAMPLE_NORMAL } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FeatureMap = Record<FeatureName, number>;

const initialValues: FeatureMap = FEATURE_NAMES.reduce((acc, k) => {
  acc[k] = 0;
  return acc;
}, {} as FeatureMap);

const Predict = () => {
  const [values, setValues] = useState<FeatureMap>(initialValues);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const setVal = (k: FeatureName, v: string) => {
    const num = v === "" || v === "-" ? 0 : parseFloat(v);
    setValues((prev) => ({ ...prev, [k]: isNaN(num) ? 0 : num }));
  };

  const loadPreset = (preset: FeatureMap, label: string) => {
    setValues({ ...preset });
    toast.success(`Loaded ${label} sample`);
  };

  const reset = () => {
    setValues(initialValues);
    setResult(null);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const features = FEATURE_NAMES.map((k) => values[k]);
      const { data } = await api.post<PredictionResponse>("/api/predict", { features });
      setResult(data);
      toast[data.is_fraud ? "error" : "success"](
        data.is_fraud ? "Fraud detected" : "Transaction looks normal",
        { description: `Anomaly score: ${data.reconstruction_error.toFixed(4)}` }
      );
    } catch (err: any) {
      toast.error("Prediction failed", {
        description: err?.response?.data?.detail || "Check that the FastAPI backend is running.",
      });
    } finally {
      setLoading(false);
    }
  };

  const errorPct = result ? Math.min((result.reconstruction_error / (result.threshold * 2)) * 100, 100) : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Prediction Demo</h1>
        <p className="mt-1 text-muted-foreground">
          Enter the 11 PCA features and submit to score the transaction.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input form */}
        <Card className="border-border bg-card p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Transaction features</h2>
              <p className="text-xs text-muted-foreground">11 PCA-reduced inputs</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => loadPreset(SAMPLE_NORMAL, "normal")}>
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-success" />
                Normal
              </Button>
              <Button size="sm" variant="outline" onClick={() => loadPreset(SAMPLE_FRAUD, "fraud")}>
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-destructive" />
                Fraud
              </Button>
              <Button size="sm" variant="ghost" onClick={reset}>
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {FEATURE_NAMES.map((name) => (
              <div key={name} className="space-y-1.5">
                <Label htmlFor={name} className="font-mono text-xs text-muted-foreground">
                  {name}
                </Label>
                <Input
                  id={name}
                  type="number"
                  step="0.01"
                  value={values[name]}
                  onChange={(e) => setVal(name, e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={submit}
            disabled={loading}
            className="mt-6 w-full gradient-primary text-primary-foreground hover:opacity-90"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scoring...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Score transaction
              </>
            )}
          </Button>
        </Card>

        {/* Result */}
        <Card
          className={cn(
            "relative overflow-hidden border-border bg-card p-6 lg:col-span-2 transition-smooth",
            result?.is_fraud && "border-destructive/40 glow-danger",
            result && !result.is_fraud && "border-success/40 glow-primary"
          )}
        >
          {!result ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
              <Sparkles className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Submit a transaction to see the risk assessment</p>
            </div>
          ) : (
            <>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Risk Assessment
              </div>
              <div className="flex items-center gap-3">
                {result.is_fraud ? (
                  <Badge className="gap-1.5 border-0 bg-destructive text-destructive-foreground pulse-danger">
                    <AlertTriangle className="h-3 w-3" /> FRAUD
                  </Badge>
                ) : (
                  <Badge className="gap-1.5 border-0 bg-success text-success-foreground">
                    <ShieldCheck className="h-3 w-3" /> NORMAL
                  </Badge>
                )}
              </div>

              <div className="mt-6">
                <p className="font-mono text-5xl font-bold tracking-tight">
                  {result.reconstruction_error.toFixed(4)}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  Anomaly score
                </p>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted-foreground">0.0000</span>
                  <span className={result.is_fraud ? "text-destructive" : "text-success"}>
                    Threshold {result.threshold.toFixed(4)}
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all",
                      result.is_fraud ? "bg-destructive" : "bg-success"
                    )}
                    style={{ width: `${errorPct}%` }}
                  />
                  <div
                    className="absolute inset-y-0 w-0.5 bg-foreground/60"
                    style={{ left: "50%" }}
                  />
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Feature importance */}
      <Card className="mt-6 border-border bg-card p-6">
        <div className="mb-5">
          <h2 className="font-semibold">Feature attribution</h2>
          <p className="text-xs text-muted-foreground">
            Per-feature contribution to the anomaly score. Bars above the threshold are highlighted.
          </p>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result?.feature_importance || []}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {(result?.feature_importance || []).map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.value > (result?.threshold || 0.05)
                        ? "hsl(var(--destructive))"
                        : "hsl(var(--primary))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Predict;
