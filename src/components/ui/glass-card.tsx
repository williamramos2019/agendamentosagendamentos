import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, backgroundColor: "rgba(255,255,255,0.06)" } : undefined}
      className={cn(
        "glass-premium rounded-2xl p-5 shadow-salon transition-all",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
