import { saveAs } from 'file-saver'

export function exportToCSV(data: any[], filename: string) {
    const file = `${filename}.csv`
    const csv = [
        Object.keys(data[0]).join(","),
        ...data.map(row => Object.values(row).map(String).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, file);
}

export function exportToJSON(data: any[], filename: string) {
    const file = `${filename}.csv`
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, file);
}
