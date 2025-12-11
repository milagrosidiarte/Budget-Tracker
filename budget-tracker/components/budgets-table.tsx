"use client";

import { useBudgets } from "@/hooks/useBudgets";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Budget } from "@/hooks/useBudgets";

const columnHelper = createColumnHelper<Budget>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Nombre",
  }),
  columnHelper.accessor("amount", {
    cell: (info) => `$${info.getValue().toFixed(2)}`,
    header: "Monto",
  }),
  columnHelper.accessor("period", {
    cell: (info) => info.getValue(),
    header: "Período",
  }),
  columnHelper.accessor("created_at", {
    cell: (info) => new Date(info.getValue()).toLocaleDateString("es-AR"),
    header: "Creado",
  }),
];

export function BudgetsTable() {
  const { data: budgets = [], isLoading, error } = useBudgets();

  const table = useReactTable({
    data: budgets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div className="p-4">Cargando presupuestos...</div>;
  if (error) return <div className="p-4 text-red-600">Error al cargar</div>;
  if (budgets.length === 0)
    return <div className="p-4 text-gray-600">No hay presupuestos</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 p-3 text-left font-semibold"
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-gray-300 p-3 text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
