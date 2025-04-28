import React from 'react';
import SidebarComponent from '../../layout/sidebar/Sidebar';
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';
import { SiteHeader } from '../../layout/header/SiteHeader';
import { DataTable } from '../../components/data-table/DataTable';
import useFetchDB from '../../hooks/use-fetchdb';
import { Logger } from '../../lib/utils';

const ContactsPageComponent: React.FC = () => {
    const { data, loading, error } = useFetchDB('contacts/');

    if (loading) {
        Logger.info("Loading contacts page");
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    if (error) {
        Logger.info("Error in loading contacts page", error);
        return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
    }
    return (
        <>
            <SidebarProvider>
                <div className="flex h-screen overflow-hidden">
                    <SidebarComponent variant="inset" />
                    <SidebarInset className="flex flex-col flex-1 overflow-y-auto">
                        <SiteHeader />

                        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                            <DataTable data={data} />
                        </div>

                    </SidebarInset>

                </div>
            </SidebarProvider>
        </>
    )
}

export default ContactsPageComponent;