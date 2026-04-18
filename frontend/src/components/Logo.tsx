import { ShieldCheck } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ size = "md" }: LogoProps) => {
  const dims = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dims} rounded-lg gradient-primary grid place-items-center glow-primary`}>
        <ShieldCheck className="text-primary-foreground" size={size === "lg" ? 22 : 18} strokeWidth={2.5} />
      </div>
      <span className={`${text} font-bold tracking-tight text-foreground`}>
        Fraud<span className="text-gradient-primary">Watch</span>
      </span>
    </div>
  );
};
