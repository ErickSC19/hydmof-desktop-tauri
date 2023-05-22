import { Component } from 'solid-js';

const Expenses: Component<{}> = (props) => {
  return (
    <div class="m-2 border w-full rounded border-slate-400 border-dashed p-4">
      <h1 class="lg:text-5xl text-4xl font-bold mb-1">Costos</h1>
      <hr />
    </div>
  );
};

export default Expenses;
