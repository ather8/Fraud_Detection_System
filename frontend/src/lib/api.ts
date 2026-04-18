import axios from "axios";

// Read from Vite env at build time, fall back to localhost for `npm run dev`
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://localhost:8000";

// Helpful while debugging Docker / preview networking
// eslint-disable-next-line no-console
console.log("[api] Using API_BASE =", API_BASE);

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fw_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const FEATURE_NAMES = [
  "V2", "V4", "V7", "V11", "V12", "V14", "V16", "V17", "V18", "V19", "Hour",
] as const;

export type FeatureName = (typeof FEATURE_NAMES)[number];

export interface PredictionResponse {
  is_fraud: boolean;
  reconstruction_error: number;
  feature_importance: { name: string; value: number }[];
  threshold: number;
}

export interface HistoryItem {
  id?: number;
  timestamp: string;
  reconstruction_error: number;
  is_fraud: boolean;
}

// Sample presets — typical values, will be replaced when backend examples differ
export const SAMPLE_NORMAL: Record<FeatureName, number> = {
  V2: 0.12, V4: -0.34, V7: 0.05, V11: -0.11, V12: 0.22,
  V14: -0.18, V16: 0.09, V17: 0.14, V18: -0.05, V19: 0.08, Hour: 14,
};

export const SAMPLE_FRAUD: Record<FeatureName, number> = {
  V2: 2.84, V4: 4.12, V7: -3.21, V11: 5.67, V12: -4.88,
  V14: -6.12, V16: -3.45, V17: -4.91, V18: -2.78, V19: 1.92, Hour: 3,
};
