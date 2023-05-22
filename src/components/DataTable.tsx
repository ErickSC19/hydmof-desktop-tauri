import { Component } from 'solid-js';
import { createColumnHelper, createSolidTable } from '@tanstack/solid-table';

type Person = {
    year_id: string
    from_date: string
    to_date: string
    employees: number
    complete: boolean
    months: number
  }
  
  const columnHelper = createColumnHelper<Person>()

const DataTable: Component<{}> = (props) => {
  //const table = createSolidTable(options);
  return <div></div>;
};

export default DataTable;
