import SidebarComponent from "../../layout/sidebar/Sidebar"
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar"
import { SiteHeader } from "../../layout/header/SiteHeader"

import ChartAreaComponent from "../../pages/_dashboard/ChartArea"
import { SectionCards } from "../../pages/_dashboard/SectionCards"

const DashboardPageComponent: React.FC = () => {
    //h-screen and h-full are causing issues in larger displays
    return (
        <>
            <SidebarProvider>
                <div className="flex w-screen h-screen overflow-auto">
                    <SidebarComponent variant="inset" className="!static h-screen" />
                    <SidebarInset className="flex flex-col flex-1 min-w-0 w-screen h-screen">
                        <SiteHeader />
                        <div className="flex-1 w-full h-full">
                            <div className="@container/main mx-auto w-full flex flex-1 flex-col gap-2 p-4 md:p-6">
                                <div className="flex flex-col gap-4 py-4 md:gap-6">
                                    <SectionCards />
                                    <div className="w-full">
                                        <ChartAreaComponent />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </>
    )
}

export default DashboardPageComponent;