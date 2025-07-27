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
        // Przesuń focus w górę (wartość poszła wyżej)
        if (focusedIndex > 0) {
          setFocusedIndex(focusedIndex - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        onMoveRight(focusedIndex);
        // Przesuń focus w dół (wartość poszła niżej)
        if (focusedIndex < itemCount - 1) {
          setFocusedIndex(focusedIndex + 1);
        }
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
          // Po usunięciu, ustaw focus na poprzedni element lub na null jeśli lista jest pusta
          const newFocusIndex = focusedIndex > 0 ? focusedIndex - 1 : (itemCount > 1 ? 0 : null);
          setFocusedIndex(newFocusIndex);
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
