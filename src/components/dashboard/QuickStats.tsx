import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
}

function StatCard({ label, value, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-2xl p-4 transition-all duration-200 hover:shadow-salon",
      variant === "primary" && "gradient-primary text-primary-foreground shadow-salon",
      variant === "success" && "bg-success/10 text-success",
      variant === "warning" && "bg-warning/10 text-warning-foreground",
      variant === "default" && "bg-card border border-border"
    )}>
      <p className={cn(
        "text-xs font-medium mb-1",
        variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        {label}
      </p>
      <p className={cn(
        "text-xl font-bold",
        variant === "primary" && "text-primary-foreground",
        variant === "success" && "text-success",
        variant === "warning" && "text-warning-foreground",
        variant === "default" && "text-foreground"
      )}>
        {value}
      </p>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs font-medium",
          trend.isPositive ? "text-success" : "text-destructive"
        )}>
          {trend.isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          <span>{Math.abs(trend.value)}% vs ontem</span>
        </div>
      )}
    </div>
  );
}

export function QuickStats() {
  return (
    <div className="px-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Faturamento Hoje"
          value="R$ 1.250"
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          label="Atendimentos"
          value="8"
          trend={{ value: 5, isPositive: true }}
          variant="default"
        />
        <StatCard
          label="Ticket Médio"
          value="R$ 156"
          variant="success"
        />
        <StatCard
          label="A Receber"
          value="R$ 450"
          variant="warning"
        />
      </div>
    </div>
  );
}
