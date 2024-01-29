import { Report } from '@/types/Reports/shared/Report';
import BasicFunctions from './allFunctions';
import { Function } from '@/types/Function/columns';
export const functionReports = (): Report<Function>[] => {
    return [
        {
            title: 'Basic Functions',
            type: BasicFunctions
        }
    ]
}