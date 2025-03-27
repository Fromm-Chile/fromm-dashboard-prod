import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface TableProps<TData> {
  datosTabla: TData[];
  columns: {
    header: string;
    accessorKey: string;
    cell?: (info: { getValue: () => any }) => any;
  }[];
  title: string;
}

export const Table = <TData,>({
  datosTabla,
  columns,
  title,
}: TableProps<TData>) => {
  const [globalFilter, setGlobalFilter] = useState<string | undefined>("");

  const table = useReactTable({
    data: datosTabla,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium ml-5">{title}</h1>
        </div>
        <div className="flex gap-5 items-center">
          <div className="border-2 border-gray-200 rounded-lg flex gap-1 items-center">
            <img
              src="/icons/search.svg"
              height={20}
              width={20}
              className="ml-2"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="p-2 rounded-lg outline-none"
            />
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-2 flex gap-5 items-center">
            <p>Mostrar</p>
            <select
              className="select-registros"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <p>registros</p>
          </div>
        </div>
      </div>
      <table className="w-full mt-8">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-6 text-left text-gray-500 font-medium text-lg"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {
                    { asc: "⬆️", desc: "⬇️" }[
                      (header.column.getIsSorted() as "asc" | "desc") ?? null
                    ]
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 border-b border-gray-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getPageCount() === 0 && (
        <div className="flex justify-center items-center h-28">
          <p>No se encontraron resultados...</p>
        </div>
      )}
      <div className="flex gap-5 items-center justify-end mt-8">
        <div className="border-2 border-gray-200 rounded-lg flex gap-5 items-center">
          <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              <img src="/icons/left-arrow.svg" height={20} width={20} />
            </button>
          </div>
          <div>
            <p>
              Página {currentPage} de {totalPages}
            </p>
          </div>
          <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
            <button onClick={() => table.nextPage()} className="cursor-pointer">
              <img src="/icons/right-arrow-black.svg" height={20} width={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
