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
];

const columnHelper = createColumnHelper<Year>();
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
];
/* [
  columnHelper.accessor("year_id", {
    cell: (info) => <span class="hidden">{info.getValue()}</span>,
    header: (info) => <span class="hidden">{'year_id'}</span>,
  }),
  columnHelper.accessor("from_date", {
    cell: (info) => info.getValue(),
    header: () => <span>Incio</span>,
  }),
  columnHelper.accessor("to_date", {
    cell: (info) => info.getValue(),
    header: () => <span>Termino</span>,
  }),
  columnHelper.accessor("employees", {
    cell: (info) => info.getValue(),
    header: () => <span>Empleados</span>,
  }),
  columnHelper.accessor("complete", {
    cell: (info) => (info.getValue() ? "Completado" : "En Progreso"),
    header: () => <span>Progreso</span>,
  }),
] */ const DataTable: Component<{}> = (props) => {
  const [data, setData] = createSignal(defaultData);
  const rerender = () => setData(defaultData);

  const table = createSolidTable({
    get data() {
      return data();
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div class="p-2">
      <table class="border text-center h-full">
        <thead class="bg-slate-300">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th>
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
              <tr>
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
  const merged = mergeProps({indeterminate: false}, props);
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
      class={`cursor-pointer ${props.class}`}
      {...props}
    />
  );
}

export default DataTable;
