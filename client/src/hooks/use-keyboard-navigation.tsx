import { useEffect, useCallback, useState } from "react";

interface UseKeyboardNavigationProps {
  itemCount: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onSelect: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function useKeyboardNavigation({
  itemCount,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  onSelect,
  onDelete,
}: UseKeyboardNavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (focusedIndex === null) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        if (event.shiftKey) {
          onMoveUp(focusedIndex);
        } else {
          setFocusedIndex(prev => Math.max(0, (prev || 0) - 1));
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (event.shiftKey) {
          onMoveDown(focusedIndex);
        } else {
          setFocusedIndex(prev => Math.min(itemCount - 1, (prev || 0) + 1));
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        onMoveLeft(focusedIndex);
        break;
      case "ArrowRight":
        event.preventDefault();
        onMoveRight(focusedIndex);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        onSelect(focusedIndex);
        break;
      case "Delete":
      case "Backspace":
        event.preventDefault();
        if (onDelete) {
          onDelete(focusedIndex);
        }
        break;
      case "Escape":
        setFocusedIndex(null);
        break;
    }
  }, [focusedIndex, itemCount, onMoveUp, onMoveDown, onMoveLeft, onMoveRight, onSelect, onDelete]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    focusedIndex,
    setFocusedIndex,
  };
}
