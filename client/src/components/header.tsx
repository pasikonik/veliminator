import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, importFromCSV } from "@/lib/csv-utils";
import { LifeValue, CsvExportRow } from "@shared/schema";
import { Download, Upload, Check, SortAsc } from "lucide-react";
import { useRef } from "react";

interface HeaderProps {
  values: LifeValue[];
  lastSaved: Date;
  onImportCSV: (data: CsvExportRow[]) => void;
}

export function Header({ values, lastSaved, onImportCSV }: HeaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCSV = () => {
    try {
      exportToCSV(values);
      toast({
        title: "Sukces",
        description: "Lista została wyeksportowana do CSV",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wyeksportować listy",
        variant: "destructive",
      });
    }
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const csvData = await importFromCSV(file);
      onImportCSV(csvData);
      toast({
        title: "Sukces",
        description: "Lista została zaimportowana z CSV",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się zaimportować listy",
        variant: "destructive",
      });
    }

    // Reset file input
    event.target.value = "";
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <SortAsc className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Eliminacja Wartości</h1>
              <p className="text-xs text-slate-600">Sortuj swoje życiowe priorytety</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Check className="w-3 h-3 text-accent" />
              <span>Zapisano automatycznie</span>
            </div>
            
            <Button 
              onClick={handleImportCSV}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Upload className="w-3 h-3" />
              <span>Importuj CSV</span>
            </Button>
            
            <Button 
              onClick={handleExportCSV}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Download className="w-3 h-3" />
              <span>Eksportuj CSV</span>
            </Button>

            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
