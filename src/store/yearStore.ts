import create from "solid-zustand";
import { Year } from "../types/YearsTypes";

interface YearStore {
  all: Year[];
  selected: string[];
  toEdit?: Year | null;
  setToEdit: (value:string) => void;
  setSelected: (value: string[]) => void;
  addSelected: (value: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

const defaultData: Year[] = [
  {
    year_id: "1",
    from_date: "2018",
    to_date: "2019",
    employees: 7,
    complete: true,
    months: 12,
  },
  {
    year_id: "2",
    from_date: "2019",
    to_date: "2020",
    employees: 12,
    complete: true,
    months: 12,
  },
];

export const useYearStore = create<YearStore>((set, get) => ({
  all: defaultData,
  selected: [],
  toEdit: null,
  setToEdit: (value) => {
    const selectedYear = get().all.filter(c => {c.year_id === value})
    set({toEdit: selectedYear[0]})},
  setSelected: (value) => set({selected: value}),
  addSelected: (value) => {
    const newArr = [value, ...get().selected];
    set({
      selected: newArr,
    });
  },
  selectAll: () => {
    const newArray = get().all.map((c) => c.year_id);
    set({
      selected: newArray,
    });
  },
  deselectAll: () => {
    set({
      selected: [],
    });
  },
}));
