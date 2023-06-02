import { Component, For, createEffect, createSignal, JSX, mergeProps } from "solid-js";
import {
  ColumnDef,
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";

type Year = {
  year_id: string;
  from_date: string;
  to_date: string;
  employees: number;
  complete: boolean;
  months: number;
};

const defaultData: Year[] = [
  {
    year_id: "1",
    from_date: "2018",
    to_date: "2019",
    employees: 7,
    complete: true,
    months: 12,
  },
  {
    year_id: "2",
    from_date: "2019",
    to_date: "2020",
    employees: 12,
    complete: true,
    months: 12,
  },
];

const defaultColumns: ColumnDef<Year>[] = [
  {
    id: "year_id",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div class="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: 'from_date',
    header: () => <span>Inicio</span>
  },
  {
    accessorKey: 'to_date',
    header: () => <span>Termino</span>
  },
  {
    accessorKey: 'employees',
    header: () => <span>Empleados</span>
  },
  {
    accessorKey: 'complete',
    cell: (info) => (info.getValue() ? <span>Completado</span> : <span class="">En Progreso</span>),
    header: () => <span>Estado</span>
  }
];
  const DataTable: Component<{}> = (props) => {
  const [data, setData] = createSignal(defaultData);
  const [rowSelection, setRowSelection] = createSignal({});
  const rerender = () => setData(defaultData);

  const table = createSolidTable({
    get data() {
      return data();
    },
    //state: {
    //  rowSelection: rowSelection(),
    //},
    columns: defaultColumns,
    //enableRowSelection: true,
    //enableMultiRowSelection: true,
    //onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div class="p-2">
      <table class="border rounded text-center h-full w-full">
        <thead class="bg-slate-300">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr class="shadow-inner">
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="px-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr class="hover:bg-slate-100">
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot>
          <For each={table.getFooterGroups()}>
            {(footerGroup) => (
              <tr>
                <For each={footerGroup.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
      <div class="h-4" />
      <button onClick={() => rerender()} class="border p-2">
        Rerender
      </button>
    </div>
  );
};

interface IndeterminateCheckboxProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}


function IndeterminateCheckbox(props: IndeterminateCheckboxProps) {
  const merged = mergeProps({ indeterminate: false }, props);
  const [ref, setRef] = createSignal<HTMLInputElement | null>(null);

  function handleRef(element: HTMLInputElement) {
    setRef(() => element);
  }

  function updateIndeterminate() {
    const inputElement = ref();
    if (inputElement && typeof props.indeterminate === "boolean") {
      inputElement.indeterminate = !props.checked && props.indeterminate;
    }
  }

  updateIndeterminate();

  return (
    <input
      type="checkbox"
      ref={handleRef}
      class={`cursor-pointer rounded indeterminate:bg-slate-500 indeterminate:focus:bg-slate-400 indeterminate:hover:bg-slate-400 checked:bg-slate-500 checked:focus:bg-slate-500 checked:hover:bg-slate-400 focus:ring-slate-500 ${props.class}`}
      {...props}
    />
  );
}

export default DataTable;
