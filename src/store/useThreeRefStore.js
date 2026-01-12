import { create } from 'zustand';

const useThreeRefStore = create((set) => ({
    threeRef: null,
    setThreeRef: (ref) => set({ threeRef: ref }),
    resetThreeRef: () => set({ threeRef: null }),
}));

export default useThreeRefStore;