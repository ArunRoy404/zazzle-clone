import { create } from 'zustand';

const useBaseStore = create((set) => ({
    selectedBase: null,

    setSelectedBase: (base) => set({ selectedBase: base }),
    clearBase: () => set({ selectedBase: null }),
}));

export default useBaseStore; 