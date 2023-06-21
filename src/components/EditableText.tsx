import { pencilSquare, check } from 'solid-heroicons/outline';
import { Icon } from 'solid-heroicons';
import { Component, createSignal, mergeProps } from 'solid-js';

const EditableText: Component<{ class?: string; val?: string }> = (props) => {
  const merged = mergeProps({ class: '', val: '' }, props);
  const [editedValue, setEditedValue] = createSignal<string>(merged.val);
  const [willEdit, setWillEdit] = createSignal<boolean>(false);

  const handleEdit = async () => {
    if (willEdit()) {
    }
    setWillEdit((willEdit) => !willEdit);
  };
  return (
    <div class={`flex`}>
      <input
        type="text"
        class={`${merged.class} bg-slate-50 border-0 border-blue-500 focus:border-b-2 p-0 h-fit w-fit focus:ring-transparent`}
        disabled={!willEdit()}
        value={editedValue()}
        onInput={(e) => setEditedValue(e.currentTarget.value)}
      />
      <button type="button" class="ml-auto" onClick={() => handleEdit()}>
        {willEdit() ? (
          <Icon path={check} style="width: 24px;" />
        ) : (
          <Icon path={pencilSquare} style="width: 24px;" />
        )}
      </button>
    </div>
  );
};

export default EditableText;
