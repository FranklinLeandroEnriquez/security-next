'use client';
import CardHome, { CardProps } from '@/components/CardHome';
import Header from '@/components/Header'
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { HomeIcon } from "lucide-react";
import React from 'react'
import { cardData } from "@/types/home/cardHome";


export default function Home() {
    return (
        <>
            <Header title='Home' icon={<HomeIcon size={26} />} />
            <MaxWidthWrapper className='my-5'>
                <div className="flex flex-col gap-5  w-full">
                    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
                        {cardData.map((d, i) => (
                            <CardHome
                                key={i}
                                amount={d.amount}
                                description={d.description}
                                icon={d.icon}
                                label={d.label}
                            />
                        ))}
                    </section>
                    <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
                        {/* <CardContent>
                            <p className="p-4 font-semibold">Overview</p>

                            <BarChart />
                        </CardContent> */}
                        {/* <CardContent className="flex justify-between gap-4">
                            <section>
                                <p>Recent Sales</p>
                                <p className="text-sm text-gray-400">
                                    You made 265 sales this month.
                                </p>
                            </section>
                            {uesrSalesData.map((d, i) => (
                                <SalesCard
                                    key={i}
                                    email={d.email}
                                    name={d.name}
                                    saleAmount={d.saleAmount}
                                />
                            ))}
                        </CardContent>                         */}
                    </section>
                </div>
            </MaxWidthWrapper>
        </>
    )
}
