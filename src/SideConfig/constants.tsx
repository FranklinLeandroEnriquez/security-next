import Icon from '../components/Incon';
import { SideNavItems } from './types';


export const SIDEVAR_ITEMS: SideNavItems[] = [
    {
        title: "Home",
        path: "/",
        icon: <Icon name="home" color="#c59a1a" size={20} />
    },
    {
        title: "Dashboard",
        path: "/dashboard/",
        icon: <Icon name="settings" color="#c59a1a" size={20} />,
        submenu: true,
        subMenuItems: [
            {
                title: "Users",
                path: "/dashboard/user",
                icon: <Icon name="user" color="white" size={20} />
            },
            {
                title: "Roles",
                path: "/dashboard/role",
                icon: <Icon name="user-check" color="white" size={20} />
            },
            {
                title: "Modules",
                path: "/dashboard/module",
                icon: <Icon name="bar-chart-2" color="white" size={20} />

            },
            {
                title: "Functions",
                path: "/dashboard/function",
                icon: <Icon name="function-square" color="white" size={20} />
            }
        ]
    },
    // {
    //     title: "Assing",
    //     path: "/",
    //     icon: <Icon name="settings" color="#FFD700" size={25} />,
    //     submenu: true,
    //     subMenuItems: [
    //         {
    //             title: "Fuctions to Roles",
    //             path: "/",
    //         },
    //         {
    //             title: "Roles to Users",
    //             path: "/",
    //         },
    //     ]
    // },
    // {
    //     title: "Reports",
    //     path: "/",
    //     icon: <Icon name="book-text" color="#FFD700" size={25} />,
    //     submenu: true,
    //     subMenuItems: [
    //         {
    //             title: "Users",
    //             path: "/",
    //         },
    //         {
    //             title: "Roles",
    //             path: "/",
    //         },
    //         {
    //             title: "Modules",
    //             path: "/",
    //         },
    //         {
    //             title: "Functions",
    //             path: "/",
    //         }
    //     ]
    // }
]