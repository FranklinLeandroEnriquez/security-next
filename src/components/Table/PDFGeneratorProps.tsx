import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import PDFPreviewDialog from '@/components/ui/ModalReport';
import { Table } from "@tanstack/react-table";

interface PDFGeneratorProps<TData> {
    table: Table<TData>;
    moduleName: string;
    description: string;
    data?: TData[]; // Agrega esta línea
}

interface Row<T> {
    isSelected: boolean;
    data: T;
}

export function PDFGenerator<TData>({ table, moduleName, description, data = [] }: PDFGeneratorProps<TData>) {
    const [isPdfPreviewOpen, setPdfPreviewOpen] = useState(false);
    const [reportData, setReportData] = useState<TData[]>(data); // Usa la prop data aquí

    const handleGenerateReport = (rows: Row<TData>[]): TData[] => {
        const selectedRows = rows.filter((row) => row.isSelected);
        const report = selectedRows.map((row) => {
            return row.data;
        });
        return report;
    };

    return (
        <Button onClick={() => {
            const rows: Row<TData>[] = table.getRowModel().rows.map(row => ({
                isSelected: row.getIsSelected(),
                data: row.original
            }));
            const report = handleGenerateReport(rows);
            setReportData(report);
        }}>
            <PDFPreviewDialog
                title={moduleName}
                data={reportData}
                description={`${description} Report`}
                open={isPdfPreviewOpen}
                onOpenChange={setPdfPreviewOpen}
            />
        </Button>
    );
}