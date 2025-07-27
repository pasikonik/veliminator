import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Info, List } from "lucide-react";
import { Header } from "@/components/header";
import { InstructionsPanel } from "@/components/instructions-panel";
import { ValueCard } from "@/components/value-card";
import { useValues } from "@/hooks/use-values";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ValuesSorting() {
  const isMobile = useIsMobile();
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
      
      <main className={`max-w-7xl mx-auto ${isMobile ? 'px-3 py-4' : 'px-6 py-8'}`}>
        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-12 gap-8'}`}>
          {!isMobile && <InstructionsPanel sortedValues={sortedValues} />}
          
          <div className={isMobile ? '' : 'col-span-9'}>
            <div className={`bg-white ${isMobile ? 'rounded-lg' : 'rounded-xl'} shadow-sm border border-slate-200`}>
              <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-slate-200`}>
                <div className={`flex items-center ${isMobile ? 'flex-col space-y-3' : 'justify-between'}`}>
                  <div className={isMobile ? 'text-center' : ''}>
                    <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-800`}>Lista Wartości</h2>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-600 mt-1`}>
                      {isMobile ? 'Dotknij i przeciągnij lub użyj przycisków' : 'Przeciągnij wartości aby ustawić ich ważność w Twoim życiu'}
                    </p>
                  </div>
                  
                  <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'space-x-4'}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetOrder}
                      className="text-slate-600 hover:text-slate-800"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Resetuj kolejność
                    </Button>
                    
                    {!isMobile && (
                      <div className="text-sm text-slate-600 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        <span>{selectedValue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={isMobile ? 'p-4' : 'p-6'}>
                <div className={isMobile ? 'space-y-1' : 'space-y-2'}>
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
                    <div className={`border-t border-slate-200 ${isMobile ? 'pt-4 mt-4' : 'pt-6 mt-6'}`}>
                      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-slate-800 mb-4 flex items-center`}>
                        <List className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-slate-400 mr-2`} />
                        Wartości do posortowania
                        <span className={`ml-2 px-2 py-1 bg-slate-100 text-slate-600 ${isMobile ? 'text-xs' : 'text-sm'} rounded-full`}>
                          {unsortedValues.length}
                        </span>
                      </h3>
                      
                      <div className={`grid ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-4 gap-2'}`}>
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
          
          {isMobile && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Instrukcje mobilne</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <p>• Dotknij wartość i przeciągnij aby zmienić kolejność</p>
                <p>• Użyj przycisków ← → aby przesunąć wybraną wartość</p>
                <p>• Dotknij wartość nieposortowaną aby dodać do listy</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span>Posortowane:</span>
                  <span className="font-semibold text-primary">{sortedValues.length}/40</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
