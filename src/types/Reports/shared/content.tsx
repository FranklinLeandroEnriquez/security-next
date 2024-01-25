import { Report } from '@/types/Reports/shared/Report'
import AllUsers from "@/types/Reports/users/allUsers"

export const useReports = (ids: number[]): Report[] => {
    return [
        {
            title: "All User Report",
            type: <AllUsers id={ids}></AllUsers>
        }
    ]
}