import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PDFPreviewDialogProps {
    ReportComponent: React.ReactElement,
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({ ReportComponent, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='min-h-[20rem] h-[80vh] flex flex-col items-center'>
                <div className='flex-grow w-full'>
                    <PDFViewer className='w-full h-full '>
                        {ReportComponent}
                    </PDFViewer>
                </div>
                <div className='w-1/3 flex items-center justify-center'>
                    <Button variant='default'>
                        <PDFDownloadLink document={ReportComponent} fileName="report.pdf">
                            {({ loading }) =>
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