import { Report } from '@/types/Reports/shared/Report';
import basicModules from "@/types/Reports/modules/allModules"
import relationalModules from "@/types/Reports/modules/relationalModules"
import { Module } from "@/types/Module/columns"

export const moduleReports = (): Report<Module>[] => {
    return [
        {
            title: 'Basic Modules',
            type: basicModules
        },
        {
            title: 'Relational Modules',
            type: relationalModules
        }
    ]
}