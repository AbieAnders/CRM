import { useLocation } from "react-router-dom";
import { Separator } from "../../components/ui/separator"
import { SidebarTrigger } from "../../components/ui/sidebar"

export function getPageTitle(pathname: string): string {
    if (pathname.startsWith("/contacts")) return "Contacts";
    if (pathname.startsWith("/customers")) return "Customers";
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Unnamed path";
};

export function SiteHeader() {
    const location = useLocation();
    const title = getPageTitle(location.pathname);

    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger variant="outline" className="-ml-1 overflow-hidden" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">{title}</h1>
            </div>
        </header>
    )
}
