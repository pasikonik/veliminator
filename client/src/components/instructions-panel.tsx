import { Mouse, Keyboard, Save } from "lucide-react";
import { LifeValue } from "@shared/schema";

interface InstructionsPanelProps {
  sortedValues: LifeValue[];
}

export function InstructionsPanel({ sortedValues }: InstructionsPanelProps) {
  const sortedCount = sortedValues.length;
  const totalCount = 40;
  const progressPercentage = (sortedCount / totalCount) * 100;

  return (
    <div className="col-span-3">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sticky top-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Instrukcje</h2>
        
        <div className="space-y-3 text-xs text-slate-600">
          <div className="flex items-start space-x-2">
            <Mouse className="text-primary mt-0.5 w-3 h-3" />
            <div>
              <p className="font-medium">Przeciągnij i upuść</p>
              <p>Chwytaj za uchwyt i przeciągaj wartości</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Keyboard className="text-primary mt-0.5 w-3 h-3" />
            <div>
              <p className="font-medium">Nawigacja klawiaturą</p>
              <p>↑↓ wybierz, ← w górę, → w dół, Delete usuń</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Save className="text-primary mt-0.5 w-3 h-3" />
            <div>
              <p className="font-medium">Auto-zapis</p>
              <p>Zmiany zapisywane automatycznie</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-200">
          <h3 className="font-medium text-slate-800 mb-2 text-xs">Status sortowania</h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Posortowane wartości:</span>
            <span className="font-semibold text-primary">{sortedCount}/{totalCount}</span>
          </div>
          <div className="mt-2 bg-slate-200 rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
