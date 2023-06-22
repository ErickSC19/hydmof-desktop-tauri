import { Component, createSignal, onCleanup } from 'solid-js';
import { xMark } from 'solid-heroicons/solid';
import { Icon } from 'solid-heroicons';
import { useModalStore } from '../store/modalStore';
import { shallow } from 'zustand/shallow';
import { Year } from '../types/YearsTypes';
import { createStore } from 'solid-js/store';
import { Alert } from './AlertInline';
import { DateTime, Interval } from 'luxon';

type StringByNumber = {
  [key: number]: string;
};

const monthsName: StringByNumber = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre'
};

const YearModal: Component<{}> = () => {
  const [alert, setAlert] = createStore<Alert>({
    state: 'failed',
    msg: '-',
    show: false
  });
  const [year, setYear] = createStore<Year>({
    year_id: '',
    from_date: '',
    to_date: '',
    complete: undefined,
    employees: 0,
    months: 0
  });
  const { toggleYearModal } = useModalStore(
    (state) => ({
      yearModalDisplay: state.yearModalDisplay,
      toggleYearModal: state.toggleYearModal
    }),
    shallow
  );
  const [styles, setStyles] = createSignal<string>('hidden opacity-0');
  const yearChange = (val: Year) => {
    if (val.from_date) {
      const fromDT = DateTime.fromISO(val.from_date);
      if (year.to_date) {
        const toDT = DateTime.fromISO(year.to_date);
        const i = Interval.fromDateTimes(fromDT, toDT);
        if (year.to_date <= val.from_date) {
          const reset: Year = {
            from_date: val.from_date,
            to_date: fromDT.plus({ months: 1 }).toISODate() || '',
            complete: false,
            months: 1
          };
          genMonths(val.from_date, 1);
          setYear(reset);
        } else if (i.length('months') <= 12) {
          if (i.length('months') < 1) {
            const reset: Year = {
              from_date: val.from_date,
              to_date: fromDT.plus({ months: 1 }).toISODate() || '',
              complete: false,
              months: 1
            };
            genMonths(val.from_date, 1);
            setYear(reset);
          } else {
            setYear(val);
          }
        } else {
          const difference = i.length('months') - 12;
          const reset: Year = {
            from_date: val.from_date,
            to_date:
              toDT.minus({ months: Math.trunc(difference) }).toISODate() || '',
            complete: true,
            months: 12
          };
          genMonths(val.from_date, 12);
          setYear(reset);
        }
      } else {
        const reset: Year = {
          from_date: val.from_date,
          to_date: fromDT.plus({ months: 1 }).toISODate() || '',
          complete: false,
          months: 1
        };
        genMonths(val.from_date, 1);
        setYear(reset);
      }
    } else if (val.to_date && year.from_date) {
      const fromDT = DateTime.fromISO(year.from_date);
      const toDT = DateTime.fromISO(val.to_date);
      const i = Interval.fromDateTimes(fromDT, toDT);
      if (i.length('months') <= 12) {
        if (i.length('months') < 1) {
          const reset: Year = {
            from_date: year.from_date,
            to_date: fromDT.plus({ months: 1 }).toISODate() || '',
            complete: false,
            months: 1
          };
          genMonths(year.from_date, 1);
          setYear(reset);
        } else {
          setYear(val);
        }
      }
    } else {
      setYear(val);
    }
  };
  const yearRel = (from: string, to: string) => {
    const fromDT = DateTime.fromISO(from);
    const toDT = DateTime.fromISO(to);
    const i = Interval.fromDateTimes(fromDT, toDT);
    const calcMonths = i.length('months') < 13 ? i.length('months') : 12;
    let completed = false;
    i.length('years') < 1 ? (completed = false) : (completed = true);

    const val = { complete: completed, months: Math.trunc(calcMonths) };
    setYear((prev) => ({ ...prev, ...val }));
    genMonths(from, Math.round(calcMonths));
  };
  const yearStatusChanges = (val: Year, op?: string) => {
    yearChange(val);
    if (op === 'from' && val.from_date && year.to_date) {
      yearRel(val.from_date, year.to_date);
    } else if (year.from_date && val.to_date) {
      yearRel(year.from_date, val.to_date);
    }
  };

  const genMonths = (date: string, totalMonths: number) => {
    const temp = date.split('-');
    let month: number = 0;
    // console.log(temp, totalMonths);
    month = Number(temp[1]);

    const avMonths = [];
    let curr: number = month;

    for (let index = 0; index < totalMonths; index++) {
      if (curr > 12) {
        curr = 0;
        avMonths.push(monthsName[curr]);
      } else {
        avMonths.push(monthsName[curr]);
      }
      curr++;
    }
    // setSpentMonths(avMonths);
    // console.log(avMonths);
  };

  const saveAndContinue = () => {};

  const onHandleSubmit = () => {};

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
        setYear({
          year_id: '',
          from_date: '',
          to_date: '',
          complete: undefined,
          employees: 0,
          months: 0
        });
        setStyles('transition-opacity block opacity-0');
        setTimeout(() => {
          setStyles('transition-opacity opacity-0 hidden');
        }, 155);
      }
    }
  );

  onCleanup(() => unsub());

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
              <h2 class="text-dark-text text-3xl font-bold">
                {year.year_id ? 'Editar año' : 'Agregar año'}
              </h2>
            </div>
            <form onSubmit={onHandleSubmit}>
              <div class="max-w-full grid grid-cols-2 my-2 gap-4">
                <div class="">
                  <label for="fromDate" class="block">
                    Inicio
                  </label>
                  <input
                    id="fromDate"
                    type="date"
                    class="text-xs rounded-md border-slate-300 bg-gray-50 usm:text-base"
                    value={year.from_date}
                    onChange={(e) =>
                      !year.to_date || year.to_date < e.target.value
                        ? yearChange({
                            from_date: e.target.value,
                            to_date: e.target.value,
                            complete: false,
                            months: 1
                          })
                        : yearStatusChanges(
                            { from_date: e.target.value },
                            'from'
                          )
                    }
                  />
                </div>
                <div class="">
                  <label for="toDate" class="block">
                    Término
                  </label>
                  <input
                    id="toDate"
                    type="date"
                    class="text-xs rounded-md border-slate-300 bg-gray-50 usm:text-base disabled:bg-white disabled:border-slate-200 disabled:text-gray-300"
                    disabled={!year.from_date && true}
                    min={year.from_date}
                    value={year.from_date ? year.to_date : ''}
                    onChange={(e) =>
                      year.from_date &&
                      year.from_date < e.target.value &&
                      yearStatusChanges({ to_date: e.target.value })
                    }
                  />
                </div>
                <div class="text-center">
                  <p
                    id="complete"
                    class={
                      year.from_date
                        ? `${
                            year.complete ? 'text-green-500' : 'text-yellow-400'
                          }`
                        : 'hidden'
                    }
                  >
                    Estado: {year.complete ? 'COMPLETADO' : 'NO COMPLETADO'}
                  </p>
                  <p id="months">Meses transcurridos: {year.months || '0'}</p>
                </div>
                <div class="col-span-2 place-self-center">
                  <label for="employees">Empleados: </label>
                  <input
                    id="employees"
                    type="number"
                    disabled={!year.from_date}
                    class="rounded-md border-slate-300 bg-gray-50 max-w-fit w-20 disabled:bg-white disabled:border-slate-200 disabled:text-gray-300"
                    placeholder="0"
                    min="0"
                    value={year.employees ?? 0}
                    onChange={(e) => {
                      e.target.value && Number(e.target.value) > -1
                        ? yearChange({
                            employees: Number(e.target.value)
                          })
                        : yearChange({ employees: 0 });
                    }}
                  />
                </div>
              </div>
              <div class="flex grow justify-between w-full mt-5 gap-2">
                <button
                  disabled={!year.from_date}
                  type="button"
                  onClick={() => saveAndContinue()}
                  class="inline-flex justify-center rounded-md border border-transparent disabled:bg-gray-100 bg-green-200 px-4 py-2 text-sm font-medium disabled:text-gray-900 text-green-900 disabled:hover:bg-gray-100 hover:bg-green-300 focus:outline-none focus-visible:ring-2 disabled:focus-visible:ring-gray-500 focus-visible:ring-green-500 focus-visible:ring-offset-2 place-self-end disabled:hover:cursor-default hover:cursor-pointer"
                >
                  Guardar y continuar
                </button>
                <input
                  disabled={!year.from_date}
                  type="submit"
                  value="Guardar y salir"
                  class="inline-flex justify-center rounded-md border border-transparent disabled:bg-gray-100 bg-yellow-200 px-4 py-2 text-sm font-medium disabled:text-gray-900 text-yellow-900 disabled:hover:bg-gray-100 hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 disabled:focus-visible:ring-gray-500 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 place-self-end disabled:hover:cursor-default hover:cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => toggleYearModal(false)}
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default YearModal;
