'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Ghost } from 'lucide-react';

import { SIDEVAR_ITEMS } from '@/SideConfig/constants';
import { SideNavItems } from '@/SideConfig/types';
import { Button, buttonVariants } from './ui/button';

const SideNav = () => {
    return (
        <div className="md:w-60 bg-[#1E1E1E] h-screen flex-1 text-white fixed border-r hidden md:flex">
            <div className="flex flex-col space-y-6 w-full">
                <Link
                    href="/"
                    className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b  h-12 w-full"
                >
                    <span className="h-7 w-7  rounded-lg" />
                    <span className="font-bold text-base hidden md:flex">SECURITY UTN</span>
                </Link>

                <div className="flex flex-col space-y-2 md:px-6 ">
                    {SIDEVAR_ITEMS.map((item, idx) => {
                        return <MenuItem key={idx} item={item} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItems }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(true);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="">
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg text-white hover-bg-[#36342e] w-full justify-between hover:bg-[#36342e] ${pathname.includes(item.path) ? '' : ''
                            }`}
                    >
                        <div className="flex flex-row space-x-3 items-center">
                            {item.icon}
                            <span className="font-semibold text-base  flex">{item.title}</span>
                        </div>

                        <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                            <ChevronDown color="white" size={25} />
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-1 ml-2 flex flex-col space-y-2">{item.subMenuItems?.map((subItem, idx) => {
                            return (
                                <Link
                                    key={idx}
                                    href={subItem.path}
                                    className={`${subItem.path === pathname ? `${buttonVariants()} bg-[#c59a1a] ml-3 w-[70%]` : ` ${buttonVariants({ variant: "ghost" })} ml-3 w-[70%]  hover:bg-[#c59a1a]`}`}
                                >
                                    <div className="flex flex-row space-x-2 flex-auto">
                                        {subItem.icon}
                                        <span>{subItem.title}</span>
                                    </div>
                                </Link>
                            );
                        })}</div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-[#36342e] ${item.path === pathname ? 'bg-[#36342e]' : ''
                        }`}
                >
                    {item.icon}
                    <span className="font-semibold text-base flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};