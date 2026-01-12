import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useEditorStore = create(
    persist(
        (set, get) => ({
            editorRef: null,
            pages: [null],
            currentPage: 0,

            setEditorRef: (editorRef) => set({ editorRef }),

            addPage: () => {
                const { pages } = get();
                set({ pages: [...pages, null] });
            },

            setCurrentPage: (index) => {
                set({ currentPage: index });
            },

            saveCurrentPage: () => {
                const { editorRef, pages, currentPage } = get();
                if (!editorRef || !editorRef.backgroundColor) return;

                const json = editorRef.toJSON();
                const newPages = [...pages];
                newPages[currentPage] = json;
                set({ pages: newPages });
            },

            resetEditorStore: () => {
                set({ editorRef: null, pages: [null, null], currentPage: 0 });
            }
        }),
        { name: "editor-storage" }
    )
);
