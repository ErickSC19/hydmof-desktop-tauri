import {
  Component,
  For,
  createSignal,
  JSX,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js";
import {
  pencilSquare,
  trash,
  plusCircle,
  magnifyingGlass,
  chevronDown,
  chevronUp
} from "solid-heroicons/outline";
import { Icon } from "solid-heroicons";
import {
  ColumnDef,
  SortingState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { IndeterminateCheckbox, DeleteCurrentButton, EditCurrentButton } from "./CustomCells";
import { Year } from "../../types/YearsTypes";
import { useYearStore } from "../../store/yearStore";
import { shallow } from "zustand/shallow";

const defaultColumns: ColumnDef<Year>[] = [
  {
    accessorFn: (row) => row.year_id,
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
            id: row.getValue("year_id"),
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
    enableSorting: false
  },
  {
    accessorKey: "from_date",
    header: () => <span>Inicio</span>,
  },
  {
    accessorKey: "to_date",
    header: () => <span>Termino</span>,
  },
  {
    accessorKey: "employees",
    header: () => <span>Empleados</span>,
  },
  {
    accessorKey: "complete",
    cell: (info) =>
      info.getValue() ? (
        <span>Completado</span>
      ) : (
        <span class="">En Progreso</span>
      ),
    header: () => <span>Estado</span>,
  },
  {
    accessorFn: (row) => row.year_id,
    id: "editCurrent",
    header: () => <span class="hidden">editar</span>,
    cell: (info) => (
      <div class="px-1">
        <EditCurrentButton
          {...{
            oid: info.getValue<string>(),
          }}
        />
      </div>
    ),
    enableSorting: false
  },
  {
    accessorFn: (row) => row.year_id,
    id: "deleteCurrent",
    header: () => <span class="hidden">borrar</span>,
    cell: (info) => (
      <div class="px-1 flex">
        <DeleteCurrentButton
          {...{
            oid: info.getValue<string>(),
          }}
        />
      </div>
    ),
    enableSorting: false
  },
];
const DataTable: Component<{}> = (props) => {
  const { all, selected } = useYearStore(
    (state) => ({
      all: state.all,
      selected: state.selected,
    }),
    shallow
  );
  const [data, setData] = createSignal(all);
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [rowSelection, setRowSelection] = createSignal({});
  const rerender = () => setData(all);
  const { setSelected } = useYearStore((state) => ({
    setSelected: state.setSelected,
  }));

  const unsub = useYearStore.subscribe(
    (state) => state.all,
    (all) => {
      setData(all);
    }
  );

  const table = createSolidTable({
    get data() {
      return data();
    },
    columns: defaultColumns,
    //state: {
    //  rowSelection: rowSelection(),
    //},
    //enableRowSelection: true,
    //enableMultiRowSelection: true,
    //onRowSelectionChange: setRowSelection,
    state: {
      get sorting() {
        return sorting()
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  // createEffect(() => {
  //   const selection = rowSelection().
  //   setSelected(selection);
  // })

  onCleanup(() => unsub());

  return (
    <div class="p-2">
      <table class="border rounded text-center h-full w-full">
        <thead class="bg-slate-300">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr class="shadow-inner">
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="px-3" colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        <div
                          class={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center justify-center"
                              : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <Icon path={chevronUp} class="h-4 w-4" />,
                            desc: <Icon path={chevronDown} class="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows.slice(0, 10)}>
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
      </table>
      <div>{table.getRowModel().rows.length} Registros</div>
      <div class="h-4">
        <button class="border p-2" onClick={() => rerender()}>Refresh Data</button>
      </div>
      {/* <pre>{JSON.stringify(sorting(), null, 2)}</pre> */}
    </div>
  );
};


export default DataTable;
