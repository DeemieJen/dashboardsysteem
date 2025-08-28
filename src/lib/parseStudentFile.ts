// Utility to parse CSV and XLSX files in the browser
// Uses papaparse for CSV and xlsx for Excel
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function parseStudentFile(file: File): Promise<{ name: string; group: string }[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(
            results.data.map((row: any) => ({
              name: row.name || row.Naam || '',
              group: row.group || row.Groep || '',
            }))
          );
        },
        error: reject,
      });
    });
  } else if (ext === 'xlsx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const [header, ...body] = rows;
        const nameIdx = header.findIndex((h: string) => h.toLowerCase() === 'name' || h.toLowerCase() === 'naam');
        const groupIdx = header.findIndex((h: string) => h.toLowerCase() === 'group' || h.toLowerCase() === 'groep');
        resolve(
          body.map((row: any[]) => ({
            name: row[nameIdx] || '',
            group: row[groupIdx] || '',
          }))
        );
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  } else {
    throw new Error('Unsupported file type');
  }
}
