import { create } from 'zustand';

const useModelStore = create((set) => ({
    chosenModel: null,
    setChosenModel: (model) => set({ chosenModel: model }),
    resetChosenModel: () => set({ chosenModel: null }),
}));

export default useModelStore;