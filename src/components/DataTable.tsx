import { Component, For, createSignal } from 'solid-js';
import { ColumnDef, createColumnHelper, createSolidTable, flexRender, getCoreRowModel } from '@tanstack/solid-table';

type Year = {
    year_id: string
    from_date: string
    to_date: string
    employees: number
    complete: boolean
    months: number
  }
  
  const defaultData: Year[] = [
    {
      year_id: '1',
      from_date: '2018',
      to_date: '2019',
      employees: 7,
      complete: true,
      months: 12
    }
  ]

  const columnHelper = createColumnHelper<Year>()
  const defaultColumns = [
    columnHelper.accessor( 'year_id', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor( 'from_date', {
      cell: info => info.getValue(),
      header: () => <span>Incio</span>,
    }),
    columnHelper.accessor( 'to_date', {
      cell: info => info.getValue(),
      header: () => <span>Termino</span>,
    }),
    columnHelper.accessor( 'employees', {
      cell: info => info.getValue(),
      header: () => <span>Empleados</span>,
    }),
    columnHelper.accessor( 'complete', {
      cell: info => info.getValue() ? 'Completado' : 'En Progreso',
      header: () => <span>Progreso</span>,
    }),

  ]
const DataTable: Component<{}> = (props) => {
  const [data, setData] = createSignal(defaultData)
  const rerender = () => setData(defaultData)

  const table = createSolidTable({
    get data() {
      return data()
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  return  (<div class="p-2">
  <table>
    <thead>
      <For each={table.getHeaderGroups()}>
        {headerGroup => (
          <tr>
            <For each={headerGroup.headers}>
              {header => (
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
        {row => (
          <tr>
            <For each={row.getVisibleCells()}>
              {cell => (
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
        {footerGroup => (
          <tr>
            <For each={footerGroup.headers}>
              {header => (
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

export default DataTable;
