import Icon from '../components/Incon';
import { SideNavItems } from './types';


export const SIDEVAR_ITEMS: SideNavItems[] = [
    {
        title: "Home",
        path: "/",
        icon: <Icon name="home" color="#FFD700" size={25} />
    },
    {
        title: "Dashboard",
        path: "/dashboard/user",
        icon: <Icon name="settings" color="#FFD700" size={25} />,
        submenu: true,
        subMenuItems: [
            {
                title: "Users",
                path: "/dashboard/user",
            },
            {
                title: "Roles",
                path: "/dashboard/role",
            },
            {
                title: "Modules",
                path: "/",

            },
            {
                title: "Functions",
                path: "/",
            }
        ]
    },
    {
        title: "Assing",
        path: "/",
        icon: <Icon name="settings" color="#FFD700" size={25} />,
        submenu: true,
        subMenuItems: [
            {
                title: "Fuctions to Roles",
                path: "/",
            },
            {
                title: "Roles to Users",
                path: "/",
            },
        ]
    },
    {
        title: "Reports",
        path: "/",
        icon: <Icon name="book-text" color="#FFD700" size={25} />,
        submenu: true,
        subMenuItems: [
            {
                title: "Users",
                path: "/",
            },
            {
                title: "Roles",
                path: "/",
            },
            {
                title: "Modules",
                path: "/",
            },
            {
                title: "Functions",
                path: "/",
            }
        ]
    }
]