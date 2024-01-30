import { Report } from '@/types/Reports/shared/Report';
import BasicUsers from "@/types/Reports/users/allUsers"
import RelationalUsers from '@/types/Reports/users/relationalUser';
import { User } from "@/types/User/columns"

export const userRports = (): Report<User>[] => {
    return [
        {
            title: 'Basic Users',
            type: BasicUsers
        },{
            title: 'Relational Users',
            type: RelationalUsers
        }
    ]
}