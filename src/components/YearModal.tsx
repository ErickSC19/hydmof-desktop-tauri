import { Component, createSignal, onCleanup } from 'solid-js';
import { xMark } from 'solid-heroicons/solid';
import { Icon } from 'solid-heroicons';
import { useModalStore } from '../store/modalStore';
import { shallow } from 'zustand/shallow';

const YearModal: Component<{}> = () => {
  const { yearModalDisplay, toggleYearModal } = useModalStore(
    (state) => ({
      yearModalDisplay: state.yearModalDisplay,
      toggleYearModal: state.toggleYearModal
    }),
    shallow
  );
  const [styles, setStyles] = createSignal<string>('hidden opacity-0');
  console.log('dis', yearModalDisplay);

  const unsub = useModalStore.subscribe(
    (state) => state.yearModalDisplay,
    (yearModalDisplay) => {
        console.log(yearModalDisplay);
        
      if (yearModalDisplay) {
        setStyles('transition-opacity block opacity-0');
        setTimeout(() => {
          setStyles('transition-opacity block opacity-100');
        }, 20);
      } else {
        setStyles('transition-opacity block opacity-0');
        setTimeout(() => {
          setStyles('transition-opacity opacity-0 hidden');
        }, 155);
      }
    }
  );

  onCleanup(() => unsub())

  return (
    <>
      <div class={styles()}>
        <div
          class="bg-[rgba(0,_0,_0,_0.3)] w-full min-h-screen z-0 fixed top-0 left-0"
          onClick={() => toggleYearModal(false)}
        />
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div class="min-w-fit min-h-fit bg-white z-10 rounded-lg py-6 px-8">
            <div class="flex justify-between mb-12">
              <h2 class="text-dark-text text-3xl font-bold">RULES</h2>
              <button onClick={() => toggleYearModal(false)}>
                <Icon path={xMark}></Icon>
              </button>
            </div>
            <h1>Add Year</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default YearModal;
