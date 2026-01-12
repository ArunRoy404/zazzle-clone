import { create } from 'zustand';

const useTestModeStore = create((set) => ({
    testMode: true,

    setTestMode: (value) => set({ testMode: value }),
    clearTestMode: () => set({ testMode: false }),
}));

export default useTestModeStore; 
