import { useState, useCallback, useEffect } from "react";
import { Header } from "./components/header";
import { InstructionsPanel } from "./components/instructions-panel";
import { ValueCard } from "./components/value-card";
import { useValues } from "./hooks/use-values";

export default function App() {
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

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>("Wybierz wartość aby ją przesunąć");

  const handleMoveLeft = useCallback((index: number) => {
    if (index > 0) {
      moveValue(index, index - 1);
      const value = sortedValues[index];
      if (value) {
        setSelectedValue(`Przesunięto ${value.name} w górę`);
      }
    }
  }, [moveValue, sortedValues]);

  const handleMoveRight = useCallback((index: number) => {
    if (index < sortedValues.length - 1) {
      moveValue(index, index + 1);
      const value = sortedValues[index];
      if (value) {
        setSelectedValue(`Przesunięto ${value.name} w dół`);
      }
    }
  }, [moveValue, sortedValues]);

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

  const handleDelete = useCallback((index: number) => {
    const value = sortedValues[index];
    if (value) {
      removeFromSorted(value.id);
      setSelectedValue(`Usunięto ${value.name} z listy`);
    }
  }, [removeFromSorted, sortedValues]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (focusedIndex === null) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        if (event.shiftKey) {
          handleMoveUp(focusedIndex);
        } else {
          setFocusedIndex(prev => Math.max(0, (prev || 0) - 1));
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (event.shiftKey) {
          handleMoveDown(focusedIndex);
        } else {
          setFocusedIndex(prev => Math.min(sortedValues.length - 1, (prev || 0) + 1));
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        handleMoveLeft(focusedIndex);
        break;
      case "ArrowRight":
        event.preventDefault();
        handleMoveRight(focusedIndex);
        break;
      case "Delete":
      case "Backspace":
        event.preventDefault();
        handleDelete(focusedIndex);
        break;
      case "Escape":
        setFocusedIndex(null);
        break;
    }
  }, [focusedIndex, sortedValues.length, handleMoveUp, handleMoveDown, handleMoveLeft, handleMoveRight, handleDelete]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header values={values} lastSaved={lastSaved} onImportCSV={importFromCSV} />
      
      <main className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          <InstructionsPanel sortedValues={sortedValues} />
          
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Lista Wartości</h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Przeciągnij wartości aby ustawić ich ważność w Twoim życiu
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={resetOrder}
                      className="text-xs text-slate-600 hover:text-slate-800 flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Resetuj kolejność
                    </button>
                    
                    <div className="text-xs text-slate-600">
                      {selectedValue}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="space-y-1">
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
                    />
                  ))}
                  
                  {unsortedValues.length > 0 && (
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <h3 className="text-sm font-medium text-slate-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Wartości do posortowania
                        <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {unsortedValues.length}
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-4 gap-1">
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
