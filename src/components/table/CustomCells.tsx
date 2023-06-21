import {
  Component,
  For,
  createSignal,
  JSX,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js";
import { pencilSquare, trash } from "solid-heroicons/outline";
import { Icon } from "solid-heroicons";
import { useYearStore } from "../../store/yearStore";

interface IndeterminateCheckboxProps
  extends JSX.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

function IndeterminateCheckbox(props: IndeterminateCheckboxProps) {
  // const merged = mergeProps({ indeterminate: false }, props);
  const [ref, setRef] = createSignal<HTMLInputElement | null>(null);
  const { addSelected } = useYearStore((state) => ({
    addSelected: state.addSelected,
  }));

  function handleRef(element: HTMLInputElement) {
    setRef(() => element);
  }

  function updateIndeterminate() {
    const inputElement = ref();
    console.log(inputElement);
    
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
    console.log("delete->", merged.oid);
    const askConfirm = confirm("¿Seguro que quieres borrar este registro?");
    if (askConfirm) {
      //setToEdit(merged.oid);
    }
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
  function editYear() {
    console.log("edit->", merged.oid);
    setToEdit(merged.oid);
  }
  return (
    <button
      type="button"
      class="bg-white border border-slate-200 items-center justify-center flex h-full w-auto p-1 rounded hover:bg-slate-100 group-hover:shadow-inner group-hover:shadow-slate-300/50 active:bg-blue-500 active:text-white"
      onClick={() => editYear()}
      {...props}
    >
      <Icon path={pencilSquare} class="h-5" />
    </button>
  );
}

export { IndeterminateCheckbox, DeleteCurrentButton, EditCurrentButton };
