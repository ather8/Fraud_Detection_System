import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, FEATURE_NAMES } from "@/lib/api";
import { Activity, Pause, Play } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Point {
  time: string;
  error: number;
  is_fraud: boolean;
}

const Live = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [running, setRunning] = useState(false);
  const [counts, setCounts] = useState({ total: 0, fraud: 0 });
  const [threshold, setThreshold] = useState(0.05);
  const intervalRef = useRef<number | null>(null);

  const tick = async () => {
    try {
      // bias toward normal, occasionally generate anomalies
      const anomaly = Math.random() < 0.15;
      const features = FEATURE_NAMES.map(() => (anomaly ? (Math.random() * 8 - 4) : (Math.random() * 1 - 0.5)));
      const { data } = await api.post("/api/predict", { features });
      setThreshold(data.threshold);
      setPoints((prev) => {
        const next = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
            error: data.reconstruction_error,
            is_fraud: data.is_fraud,
          },
        ];
        return next.slice(-30);
      });
      setCounts((c) => ({ total: c.total + 1, fraud: c.fraud + (data.is_fraud ? 1 : 0) }));
    } catch {
      setRunning(false);
    }
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(tick, 1500);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const fraudRate = counts.total > 0 ? ((counts.fraud / counts.total) * 100).toFixed(1) : "0.0";

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Feed</h1>
          <p className="mt-1 text-muted-foreground">Simulate a real-time transaction stream.</p>
        </div>
        <Button
          onClick={() => setRunning((r) => !r)}
          className={running ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "gradient-primary text-primary-foreground hover:opacity-90"}
        >
          {running ? (
            <><Pause className="mr-2 h-4 w-4" /> Stop feed</>
          ) : (
            <><Play className="mr-2 h-4 w-4" /> Start feed</>
          )}
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</p>
            <span className={`h-2 w-2 rounded-full ${running ? "bg-success pulse-glow" : "bg-muted-foreground"}`} />
          </div>
          <p className="mt-3 text-2xl font-bold">{running ? "STREAMING" : "IDLE"}</p>
        </Card>
        <Card className="border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total Scored</p>
          <p className="mt-3 font-mono text-2xl font-bold">{counts.total}</p>
        </Card>
        <Card className="border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Fraud Rate</p>
          <p className="mt-3 font-mono text-2xl font-bold text-destructive">{fraudRate}%</p>
        </Card>
      </div>

      <Card className="mt-6 border-border bg-card p-6 scan-line">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Anomaly score stream</h2>
          <Badge variant="outline" className="ml-auto text-xs">
            Threshold: {threshold.toFixed(4)}
          </Badge>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" vertical={false} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <ReferenceLine y={threshold} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "Threshold", fill: "hsl(var(--destructive))", fontSize: 10, position: "right" }} />
              <Line
                type="monotone"
                dataKey="error"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {points.length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Press <strong>Start feed</strong> to stream simulated transactions.
          </p>
        )}
      </Card>
    </div>
  );
};

export default Live;
