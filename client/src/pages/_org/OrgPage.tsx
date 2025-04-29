import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { SiteHeader } from "../../layout/header/SiteHeader";
import SidebarComponent from "../../layout/sidebar/Sidebar";

const OrgPageComponent: React.FC = () => {

    return (
        <>
            <SidebarProvider>
                <SidebarComponent variant="inset" />
                <SidebarInset className="w-full min-w-[1300px] h-screen overflow-auto">
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
};

export default OrgPageComponent;