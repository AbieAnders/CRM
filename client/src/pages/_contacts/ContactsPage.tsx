import React from 'react';
import SidebarComponent from '../../layout/sidebar/Sidebar';
import { SidebarInset, SidebarProvider } from '../../components/ui/sidebar';
import { SiteHeader } from '../../layout/header/SiteHeader';
import { DataTable } from '../../components/data-table/DataTable';
import useFetchDB from '../../hooks/use-fetchdb';

const ContactsPageComponent: React.FC = () => {
    const { data, loading, error } = useFetchDB('contacts/');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <>
            <SidebarProvider>
                <SidebarComponent variant="inset" />
                <SidebarInset className="w-full min-w-[1300px] h-screen overflow-auto">
                    <SiteHeader />

                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <DataTable data={data} />
                    </div>

                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

export default ContactsPageComponent;