'use client'

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { createDataURL } from "@/services/createDataURL";

const RenderProduct = () => {
    const { editorRef } = useEditorStore();
    const [dataURL, setDataURL] = useState(null);

    useEffect(() => {
        if (!editorRef || !editorRef?.backgroundColor) return;

        let timeoutId = null;

        const updateDataURL = () => {
            if (timeoutId) clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                const dataUrl = createDataURL(editorRef);
                setDataURL(dataUrl);
            }, 300);
        };

        updateDataURL();

        const events = ['object:added', 'object:modified', 'object:removed', 'canvas:modified'];
        events.forEach(event => editorRef.on(event, updateDataURL));

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => editorRef.off(event, updateDataURL));
        };
    }, [editorRef]);

    return null;
};

export default RenderProduct;