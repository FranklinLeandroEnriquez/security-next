import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, PDFViewer } from '@react-pdf/renderer';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'; // Asume que Dialog es el archivo donde tienes definidos tus componentes de diálogo
import PDFComponent from '@/components/PdfReport'; // Asume que PDFComponent es el componente que genera tu PDF
import { Button } from '@/components/ui/button';

interface PDFPreviewDialogProps {
    title: string;
    data: Record<string, any>;
    description: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({ title, data, description,open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger>Ver PDF</DialogTrigger>
            <DialogContent className='min-h-[20rem] h-[80vh] flex flex-col items-center'>
                <div className='flex-grow w-full'>
                    <PDFViewer className='w-full h-full '>
                        <PDFComponent title={title} data={data} description={description}/>
                    </PDFViewer>
                </div>
                <div className='w-1/3 flex items-center justify-center'>
                <Button variant='default'>
                    <PDFDownloadLink document={<PDFComponent title={title} data={data} description={description} />} fileName="report.pdf">
                        {({ blob, url, loading, error }) =>
                            loading ? 'Loading document...' : 'Download'
                        }
                    </PDFDownloadLink>
                </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PDFPreviewDialog;