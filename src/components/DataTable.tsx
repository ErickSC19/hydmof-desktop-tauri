import { Component, For, createSignal, JSX, mergeProps, onCleanup } from "solid-js";
import {
  pencilSquare,
  trash,
  plusCircle,
  magnifyingGlass,
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
import { Year } from "../types/YearsTypes";
import { useYearStore } from "../store/yearStore";
import { shallow } from "zustand/shallow";
const [sorting, setSorting] = createSignal<SortingState>([])


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
  const [rowSelection, setRowSelection] = createSignal({});
  const rerender = () => setData(all);
  const { setSelected } = useYearStore((state) => ({
    setSelected: state.setSelected,
  }));

  const unsub = useYearStore.subscribe(
    (state) => state.all,
    (all) => {
      setData(all)
    }
  )

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
    // state: {
    //   get sorting() {
    //     return sorting()
    //   },
    // },
    // onSortingChange: setSorting,
    // getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  // createEffect(() => {
  //   const selection = rowSelection().
  //   setSelected(selection);
  // })
  
  onCleanup(() => unsub())

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

interface IndeterminateCheckboxProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
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

interface RowButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  oid?: string;
}

function DeleteCurrentButton(props: RowButtonProps) {
  const merged = mergeProps({ oid: "" }, props);
  const { setToEdit } = useYearStore((state) => ({
    setToEdit: state.setToEdit,
  }));
  function deleteYear() {
    console.log("edit->", merged.oid);
    setToEdit(merged.oid);
  }
  return (
    <button
      type="button"
      class="bg-white border border-slate-200 items-center justify-center flex h-full w-auto p-1 rounded hover:bg-slate-100 group-hover:shadow-inner group-hover:shadow-slate-300/50 active:bg-red-500 active:text-white"
      onClick={() => deleteYear()}
      {...props}
    >
      <Icon path={trash} class="h-5" />
    </button>
  );
}

function EditCurrentButton(props: RowButtonProps) {
  const merged = mergeProps({ oid: "" }, props);
  const { setToEdit } = useYearStore((state) => ({
    setToEdit: state.setToEdit,
  }));
  function deleteYear() {
    console.log("edit->", merged.oid);
    setToEdit(merged.oid);
  }
  return (
    <button
      type="button"
      class="bg-white border border-slate-200 items-center justify-center flex h-full w-auto p-1 rounded hover:bg-slate-100 group-hover:shadow-inner group-hover:shadow-slate-300/50 active:bg-blue-500 active:text-white"
      onClick={() => deleteYear()}
      {...props}
    >
      <Icon path={pencilSquare} class="h-5" />
    </button>
  );
}

export default DataTable;
