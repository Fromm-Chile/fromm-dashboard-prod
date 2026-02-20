import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { Loader } from "./Loader";

type Columns = {
  header: string;
  accessorKey: string;
  cell?: (info: { getValue: () => any }) => any;
};

type TableProps = {
  datosTabla: any[];
  columns: Columns[];
  onClick?: () => void;
  hasButton?: boolean;
  detailsRoute: string;
  handlerColumnFilter?: () => void;
  isLoading?: boolean;
};

export const Table = ({
  datosTabla,
  columns,
  detailsRoute,
  handlerColumnFilter,
  isLoading,
}: TableProps) => {
  const navigate = useNavigate();

  const table = useReactTable({
    data: datosTabla,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      {isLoading && <Loader />}
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-muted/60">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={handlerColumnFilter}
                  className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => navigate(`/${detailsRoute}/${row.original.id}`)}
              className="cursor-pointer bg-card hover:bg-muted/40 transition-colors duration-150"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-3 px-5 text-sm text-foreground"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getPageCount() === 0 && (
        <div className="flex flex-col justify-center items-center h-32 gap-2 bg-card">
          <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
        </div>
      )}
    </div>
  );
};
