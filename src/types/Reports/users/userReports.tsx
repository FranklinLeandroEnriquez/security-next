import { Report } from '@/types/Reports/shared/Report';
import BasicUsers from "@/types/Reports/users/allUsers"
import { User } from "@/types/User/columns"

export const userRports = (): Report<User>[] => {
    return [
        {
            title: 'Basic Users',
            type: BasicUsers
        }
    ]
}