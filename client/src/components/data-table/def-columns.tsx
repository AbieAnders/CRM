import React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { z } from "zod"

import DragHandle from "./drag-handle"
import EditableCell from "./editable-cell"
import { customerSchema, dateSchema } from "../../pages/_dashboard/DataTable"

import { MoreVerticalIcon } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { CustomerWithMeta } from "./DataTable"

export function getColumns(
    handleDelete: (id: number, isNewRow: boolean) => void,
    setEditedRowIds: React.Dispatch<React.SetStateAction<Set<number>>>
): ColumnDef<CustomerWithMeta>[] {
    return [
        {
            id: "drag",
            size: 75,
            minSize: 75,
            maxSize: 75,
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id} />,
        },
        {
            id: "select",
            size: 75,
            minSize: 75,
            maxSize: 75,
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="h-4 w-4 rounded border border-gray-300 bg-white text-black data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white transition-colors duration-200 ease-in-out"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="h-4 w-4 rounded border border-gray-300 bg-white text-black data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white transition-colors duration-200 ease-in-out"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        /*{
            accessorKey: "organization_name",
            header: "Organization",
        },
        {
            accessorKey: "username",
            header: "Created By",
        },
        {
            accessorKey: "email",
            header: "User Email",
        },*/
        {
            accessorKey: "company_name",
            header: "Company Name",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.company_name}
                    onSave={(newValue) => {
                        if (newValue !== row.original.company_name) {
                            row.original.company_name = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.string().min(1, "Customers company cannot be empty")}
                />
            ),
        },
        {
            accessorKey: "contact_email",
            header: "Contact Email",
            cell: ({ row, table }) => {
                const allEmails = table.getFilteredRowModel().rows.map(r => r.original.contact_email);
                return (
                    <EditableCell
                        value={row.original.contact_email}
                        onSave={(newValue) => {
                            if (newValue !== row.original.contact_email) {
                                row.original.contact_email = newValue;
                                setEditedRowIds(prev => new Set(prev).add(row.original.id));
                            }
                        }}
                        schema={z.string().email("Invalid email format")}
                        allValues={allEmails}
                        uniqueError="This email is already in use"
                    />
                );
            }
        },
        {
            accessorKey: "contact_phone",
            header: "Phone",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.contact_phone}
                    onSave={(newValue) => {
                        if (newValue !== row.original.contact_phone) {
                            row.original.contact_phone = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.string().min(10, "Phone no must be at least 10 digits").regex(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone no format")}
                />
            ),
        },
        {
            accessorKey: "sales_owner",
            header: "Sales Owner",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.sales_owner}
                    onSave={(newValue) => {
                        if (newValue !== row.original.sales_owner) {
                            row.original.sales_owner = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.string().min(1, "Sales Owner cannot be empty")}
                />
            ),
        },
        {
            accessorKey: "contact_designation",
            header: "Designation",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.contact_designation}
                    onSave={(newValue) => {
                        if (newValue !== row.original.contact_designation) {
                            row.original.contact_designation = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.string().min(1, "Designation cannot be empty")}
                />
            ),
        },
        {
            accessorKey: "contact_gender",
            header: "Gender",
            cell: ({ row }) => {
                const validStatuses = ['m', 'f'];
                const handleStatusChange = (newStatus: string) => {
                    if (newStatus !== row.original.contact_gender) {
                        row.original.contact_gender = newStatus;
                        setEditedRowIds(prev => new Set(prev).add(row.original.id));
                    }
                };

                return (
                    <div className="flex items-center">
                        <Select onValueChange={handleStatusChange} value={row.original.contact_gender || "N/A"}>
                            <SelectTrigger className="ml-2">
                                {row.original.contact_gender && row.original.contact_gender !== "N/A" ? (
                                    <Badge variant="outline">{row.original.contact_gender}</Badge>
                                ) : (
                                    <span className="text-muted-foreground italic">N/A</span>
                                )}
                            </SelectTrigger>
                            <SelectContent>
                                {validStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            },
        },
        {
            accessorKey: "contact_branch",
            header: "Branch",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.contact_branch == "" ? "N/A" : row.original.contact_branch}
                    onSave={(newValue) => {
                        if (newValue !== row.original.contact_branch) {
                            row.original.contact_branch = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.string()}
                />
            ),
        },
        {
            accessorKey: "branch_address",
            header: "Branch Address",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.branch_address == "" ? "N/A" : row.original.branch_address}
                    onSave={(newValue) => {
                        if (newValue !== row.original.branch_address) {
                            row.original.branch_address = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.string()}
                />
            ),
        },
        {
            accessorKey: "company_branches",
            header: "Branches",
            cell: ({ row }) => {
                const branches = row.original.company_branches;
                const displayValue = Array.isArray(branches) && branches.length > 0 ? branches.join(", ") : "N/A";
                return (
                    <EditableCell
                        value={displayValue}
                        onSave={(newValue) => {
                            if (typeof newValue === "string" && newValue != null) {
                                const cleaned = newValue.split(",").map((city) => city.trim()).filter(Boolean);
                                if (newValue !== row.original.company_branches?.join(", ")) {
                                    row.original.company_branches = cleaned
                                    setEditedRowIds(prev => new Set(prev).add(row.original.id));
                                }
                            }
                            else {
                                row.original.company_branches = null;
                            }
                        }}
                        schema={z.string().nullable()}
                    />
                );
            },
        },
        {
            accessorKey: "lifecycle_status",
            header: "Lifecycle",
            cell: ({ row }) => {
                const validStatuses = ['lead', 'rejected', 'customer', 'lost'];
                const handleStatusChange = (newStatus: string) => {
                    if (newStatus !== row.original.lifecycle_status) {
                        row.original.lifecycle_status = newStatus;
                        setEditedRowIds(prev => new Set(prev).add(row.original.id));
                    }
                };

                return (
                    <div className="flex items-center">
                        <Select onValueChange={handleStatusChange} value={row.original.lifecycle_status || "N/A"}>
                            <SelectTrigger className="ml-2">
                                {row.original.lifecycle_status && row.original.lifecycle_status !== "N/A" ? (
                                    <Badge variant="outline">{row.original.lifecycle_status}</Badge>
                                ) : (
                                    <span className="text-muted-foreground italic">N/A</span>
                                )}
                            </SelectTrigger>
                            <SelectContent>
                                {validStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            },
        },
        {
            accessorKey: "loss_reason",
            header: "Loss Reason",
            cell: ({ row }) => (
                <div className="font-medium text-gray-700">
                    <EditableCell
                        value={row.original.loss_reason}
                        placeholder="Reason empty"
                        onSave={(newValue) => {
                            if (newValue !== row.original.loss_reason) {
                                row.original.loss_reason = newValue;
                                setEditedRowIds(prev => new Set(prev).add(row.original.id));
                            }
                        }}
                        schema={z.string()}
                    />
                </div>
            ),
        },
        {
            accessorKey: "last_contact_date",
            header: "Last Contact",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.last_contact_date}
                    onSave={(newValue) => {
                        if (newValue !== row.original.last_contact_date) {
                            row.original.last_contact_date = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={dateSchema as z.ZodType<Date | null>}
                />
            ),
        },
        {
            accessorKey: "contacted_by",
            header: "Contacted By",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.contacted_by}
                    onSave={(newValue) => {
                        if (newValue !== row.original.contacted_by) {
                            row.original.contacted_by = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.string().min(1, "Contacted By cannot be empty")}
                />
            ),
        },
        {
            accessorKey: "employee_count",
            header: "Employees",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.employee_count}
                    onSave={(newValue) => {
                        if (newValue !== row.original.employee_count) {
                            row.original.employee_count = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.number()}
                />
            ),
        },
        {
            accessorKey: "market_cap",
            header: "Market Cap",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.market_cap}
                    onSave={(newValue) => {
                        if (newValue !== row.original.market_cap) {
                            row.original.market_cap = newValue;
                            setEditedRowIds(prev => new Set(prev).add(row.original.id));
                        }
                    }}
                    schema={z.number()}
                />
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground data-[state=open]:bg-muted">
                            <MoreVerticalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.isNewRow ?? false)}>Delete1</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleDelete(row.original.id, row.original.isNewRow ?? false); }}>Delete2</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]
}