import { Report } from '@/types/Reports/shared/Report';
import BasicFunctions from './allFunctions';
import { RelationalFunctions } from './relationalFunctions';
import { Function } from '@/types/Function/columns';
export const functionReports = (): Report<Function>[] => {
    return [
        {
            title: 'Basic Functions',
            type: BasicFunctions
        },
        {
            title: 'Relational Functions',
            type: RelationalFunctions
        }
    ]
}