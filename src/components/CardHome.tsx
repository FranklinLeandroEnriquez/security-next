/** @format */

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from 'react-countup';

export type CardProps = {
    label: string;
    icon: LucideIcon;
    amount: number;
    description: string;
};

export default function CardHome(props: CardProps) {
    const duration = Math.max(1, 5 / Math.log(props.amount + 1));
    return (
        <div className="relative aspect-square min-w-[200px] min-h-[250px] md:min-w-[200px] md:min-h-[250px]">
            <CardContent className="flex flex-col items-center justify-between h-full p-4">
                <p className="text-lg md:text-xl lg:text-4xl truncate w-full text-center font-semibold text-gray-500">
                    {props.label}
                </p>

                <props.icon className="h-8 w-8 md:h-12 md:w-12 text-gray-400 my-2" />

                <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold">
                    <CountUp end={props.amount} duration={duration} />
                </h2>

                <p className="text-sm md:text-lg lg:text-2xl truncate w-full text-center text-gray-500">
                    {props.description}
                </p>
            </CardContent>
        </div>
    );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={cn(
                "flex w-full flex-col gap-3 rounded-xl border p-5 shadow",
                props.className
            )}
        />
    );
}
