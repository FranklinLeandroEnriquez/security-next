import { Report } from '@/types/Reports/shared/Report';
import BasicFunctions from './allFunctions';
import { relationalFunctions } from './relationalFunctions';
import { Function } from '@/types/Function/columns';
export const functionReports = (): Report<Function>[] => {
    return [
        {
            title: 'Basic Functions',
            type: BasicFunctions
        },
        {
            title: 'Relational Functions',
            type: relationalFunctions
        }
    ]
}