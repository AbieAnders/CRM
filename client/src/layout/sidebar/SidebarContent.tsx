import { LucideIcon } from "lucide-react"
import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "../../components/ui/sidebar"
import { useState } from "react"
import { Link } from "react-router-dom"

type SidebarItem = {
    title: string
    url: string
    icon?: LucideIcon

}

type SidebarContentComponentProps = {
    items: SidebarItem[]
}

const SidebarContentComponent: React.FC<SidebarContentComponentProps> = ({ items }) => {
    const [collapsed, setCollapsed] = useState(false)
    const toggleSidebar = () => setCollapsed(!collapsed)
    //collapsed is useless right now
    return (
        <SidebarGroup className="w-full">
            <SidebarGroupContent className="flex flex-col gap-2 w-full">
                <SidebarMenu className="w-full">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="gap-3 py-2 w-full">
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <Link
                                    to={item.url}
                                    className={`flex items-center p-2 rounded-md transition-all group hover:bg-black dark:hover:bg-[#2a9d8f] ${collapsed ? "justify-center w-10 h-10" : "w-full gap-3"}`}
                                >
                                    {item.icon && <item.icon className={`w-5 h-5 text-black transition-all ${collapsed ? "" : "mr-2"}`} />}
                                    {!collapsed && (
                                        <span className="text-primary font-semibold text-black hover:text-[#3ac285] dark:text-black dark:hover:text-[#3ac285] transition-colors truncate">
                                            {item.title}
                                        </span>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SidebarContentComponent;