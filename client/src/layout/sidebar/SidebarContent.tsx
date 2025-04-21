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

    // Toggle the collapsed state when sidebar is clicked
    const toggleSidebar = () => setCollapsed(!collapsed)

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="gap-3 py-2">
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <a
                                    href={item.url}
                                    className={`flex items-center p-2 rounded-md transition-all group ${collapsed ? "justify-center w-10 h-10" : "gap-3 w-full"}`}
                                >
                                    {item.icon && <item.icon className={`w-5 h-5 text-black dark:text-white transition-all ${collapsed ? "" : "mr-2"}`} />}
                                    {!collapsed && (
                                        <span className="text-black font-semibold text-base transition-colors">
                                            {item.title}
                                        </span>
                                    )}
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SidebarContentComponent;