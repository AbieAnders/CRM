import React, { useState, useEffect } from 'react';

import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Button } from "../components/ui/button";
import { Menu, Moon, Sun, Users, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarProvider, SidebarGroup } from '../components/ui/sidebar';
import { useSidebar } from '../components/ui/sidebar';

const NavbarComponent: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { collapsed } = useSidebar();

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
        <>

            <SidebarProvider>
                <Sidebar collapsible='icon' className='w-60'>
                    <SidebarHeader>
                        <Link to="/dashboard" className="text-lg font-bold text-primary hover:text-[#3ac285] dark:text-black dark:hover:text-white">{!collapsed && "APP Name"}</Link>
                    </SidebarHeader>

                    <SidebarContent className="w-60 dark:bg-[#3ac285] px-6 py-4 flex flex-col gap-6">
                        <SidebarGroup>
                            <Link to="/customers" className="text-lg font-bold text-primary hover:text-[#3ac285] dark:text-black dark:hover:text-white" >
                                <Users className="w-5 h-5" />
                                {!collapsed && <span>Customers</span>}
                            </Link>
                            <Link to="/contacts" className="text-lg font-bold text-primary hover:text-[#3ac285] dark:text-black dark:hover:text-white">
                                <Phone className="w-5 h-5" />
                                {!collapsed && <span>Contacts</span>}
                            </Link>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="mt-auto pt-10">
                        <p className="text-sm text-white/70">© 2025 App Name</p>
                    </SidebarFooter>
                </Sidebar>

                <SidebarTrigger variant="outline" size="icon" className='fixed top-4 left-4 z-50 hover:border-[#3ac285]'></SidebarTrigger>
            </SidebarProvider>
        </>
    );
}

export default NavbarComponent;