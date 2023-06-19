import { Component, For, createSignal, JSX, mergeProps } from "solid-js";
import {
  pencilSquare,
  trash,
  plusCircle,
  magnifyingGlass,
} from "solid-heroicons/outline";
import { Icon } from "solid-heroicons";
import {
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { Year } from "../types/YearsTypes";
import { useYearStore } from "../store/yearStore";
import { shallow } from "zustand/shallow";

const defaultData: Year[] = [
  {
    year_id: "1",
    from_date: "2018-01-01",
    to_date: "2019-01-01",
    employees: 7,
    complete: true,
    months: 12,
  },
  {
    year_id: "2",
    from_date: "2019-01-01",
    to_date: "2020-01-01",
    employees: 12,
    complete: true,
    months: 12,
  },
];

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
  const [data, setData] = createSignal(defaultData);
  const [rowSelection, setRowSelection] = createSignal({});
  const rerender = () => setData(defaultData);
  const { all, selected } = useYearStore(
    (state) => ({
      all: state.all,
      selected: state.selected,
    }),
    shallow
  );
  const { setSelected } = useYearStore((state) => ({
    setSelected: state.setSelected,
  }));

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
    getCoreRowModel: getCoreRowModel(),
  });

  // createEffect(() => {
  //   const selection = rowSelection().
  //   setSelected(selection);
  // })
  return (
    <div class="p-2">
      <div class="flex gap-1 mb-2">
        <label class="relative block grow">
          <span class="sr-only">Search</span>
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <Icon path={magnifyingGlass} class="h-5 w-5" />
          </span>
          <input
            type="text"
            name="search"
            placeholder="Busca un registro..."
            class="py-1 pl-9 rounded block w-full h-fit border-slate-300 placeholder-slate-400"
          />
        </label>
        <button class="bg-white border border-slate-200 items-center justify-center flex h-full w-auto p-1 rounded hover:bg-slate-100 group-hover:shadow-inner group-hover:shadow-slate-300/50 active:bg-green-500 active:text-white">
          <Icon path={plusCircle} class="h-6" />
        </button>
        <button class="bg-white border border-slate-200 items-center justify-center flex h-full w-auto p-1 rounded hover:bg-slate-100 group-hover:shadow-inner group-hover:shadow-slate-300/50 active:bg-red-500 active:text-white">
          <Icon path={trash} class="h-5 mr-1" /> Borrar selección{" "}
        </button>
      </div>
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
