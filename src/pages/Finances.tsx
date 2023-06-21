import { Component, createSignal, onCleanup } from 'solid-js';
import DataTable from '../components/DataTable';
import YearModal from '../components/YearModal';
import { trash, plusCircle, magnifyingGlass } from 'solid-heroicons/outline';
import { Icon } from 'solid-heroicons';
import { useYearStore } from '../store/yearStore';
import { shallow } from 'zustand/shallow';
import { useModalStore } from '../store/modalStore';

const Finances: Component<{}> = (props) => {
  const [search, setSearch] = createSignal<string>('');
  const [modalOpen, setModalOpen] = createSignal<boolean>(false)
  const { toggleYearModal } = useModalStore((state) => ({
    toggleYearModal: state.toggleYearModal
  }));

  const onSearch = (val: string) => {
    setSearch(val);
    console.log(search());
  };

  const unsub = useModalStore.subscribe(
    (state) => state.yearModalDisplay,
    (yearModalDisplay) => {
        setModalOpen(yearModalDisplay);
    }
  );

  onCleanup(() => unsub())

  return (
    <div class="m-2 border w-full rounded border-slate-400 border-dashed p-4">
      <YearModal />
      <h1 class="lg:text-5xl text-4xl font-bold mb-1">Años</h1>
      <hr />
      <div class="flex px-2 gap-1 my-2">
        <label class=" grow">
          <span class="sr-only">Search</span>
          <span class="absolute translate-y-2 flex items-center pl-2">
            <Icon path={magnifyingGlass} class="h-5 w-5" />
          </span>
          <input
            type="text"
            name="search"
            value={search()}
            disabled={modalOpen()}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Busca un registro..."
            class="py-1 pl-9 rounded block w-full h-fit border-slate-300 placeholder-slate-400"
          />
        </label>
        <button
          type="button"
          onClick={() => toggleYearModal(true)}
          class="bg-white border border-slate-200 items-center justify-center flex h-full w-auto p-1 rounded hover:bg-slate-100 group-hover:shadow-inner group-hover:shadow-slate-300/50 active:bg-green-500 active:text-white"
        >
          <Icon path={plusCircle} class="h-6" />
        </button>
        <button
          type="button"
          class="bg-white border border-slate-200 items-center justify-center flex h-full w-auto p-1 rounded hover:bg-slate-100 group-hover:shadow-inner group-hover:shadow-slate-300/50 active:bg-red-500 active:text-white"
        >
          <Icon path={trash} class="h-5 mr-1" /> Borrar selección{' '}
        </button>
      </div>
      <DataTable />
    </div>
  );
};

export default Finances;
