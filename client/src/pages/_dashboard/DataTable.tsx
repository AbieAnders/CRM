import * as React from "react"
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type Row,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    CheckCircle2Icon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    DownloadIcon,
    ColumnsIcon,
    GripVerticalIcon,
    LoaderIcon,
    MoreVerticalIcon,
    PlusIcon,
    TrendingUpIcon,
} from "lucide-react"
import {
    z,
    ZodString,
    ZodNumber,
    ZodDate,
    ZodType,
    ZodTypeAny,
} from "zod";

import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

import { saveAs } from 'file-saver'


function exportToCSV(data: any[], filename: string) {
    const file = `${filename}.csv`
    const csv = [
        Object.keys(data[0]).join(","),
        ...data.map(row => Object.values(row).map(String).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, file);
}

function exportToJSON(data: any[], filename: string) {
    const file = `${filename}.csv`
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, file);
}

const customerRequired = z.object({
    organization_name: z.string(),

    user_id: z.number(),
    username: z.string(),
    email: z.string(),
    id: z.number(),
})

const customerDefault = z.object({
    company_name: z.string().default(""),
    contact_email: z.string().default(""),
    contact_phone: z.string().default("+91"),
    sales_owner: z.string().default(""),

    contact_designation: z.string().nullable().default(null),
    contact_gender: z.string().nullable().default(null),
    contact_branch: z.string().nullable().default(null),
    branch_address: z.string().nullable().default(null),
    company_branches: z.array(z.string()).nullable().default(null),

    lifecycle_status: z.string().nullable().default(null),
    loss_reason: z.string().nullable().default(null),

    last_contact_date: z.date().nullable().default(null),
    contacted_by: z.string().nullable().default(null),

    employee_count: z.number().nullable().default(null),
    market_cap: z.number().nullable().default(null),
})

export const customerSchema = customerRequired.merge(customerDefault);

export const dateSchema = z.preprocess((val) => {
    if (typeof val === "string") {
        const date = new Date(val);
        return isNaN(date.getTime()) ? "INVALID_DATE" : date;
    }
    return val;
}, z.union([
    z.date(),
    z.literal("INVALID_DATE").refine(() => false, {
        message: "Date must be in yyyy-MM-dd format",
    }),
]));

function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
        id,
    })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
        >
            <GripVerticalIcon className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

type EditableCellProps<T extends string | number | string[] | Date | null> = {
    value: T;
    onSave: (newValue: T) => void;
    schema?: z.ZodType<T>;
    allValues?: T[];
    uniqueError?: string;
    className?: string;
};

function EditableCell<T extends string | number | string[] | Date | null>({ value, onSave, schema, allValues = [], uniqueError = "Uniqueness error message", className = "" }: EditableCellProps<T>) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [newValue, setNewValue] = React.useState(value?.toString() ?? "");
    const [error, setError] = React.useState<string | null>(null);

    const handleBlur = () => {
        let parsedValue: any = newValue;

        if (schema instanceof ZodNumber) {
            parsedValue = Number(newValue);
            if (isNaN(parsedValue)) {
                setError("Must be a number");
                return;
            }
        }
        if (schema) {
            const result = schema.safeParse(parsedValue);
            if (!result.success) {
                setError(result.error.errors[0]?.message || "Invalid input");
                return;
            }
        }
        if (allValues.includes(parsedValue) && parsedValue !== value) {
            setError(uniqueError);
            return;
        }

        onSave(parsedValue as T);
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewValue(e.target.value);
        if (error) setError(null);
    };

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newValue]);

    return isEditing ? (
        <>
            <textarea
                ref={textareaRef}
                value={newValue}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus
                className={`border border-outline bg-white text-black max-w-[125px] resize-none ${className}`}
                style={{ height: 'auto', minHeight: '50px' }}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
        </>
    ) : (
        <div className="font-medium" onClick={() => setIsEditing(true)}>
            {newValue || "N/A"}
        </div>
    );
}

