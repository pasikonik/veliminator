import { LifeValue } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { GripVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ValueCardProps {
  value: LifeValue;
  index?: number;
  isUnsorted?: boolean;
  isFocused?: boolean;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onAddToSorted?: () => void;
  onRemoveFromSorted?: () => void;
  onFocus?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function ValueCard({
  value,
  index,
  isUnsorted = false,
  isFocused = false,
  onMoveLeft,
  onMoveRight,
  onAddToSorted,
  onRemoveFromSorted,
  onFocus,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: ValueCardProps) {
  const position = value.position;
  const isMobile = useIsMobile();

  const getCardStyles = () => {
    if (isUnsorted) {
      return "bg-slate-50 border border-slate-200 hover:bg-slate-100";
    }
    
    if (position && position <= 7) {
      return "bg-yellow-50 border border-yellow-200";
    }
    
    return "bg-white border border-slate-200";
  };

  const getPositionStyles = () => {
    if (isUnsorted) return "bg-slate-500";
    if (position && position <= 7) return "bg-yellow-600";
    return "bg-slate-500";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isUnsorted && onAddToSorted) {
        onAddToSorted();
      }
    }
  };

  return (
    <div
      className={cn(
        "value-card rounded-md flex items-center cursor-pointer transition-all duration-200",
        isMobile ? "p-2 space-x-1" : "p-2 space-x-2",
        getCardStyles(),
        isFocused && "ring-2 ring-primary ring-offset-1",
        "hover:shadow-sm hover:-translate-y-0.5"
      )}
      tabIndex={0}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      onClick={isUnsorted ? onAddToSorted : undefined}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="drag-handle text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
        <GripVertical className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
      </div>
      
      {!isUnsorted && position && (
        <div className={cn(
          "flex-shrink-0 text-white rounded-full flex items-center justify-center font-semibold",
          isMobile ? "w-4 h-4 text-xs" : "w-5 h-5 text-xs",
          getPositionStyles()
        )}>
          {position}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium text-slate-800 truncate ${isMobile ? 'text-xs' : 'text-xs'}`}>
          {value.name}
        </h3>
        {value.description && !isUnsorted && position && position <= 7 && !isMobile && (
          <p className="text-xs text-slate-600 truncate">{value.description}</p>
        )}
      </div>
      
      {!isUnsorted && (
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            className={`h-auto text-slate-400 hover:text-primary ${isMobile ? 'p-1' : 'p-0.5'}`}
            onClick={(e) => {
              e.stopPropagation();
              onMoveLeft?.();
            }}
            title="Przesuń w górę (Strzałka w lewo)"
          >
            <ChevronLeft className={isMobile ? "w-4 h-4" : "w-3 h-3"} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={`h-auto text-slate-400 hover:text-primary ${isMobile ? 'p-1' : 'p-0.5'}`}
            onClick={(e) => {
              e.stopPropagation();
              onMoveRight?.();
            }}
            title="Przesuń w dół (Strzałka w prawo)"
          >
            <ChevronRight className={isMobile ? "w-4 h-4" : "w-3 h-3"} />
          </Button>
        </div>
      )}
    </div>
  );
}
