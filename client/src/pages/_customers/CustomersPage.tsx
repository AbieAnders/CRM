import React from 'react';
import SidebarComponent from '../../layout/sidebar/Sidebar';
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';
import { SiteHeader } from '../../layout/header/SiteHeader';
import { DataTable } from '../../components/data-table/DataTable';
import useFetchDB from '../../hooks/use-fetchdb';

const CustomerPageComponent: React.FC = () => {
    const { data, loading, error } = useFetchDB('customers');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
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