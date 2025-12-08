import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      variant="fab"
      size="fab"
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 animate-scale-in"
    >
      <Plus className="h-7 w-7" />
    </Button>
  );
}
