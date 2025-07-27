import Papa from "papaparse";
import { LifeValue, CsvExportRow } from "@shared/schema";

export const exportToCSV = (values: LifeValue[]): void => {
  const sortedValues = values
    .filter(v => v.position !== null)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const csvData: CsvExportRow[] = sortedValues.map(value => ({
    name: value.name,
    position: value.position || 0,
  }));

  const csv = Papa.unparse(csvData, {
    header: true,
    columns: ["name", "position"],
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `wartosci_zyciowe_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importFromCSV = (file: File): Promise<CsvExportRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          const validatedData: CsvExportRow[] = data
            .filter(row => row.name && !isNaN(Number(row.position)))
            .map(row => ({
              name: String(row.name).trim(),
              position: Number(row.position),
            }));
          resolve(validatedData);
        } catch (error) {
          reject(new Error("Błąd podczas parsowania pliku CSV"));
        }
      },
      error: (error) => {
        reject(new Error(`Błąd podczas czytania pliku: ${error.message}`));
      },
    });
  });
};
