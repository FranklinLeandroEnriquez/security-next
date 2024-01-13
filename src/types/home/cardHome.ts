import { CardProps } from "@/components/CardHome";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export const cardData: CardProps[] = [
    {
        label: "Total Users",
        amount: "10",
        description: "+20.1% from last month",
        icon: Users
    },
    {
        label: "Total Roles",
        amount: "3",
        description: "+180.1% from last month",
        icon: Users
    },
    {
        label: "Total Modules",
        amount: "10",
        description: "+19% from last month",
        icon: CreditCard
    },
    {
        label: "Total Functions",
        amount: "30",
        description: "+201 since last hour",
        icon: Activity
    }
];