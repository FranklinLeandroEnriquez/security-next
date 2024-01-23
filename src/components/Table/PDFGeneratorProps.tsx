import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import PDFPreviewDialog from '@/components/ui/ModalReport';
import { Table } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
interface PDFGeneratorProps<TData> {
    table: Table<TData>;
    moduleName: string;
    description: string;
    data?: TData[]; // Agrega esta línea
    reportRelationData?: TData[];
    setGeneratePdfClicked: (value: boolean) => void;
}

interface Row<T> {
    isSelected: boolean;
    data: T;
}

export function PDFGenerator<TData>({ table, moduleName, description, data = [], reportRelationData = [], setGeneratePdfClicked }: PDFGeneratorProps<TData>) {
    const [isPdfPreviewOpen, setPdfPreviewOpen] = useState(false);
    const [reportData, setReportData] = useState<TData[]>(data);
    // const [reportRelation, setReportRelation] = useState<TData[]>(data);

    const handleGenerateReport = (rows: Row<TData>[]): TData[] => {
        const selectedRows = rows.filter((row) => row.isSelected);
        const report = selectedRows.map((row) => {
            return row.data;
        });
        return report;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>Generar Reporte</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => {
                    const rows: Row<TData>[] = table.getRowModel().rows.map(row => ({
                        isSelected: row.getIsSelected(),
                        data: row.original
                    }));
                    const report = handleGenerateReport(rows);
                    setReportData(report);
                    // console.log(report);
                    setPdfPreviewOpen(true);
                }}>
                    Reporte Individual
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {
                    setGeneratePdfClicked(true);
                    setReportData(reportRelationData);
                    // console.log("PDFGeneratorProps", reportRelationData);
                    setPdfPreviewOpen(true);
                }}>
                    Reporte Relacional
                </DropdownMenuItem>
            </DropdownMenuContent>
            <PDFPreviewDialog
                title={moduleName}
                data={reportData}
                description={`${description} Report`}
                open={isPdfPreviewOpen}
                onOpenChange={setPdfPreviewOpen}
            />
        </DropdownMenu>
    );
}