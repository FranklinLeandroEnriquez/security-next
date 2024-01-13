'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { CSSTransition } from 'react-transition-group';
import { useSidevarItems } from '@/SideConfig/constants';
import { SideNavItems } from '@/SideConfig/types';
import { Button, buttonVariants } from './ui/button';
import Image from 'next/image';

const SUBMENU_TRANSITION_TIMEOUT = 300;

const SideNav = () => {
    return (
        <div className="z-50 top-0 outline-none left-0 md:w-60 bg-[#181817] h-screen flex-1 overflow-y-scroll text-white fixed border-r-[1.2px] border-[#232321] md:flex ">
            <div className="flex flex-col w-full h-full">
                <Link
                    href="/"
                    className=" flex flex-row space-x-2 items-center justify-center md:justify-start md:px-6 h-30 sticky top-0 z-[100] bg-[#181817] shadow-lg shadow-zinc-500/10"
                >
                    <Image
                        src="/images/logo.png"
                        alt="Background UTN"
                        width={30}
                        height={30}
                        className="object-cover object-center hidden md:block filter grayscale"
                    />
                    <span className="h-16" />
                    <span className="text-base hidden md:flex">SECURITY UTN</span>
                </Link>

                <div className="flex flex-col space-y-3 px-3 py-5">
                    {useSidevarItems().filter(item => item.canRead).map((item, idx) => {
                        return <MenuItem key={`menu-item-${idx}`} item={item} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideNav;

// ...
const MenuItem = ({ item }: { item: SideNavItems }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(true);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    const isSubItemActive = item.subMenuItems?.some(subItem => pathname.startsWith(subItem.path));

    return (
        <div className="p-2">
            {item.submenu ? (
                <>
                    <Button variant="ghost"
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg text-white hover:bg-yellow-500 hover:text-black w-full justify-between ${isSubItemActive ? 'bg-[#353535]' : ''}`}
                    >
                        <div className="flex flex-row space-x-3 items-center">
                            {item.icon}
                            <span className="text-base  flex">{item.title}</span>
                        </div>

                        <div className={`${subMenuOpen ? 'rotate-180' : ''} transition-transform duration-300 flex`}>
                            <ChevronDown color="white" size={25} />
                        </div>
                    </Button>

                    <CSSTransition
                        in={subMenuOpen}
                        timeout={SUBMENU_TRANSITION_TIMEOUT}
                        classNames="menu-secondary"
                        unmountOnExit
                    >
                        <div className="mt-4 ml-4 flex flex-col space-y-2">
                            {item.subMenuItems?.filter(subItem => subItem.canRead).map((subItem, idx) => {
                                return (
                                    <Link
                                        key={`sub-item-${idx}`}
                                        href={subItem.path}
                                        className={`${pathname.startsWith(subItem.path) ? `custom-class ${buttonVariants()} bg-yellow-500 ml-3 w-[83%] transition-colors duration-200` : `custom-class ${buttonVariants({ variant: "ghost" })} ml-3 w-[83%]  hover:bg-[#353535] transition-colors duration-200`}`}
                                    >
                                        <div className="flex flex-row space-x-2 items-center justify-start flex-auto">
                                            {subItem.icon}
                                            <span>{subItem.title}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </CSSTransition>
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center rounded-lg hover:bg-[#c1be95] ${pathname.startsWith(item.path) ? 'bg-[#30300a]' : ''}`}
                >
                    {item.icon}
                    <span className=" text-base flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};
// ...