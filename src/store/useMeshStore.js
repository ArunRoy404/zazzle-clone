import { create } from 'zustand';

const useMeshStore = create((set) => ({
    meshes: [],
    selectedMesh: null,

    setMeshes: (meshList) => set({ meshes: meshList }),
    setSelectedMesh: (mesh) => set({ selectedMesh: mesh }),
    clearMeshes: () => set({ meshes: [], selectedMesh: null }),
}));

export default useMeshStore;