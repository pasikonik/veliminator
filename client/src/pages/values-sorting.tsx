import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Info, List } from "lucide-react";
import { Header } from "@/components/header";
import { InstructionsPanel } from "@/components/instructions-panel";
import { ValueCard } from "@/components/value-card";
import { useValues } from "@/hooks/use-values";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";

export default function ValuesSorting() {
  const {
    values,
    sortedValues,
    unsortedValues,
    lastSaved,
    moveValue,
    addToSorted,
    removeFromSorted,
    resetOrder,
    importFromCSV,
  } = useValues();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>("Wybierz wartość aby ją przesunąć");

  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) {
      moveValue(index, index - 1);
    }
  }, [moveValue]);

  const handleMoveDown = useCallback((index: number) => {
    if (index < sortedValues.length - 1) {
      moveValue(index, index + 1);
    }
  }, [moveValue, sortedValues.length]);

  const handleMoveLeft = useCallback((index: number) => {
    // Moving left means moving up in the list (decreasing position)
    if (index > 0) {
      moveValue(index, index - 1);
      const value = sortedValues[index];
      if (value) {
        setSelectedValue(`Przesunięto ${value.name} w górę`);
      }
    }
  }, [moveValue, sortedValues]);

  const handleMoveRight = useCallback((index: number) => {
    // Moving right means moving down in the list (increasing position)
    if (index < sortedValues.length - 1) {
      moveValue(index, index + 1);
      const value = sortedValues[index];
      if (value) {
        setSelectedValue(`Przesunięto ${value.name} w dół`);
      }
    }
  }, [moveValue, sortedValues]);

  const handleSelect = useCallback((index: number) => {
    const value = sortedValues[index];
    if (value) {
      setSelectedValue(`Wybrano: ${value.name}`);
    }
  }, [sortedValues]);

  const handleDelete = useCallback((index: number) => {
    const value = sortedValues[index];
    if (value) {
      removeFromSorted(value.id);
      setSelectedValue(`Usunięto ${value.name} z listy`);
    }
  }, [removeFromSorted, sortedValues]);

  const { focusedIndex, setFocusedIndex } = useKeyboardNavigation({
    itemCount: sortedValues.length,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
    onMoveLeft: handleMoveLeft,
    onMoveRight: handleMoveRight,
    onSelect: handleSelect,
    onDelete: handleDelete,
  });

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      moveValue(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header values={values} lastSaved={lastSaved} onImportCSV={importFromCSV} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          <InstructionsPanel sortedValues={sortedValues} />
          
          <div className="col-span-9">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Lista Wartości</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Przeciągnij wartości aby ustawić ich ważność w Twoim życiu
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetOrder}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Resetuj kolejność
                    </Button>
                    
                    <div className="text-sm text-slate-600 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      <span>{selectedValue}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-2">
                  {sortedValues.map((value, index) => (
                    <ValueCard
                      key={value.id}
                      value={value}
                      index={index}
                      isFocused={focusedIndex === index}
                      onMoveLeft={() => handleMoveLeft(index)}
                      onMoveRight={() => handleMoveRight(index)}
                      onRemoveFromSorted={() => {
                        removeFromSorted(value.id);
                        setSelectedValue(`Usunięto ${value.name} z listy`);
                      }}
                      onFocus={() => {
                        setFocusedIndex(index);
                        setSelectedValue(`Wybrano: ${value.name}`);
                      }}
                      onDragStart={handleDragStart(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop(index)}
                    />
                  ))}
                  
                  {unsortedValues.length > 0 && (
                    <div className="border-t border-slate-200 pt-6 mt-6">
                      <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                        <List className="w-5 h-5 text-slate-400 mr-2" />
                        Wartości do posortowania
                        <span className="ml-2 px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                          {unsortedValues.length}
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {unsortedValues.map((value) => (
                          <ValueCard
                            key={value.id}
                            value={value}
                            isUnsorted
                            onAddToSorted={() => {
                              addToSorted(value.id);
                              setSelectedValue(`Dodano ${value.name} do listy`);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
