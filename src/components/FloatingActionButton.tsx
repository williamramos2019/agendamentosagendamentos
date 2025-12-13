import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: ReactNode;
}

export function FloatingActionButton({ onClick, icon }: FloatingActionButtonProps) {
  return (
    <Button
      variant="fab"
      size="fab"
      onClick={onClick}
      className="fixed bottom-24 right-4 z-[55] animate-scale-in"
    >
      {icon || <Plus className="h-7 w-7" />}
    </Button>
  );
}
