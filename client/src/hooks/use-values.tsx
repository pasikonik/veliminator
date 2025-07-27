import { useState, useEffect, useCallback } from "react";
import { LifeValue } from "@shared/schema";
import { DEFAULT_VALUES } from "@/lib/default-values";
import { CsvExportRow } from "@shared/schema";

const STORAGE_KEY = "life-values-sorting";

export function useValues() {
  const [values, setValues] = useState<LifeValue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [...DEFAULT_VALUES];
      }
    }
    return [...DEFAULT_VALUES];
  });

  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    setLastSaved(new Date());
  }, [values]);

  const sortedValues = values
    .filter(v => v.position !== null)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const unsortedValues = values.filter(v => v.position === null);

  const updateValuePosition = useCallback((valueId: string, newPosition: number | null) => {
    setValues(prev => prev.map(value => 
      value.id === valueId ? { ...value, position: newPosition } : value
    ));
  }, []);

  const moveValue = useCallback((fromIndex: number, toIndex: number) => {
    const newSortedValues = [...sortedValues];
    const [movedValue] = newSortedValues.splice(fromIndex, 1);
    newSortedValues.splice(toIndex, 0, movedValue);

    // Update positions
    const updatedValues = [...values];
    newSortedValues.forEach((value, index) => {
      const valueIndex = updatedValues.findIndex(v => v.id === value.id);
      if (valueIndex !== -1) {
        updatedValues[valueIndex] = { ...value, position: index + 1 };
      }
    });

    setValues(updatedValues);
  }, [sortedValues, values]);

  const addToSorted = useCallback((valueId: string) => {
    const nextPosition = sortedValues.length + 1;
    updateValuePosition(valueId, nextPosition);
  }, [sortedValues.length, updateValuePosition]);

  const removeFromSorted = useCallback((valueId: string) => {
    const value = values.find(v => v.id === valueId);
    if (!value || value.position === null) return;

    const oldPosition = value.position;
    
    // Remove from sorted
    updateValuePosition(valueId, null);

    // Adjust positions of values that were after this one
    setValues(prev => prev.map(v => {
      if (v.position !== null && v.position > oldPosition) {
        return { ...v, position: v.position - 1 };
      }
      return v;
    }));
  }, [values, updateValuePosition]);

  const resetOrder = useCallback(() => {
    setValues([...DEFAULT_VALUES]);
  }, []);

  const importFromCSV = useCallback((csvData: CsvExportRow[]) => {
    const newValues = [...DEFAULT_VALUES];
    
    csvData.forEach(csvRow => {
      const valueIndex = newValues.findIndex(v => 
        v.name.toLowerCase() === csvRow.name.toLowerCase()
      );
      if (valueIndex !== -1) {
        newValues[valueIndex] = { 
          ...newValues[valueIndex], 
          position: csvRow.position 
        };
      }
    });

    setValues(newValues);
  }, []);

  return {
    values,
    sortedValues,
    unsortedValues,
    lastSaved,
    moveValue,
    addToSorted,
    removeFromSorted,
    resetOrder,
    importFromCSV,
    updateValuePosition,
  };
}
