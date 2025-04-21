import React, { useState, useEffect } from 'react';

import { Button } from "../../components/ui/button";
import {
    Menu, Moon, Sun, Users, Phone, AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"
import { Link } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '../../components/ui/sidebar';
import { useSidebar } from '../../components/ui/sidebar';
import SidebarContentComponent from './SidebarContent';
import SidebarAccountComponent from './SidebarAccount';

type SidebarComponentProps = React.ComponentProps<typeof Sidebar>

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    mainContent: [
        {
            title: "Dashboard",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: "Customers",
            url: "#",
            icon: Bot,
        },
        {
            title: "Contacts",
            url: "#",
            icon: BookOpen,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
        },
    ],
}

const SidebarComponent: React.FC<SidebarComponentProps> = (props) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => {
            const newMode = !prevState;
            // Save the mode in localStorage for persistence across page reloads
            localStorage.setItem('darkMode', newMode.toString());

            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            return newMode;
        });
    };
    /*<header className="fixed top-0 left-0 right-0 z-50 w-full border-b shadow-sm bg-white dark:bg-[#3ac285] transition-colors">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between text-black dark:text-white">

            <Link to="/dashboard" className="text-xl font-bold text-primary hover:text-[#3ac285] dark:text-black dark:hover:text-white">APP Name</Link>

            <nav className="hidden md:flex gap-6">
                <Link to="/customers" className="text-lg font-bold text-primary hover:text-[#3ac285] dark:text-black dark:hover:text-white">Customers</Link>
                <Link to="/contacts" className="text-lg font-bold text-primary hover:text-[#3ac285] dark:text-black dark:hover:text-white">Contacts</Link>
            </nav>

            <Button onClick={toggleDarkMode} variant="outline" size="icon" className='hover:border-[#3ac285]'>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
        </div>
    </header>*/

    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                <Link to="/dashboard" className="font-bold text-primary hover:text-[#3ac285] dark:text-black dark:hover:text-white">Growth Eagle</Link>
            </SidebarHeader>

            <SidebarContent className="dark:bg-[#3ac285]">

                <SidebarContentComponent items={data.mainContent}></SidebarContentComponent>


            </SidebarContent>

            <SidebarFooter className="mt-auto">
                <SidebarAccountComponent user={data.user}></SidebarAccountComponent>
            </SidebarFooter>
        </Sidebar>
    );
}

export default SidebarComponent;