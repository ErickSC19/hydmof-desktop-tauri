import create from 'solid-zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ModalStore {
  yearModalDisplay: boolean;
  toggleYearModal: (open: boolean) => void;
}

export const useModalStore = create(subscribeWithSelector<ModalStore>((set, get) => ({
  yearModalDisplay: false,
  toggleYearModal: (open) => {
    set({ yearModalDisplay: open });
  }
})));
