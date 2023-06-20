import { Component } from "solid-js";
import DataTable from "../components/DataTable";
import YearModal from '../components/YearModal';

const Finances: Component<{}> = (props) => {
  
  return(
  <div class="m-2 border w-full rounded border-slate-400 border-dashed p-4">
    <YearModal />
    <h1 class="lg:text-5xl text-4xl font-bold mb-1">Años</h1>
    <DataTable />
    <hr />
  </div>);
};

export default Finances;