export function getColumns(handleDelete: (id: number) => void): ColumnDef<z.infer<typeof customerSchema>>[] {
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
        {
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
        },
        {
            accessorKey: "company_name",
            header: "Company Name",
            cell: ({ row }) => (
                <EditableCell
                    value={row.original.company_name}
                    onSave={(newValue) => {
                        row.original.company_name = newValue;
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
                            row.original.contact_email = newValue;
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
                        row.original.contact_phone = newValue;
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
                        row.original.sales_owner = newValue;
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
                        row.original.contact_designation = newValue;
                    }}
                    schema={z.string().min(1, "Designation cannot be empty")}
                />
            ),
        },
        {
            accessorKey: "contact_gender",
            header: "Gender",
            /*cell: ({ row }) => (
                <EditableCell
                    value={row.original.contact_gender === "" ? "N/A" : row.original.contact_gender}
                    onSave={(newValue) => {
                        row.original.contact_gender = newValue == "N/A" ? "" : newValue;
                    }}
                    schema={z.string().refine((val) => val === "" || /^[mf]$/.test(val), { message: "Gender must be 'm' or 'f'" })}
                />
            ),*/
            cell: ({ row }) => {
                const [selectedStatus, setSelectedStatus] = React.useState(row.original.contact_gender || "N/A");
                const validStatuses = ['m', 'f'];

                const handleStatusChange = (newStatus: string) => {
                    setSelectedStatus(newStatus);
                    row.original.contact_gender = newStatus;
                };

                return (
                    <div className="flex items-center">
                        <Select onValueChange={handleStatusChange} value={selectedStatus}>
                            <SelectTrigger className="ml-2">
                                {selectedStatus && selectedStatus !== "N/A" ? (
                                    <Badge variant="outline">{selectedStatus}</Badge>
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
                        row.original.contact_branch = newValue;
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
                        row.original.branch_address = newValue;
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
                                row.original.company_branches = cleaned
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
                const [selectedStatus, setSelectedStatus] = React.useState(row.original.lifecycle_status || "N/A");
                const validStatuses = ['lead', 'rejected', 'customer', 'lost'];

                const handleStatusChange = (newStatus: string) => {
                    setSelectedStatus(newStatus);
                    row.original.lifecycle_status = newStatus;
                };

                return (
                    <div className="flex items-center">
                        <Select onValueChange={handleStatusChange} value={selectedStatus}>
                            <SelectTrigger className="ml-2">
                                {selectedStatus && selectedStatus !== "N/A" ? (
                                    <Badge variant="outline">{selectedStatus}</Badge>
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
                        value={row.original.loss_reason === "" ? "No reason given" : row.original.loss_reason}
                        onSave={(newValue) => {
                            row.original.loss_reason = newValue;
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
                        row.original.last_contact_date = newValue;
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
                        row.original.contacted_by = newValue;
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
                        row.original.employee_count = newValue;
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
                        row.original.market_cap = newValue;
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]
}

function DraggableRow({ row }: { row: Row<z.infer<typeof customerSchema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} style={{ width: `${cell.column.getSize()}px` }} className="align-top whitespace-normal break-words p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}
/*<DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy}>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>*/

function DataTableInternal({
    data: initialData,
}: {
    data: z.infer<typeof customerSchema>[]
}) {
    const [data, setData] = React.useState(() => initialData)

    const [rowSelection, setRowSelection] = React.useState({})

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 2,
    })

    const sortableId = React.useId()
    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

    const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data])

    const handleDelete = (rowId: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this row?");
        if (!isConfirmed) return;
        setData((prevData) => prevData.filter((row) => row.id !== rowId));
    };

    const columns = React.useMemo(() => getColumns(handleDelete), [handleDelete])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
            globalFilter
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    function getNextId(data: { id: number }[]): number {
        if (data.length === 0) return 1
        const maxId = Math.max(...data.map((d) => d.id))
        return maxId + 1
    }

    return (
        <Tabs defaultValue="outline" className="flex w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full max-w-sm"
                />
                <Button variant="outline" size="sm">
                    Save DB
                </Button>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <DownloadIcon />
                                <span className="hidden lg:inline">Choose Export</span>
                                <span className="lg:hidden">Exports</span>
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Button variant="outline" size="sm" onClick={() => exportToCSV(data, 'customers')}>
                                    Export to CSV
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button variant="outline" size="sm" onClick={() => exportToJSON(data, 'customers')}>
                                    Export to JSON
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ColumnsIcon />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <ChevronDownIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="sm" onClick={() => setData((prev) => [
                        customerSchema.parse({
                            organization_name: data[0].organization_name,
                            user_id: data[0].user_id,
                            username: data[0].username,
                            email: data[0].email,
                            id: getNextId(prev),
                            ...customerDefault.parse({})
                        }), ...prev])}
                    >
                        <PlusIcon />
                        <span className="hidden lg:inline">Add Customer</span>
                    </Button>

                </div>
            </div>
            <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table className="table-fixed w-full">
                            <TableHeader className="sticky top-0 z-10 bg-muted">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const width = header.getSize()
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan} style={{ width: width }} className={`text-center min-w-[${width}px] max-w-[${width}px] whitespace-nowrap`}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>

                <div className="flex items-center justify-between px-4">
                    <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="w-20" id="rows-per-page">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRightIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>

        </Tabs>
    )
}

export function DataTable() {
    const [data, setData] = React.useState<z.infer<typeof customerSchema>[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchData() {
            let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1MTUyMTM0LCJpYXQiOjE3NDUxNTAzMzQsImp0aSI6IjhiYWRkODdmNGNjNDRkMDM4Yjc3MGE0OGNlNzg0YzlkIiwidXNlcl9pZCI6MX0.zNc9ep8A3YeC-wy1CTIvsalHWOZHRzu09SCmGxYCCI8"
            const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NDk4NDAxMywiaWF0IjoxNzQ0ODk3NjEzLCJqdGkiOiJjZTY1YzZhM2M4MTU0N2U0YWZmMWRmZTNmN2YzZDExNiIsInVzZXJfaWQiOjF9.b59njd-aLqp2VVQ2n81f8PLnT9vzfOjrR5iz2CXkHaw"
            try {
                const res = await fetch("http://127.0.0.1:8000/customers/", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                const json = await res.json();
                //console.log(json);
                if (Array.isArray(json.results)) {
                    setData(json.results);
                } else {
                    console.error("Expected 'results' to be an array:", json);
                }
            } catch (err) {
                console.error("Failed to fetch data:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="p-6">Fetching your data...</div>
    }

    return (
        <DataTableInternal data={data} />
    )
}
