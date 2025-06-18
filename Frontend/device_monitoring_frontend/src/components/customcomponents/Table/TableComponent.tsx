import React, { useMemo, useState } from "react";
import {useReactTable, getCoreRowModel, getSortedRowModel, flexRender, ColumnDef, SortingState,} from "@tanstack/react-table";
import styles from "@/styles/scss/Table.module.scss";
import TableRow from "./TableRow";
import { ArrowDown, ArrowUp } from "lucide-react";
import Pagination from "../Pagination";
import { capitalizeFirstLetter } from "@/utils/helperfunctions";

const TableComponent = ({ data, setIsPropertyPanelOpen }: any) => {
  if (!data || data.length === 0) 
    return <p className="px-2">No data available.</p>;
  
  const [sorting, setSorting] = useState<SortingState>([]);

  // Columns definition
  const columns = useMemo<ColumnDef<any, any>[]>(() => {    
    return Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: () => capitalizeFirstLetter(key),
      cell: (info) => info.getValue(),
      enableSorting: true,
    }));
  }, [data]);

  // Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting, 
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.row}>
              {headerGroup.headers.map((header) => {
                const isSortable = header.column.getCanSort();
                const sortDir = header.column.getIsSorted(); // false | 'asc' | 'desc'
                return (
                  <th key={header.id}
                    className={styles.header}
                    onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className={styles.sortIcon}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {isSortable && (sortDir === "asc" ? (<ArrowUp size={16} />) : sortDir === "desc" ? (<ArrowDown size={16} />) : null)}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>  
        <tbody>
          {table.getRowModel().rows.map((row) => (<TableRow key={row.id} row={row} setIsPropertyPanelOpen={setIsPropertyPanelOpen}/>))}
        </tbody>
      </table>
      <Pagination currentPage={1} totalPages={3} pageSize={10} pageSizeOptions={[5, 10, 20, 50]}/>
    </div>
  );
};

export default TableComponent;
