import React from 'react';
import useFetchDB from '../../hooks/use-fetchdb';
import { Logger } from '../../lib/utils';

import SidebarComponent from '../../layout/sidebar/Sidebar';
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';
import { SiteHeader } from '../../layout/header/SiteHeader';
import { DataTable } from '../../components/data-table/DataTable';
import { ClipLoader } from 'react-spinners';

const CustomerPageComponent: React.FC = () => {
    const { data, loading, error } = useFetchDB('customers');
    //Logger.info("Customer page rendered");

    if (loading) {
        //Logger.info("Loading customer page");
        return (
            <div className="flex items-center justify-center h-screen">
                <ClipLoader size={15} color="#3ac285" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }
    if (error) {
        Logger.info("Error in loading customer page", error);
        return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
    }
    return (
        <>
            <SidebarProvider>
                <SidebarComponent variant="inset" />
                <SidebarInset className="w-full min-w-[1300px] h-screen overflow-auto">
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                    <DataTable data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

export default CustomerPageComponent;