import { Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyGoalProps {
  current: number;
  goal: number;
}

export function DailyGoal({ current, goal }: DailyGoalProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isCompleted = percentage >= 100;

  return (
    <div className="px-4 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className={cn(
        "rounded-2xl p-4 border transition-all duration-200",
        isCompleted 
          ? "bg-success/5 border-success/20" 
          : "bg-card border-border"
      )}>
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isCompleted ? "bg-success/10" : "bg-primary/10"
          )}>
            <Target className={cn(
              "h-5 w-5",
              isCompleted ? "text-success" : "text-primary"
            )} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">Meta Diária</p>
            <p className="text-xs text-muted-foreground">
              {isCompleted ? "Meta alcançada! 🎉" : `Faltam R$ ${(goal - current).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            </p>
          </div>
          <div className="text-right">
            <p className={cn(
              "font-bold text-lg",
              isCompleted ? "text-success" : "text-foreground"
            )}>
              {percentage.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              isCompleted ? "bg-success" : "gradient-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>R$ {current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span>R$ {goal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
