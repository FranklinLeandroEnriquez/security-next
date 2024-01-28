import { Report } from '@/types/Reports/shared/Report';
import { UserResponse } from '@/types/User/UserResponse';
import AllUsers from "@/types/Reports/users/allUsers"
import { User } from "@/types/User/columns"

export const userRports = (): Report<User>[] => {
    return [
        {
            title: 'All Users',
            type: AllUsers
        }
    ]
}