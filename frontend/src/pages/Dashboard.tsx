import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, HistoryItem } from "@/lib/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, AlertTriangle, ShieldCheck, Target, TrendingUp, Zap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Placeholder metrics — replace with real values from your notebook
const METRICS = {
  accuracy: 0.95,
  precision: 0.05,
  recall: 0.90,
  f1: 0.06,
  auc: 0.93,
  threshold: 0,
};

const CONFUSION = {
  tn: 270517,
  fp: 13798,
  fn: 49,
  tp: 443,
};

const ERROR_DIST = [
  { range: "0.00", normal: 12450, fraud: 0 },
  { range: "0.01", normal: 28932, fraud: 1 },
  { range: "0.02", normal: 12184, fraud: 3 },
  { range: "0.03", normal: 2841, fraud: 5 },
  { range: "0.04", normal: 412, fraud: 9 },
  { range: "0.05", normal: 43, fraud: 14 },
  { range: "0.06", normal: 7, fraud: 18 },
  { range: "0.08", normal: 2, fraud: 22 },
  { range: "0.10+", normal: 0, fraud: 24 },
];

const Dashboard = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHist, setLoadingHist] = useState(true);

  useEffect(() => {
    api
      .get<HistoryItem[]>("/api/history")
      .then((res) => setHistory(res.data || []))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHist(false));
  }, []);

  const splitData = [
    { name: "Normal", value: CONFUSION.tn + CONFUSION.fn, color: "hsl(var(--success))" },
    { name: "Fraud", value: CONFUSION.tp + CONFUSION.fp, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Isolation Forest evaluation on the held-out test set.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
          Threshold: {METRICS.threshold}
        </Badge>
      </header>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Accuracy", value: METRICS.accuracy, icon: Target, accent: "primary" },
          { label: "Precision", value: METRICS.precision, icon: ShieldCheck, accent: "primary" },
          { label: "Recall", value: METRICS.recall, icon: Activity, accent: "warning" },
          { label: "F1 Score", value: METRICS.f1, icon: TrendingUp, accent: "primary" },
          { label: "ROC AUC", value: METRICS.auc, icon: Zap, accent: "primary" },
        ].map((m) => (
          <Card key={m.label} className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {m.label}
              </p>
              <m.icon className={cn("h-4 w-4", m.accent === "warning" ? "text-warning" : "text-primary")} />
            </div>
            <p className="mt-3 font-mono text-3xl font-bold">{(m.value * 100).toFixed(2)}%</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", m.accent === "warning" ? "bg-warning" : "bg-primary")}
                style={{ width: `${m.value * 100}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Confusion matrix */}
        <Card className="border-border bg-card p-6">
          <h2 className="mb-1 font-semibold">Confusion Matrix</h2>
          <p className="mb-4 text-xs text-muted-foreground">Test set: {(CONFUSION.tn + CONFUSION.fp + CONFUSION.fn + CONFUSION.tp).toLocaleString()} transactions</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-success/30 bg-success/10 p-4">
              <p className="text-xs text-muted-foreground">True Negative</p>
              <p className="mt-1 font-mono text-2xl font-bold text-success">{CONFUSION.tn.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
              <p className="text-xs text-muted-foreground">False Positive</p>
              <p className="mt-1 font-mono text-2xl font-bold text-warning">{CONFUSION.fp}</p>
            </div>
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-xs text-muted-foreground">False Negative</p>
              <p className="mt-1 font-mono text-2xl font-bold text-destructive">{CONFUSION.fn}</p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
              <p className="text-xs text-muted-foreground">True Positive</p>
              <p className="mt-1 font-mono text-2xl font-bold text-primary">{CONFUSION.tp}</p>
            </div>
          </div>
        </Card>

        {/* Class distribution */}
        <Card className="border-border bg-card p-6">
          <h2 className="mb-1 font-semibold">Class Distribution</h2>
          <p className="mb-4 text-xs text-muted-foreground">Severe class imbalance — typical for fraud</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={splitData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {splitData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Error distribution */}
        <Card className="border-border bg-card p-6">
          <h2 className="mb-1 font-semibold">Error Distribution</h2>
          <p className="mb-4 text-xs text-muted-foreground">Reconstruction error — normal vs fraud</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ERROR_DIST}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" vertical={false} />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="normal" stackId="a" fill="hsl(var(--success))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="fraud" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* History table */}
      <Card className="mt-6 border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent Predictions</h2>
            <p className="text-xs text-muted-foreground">Latest 10 from /api/history</p>
          </div>
          {loadingHist ? null : (
            <Badge variant="outline" className="text-xs">
              {history.length} records
            </Badge>
          )}
        </div>
        {loadingHist ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No history yet — make predictions to populate this table.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Reconstruction Error</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h, i) => (
                  <TableRow key={h.id ?? i}>
                    <TableCell className="font-mono text-xs">
                      {new Date(h.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {h.reconstruction_error.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      {h.is_fraud ? (
                        <Badge className="border-0 bg-destructive/15 text-destructive">FRAUD</Badge>
                      ) : (
                        <Badge className="border-0 bg-success/15 text-success">NORMAL</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
