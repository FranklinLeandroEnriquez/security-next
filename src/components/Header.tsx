'use client';
import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import useScroll from './hooks/use-scroll';
import { cn } from '@/lib/utils';

interface HeaderProps {
    title: string;
    IconComponent: React.ComponentType;
}

const Header: React.FC<HeaderProps> = ({ title, IconComponent }) => {
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();

    return (
        <div
            className={cn(
                `pb-1 pt-1 sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
                {
                    'border-b-2 bg-slate-500 bg-white/85 backdrop-blur-lg': scrolled,
                    'border-b border-black-200 bg-black': selectedLayout,
                },
            )}
        >
            <div className="flex h-10 items-center justify-between w-full">
                <div className=" ml-9 flex items-center space-x-4">
                    <span className="h-7 w-7 bg-black-300 rounded-lg" />
                    <IconComponent />
                    <span className="font-bold text-xl flex ">{title}</span>
                </div>

                <div className="mr-5 hidden md:block">
                    <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
                        <span className="font-semibold text-sm">HQ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;