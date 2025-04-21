import SidebarComponent from "../../layout/sidebar/Sidebar"
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar"
import { SiteHeader } from "../../layout/header/SiteHeader"

import ChartAreaComponent from "../../pages/_dashboard/ChartArea"
import { SectionCards } from "../../pages/_dashboard/SectionCards"
import { DataTable } from "../../pages/_dashboard/DataTable"

import data from "./data.json"

const DashboardPageComponent: React.FC = () => {
    return (
        <>
            <SidebarProvider>
                <SidebarComponent variant="inset" />
                <SidebarInset className="w-full md:w-[1920px] h-screen">
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <SectionCards />
                                <div className="px-4 lg:px-6">
                                    <ChartAreaComponent />
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

export default DashboardPageComponent;