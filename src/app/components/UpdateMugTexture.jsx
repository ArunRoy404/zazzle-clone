import { createDataURL } from "@/services/createDataURL";
import { useEditorStore } from "@/store/useEditorStore";
import { useEffect, useState } from "react";

const UpdateMugTexture = ({ textureRef }) => {

    const { editorRef } = useEditorStore();
    const [dataURL, setDataURL] = useState(null);

    useEffect(() => {
        if (!editorRef || !editorRef?.backgroundColor) return;

        const updateDataURL = () => {
            const dataUrl = createDataURL(editorRef)
            setDataURL(dataUrl)
        }

        editorRef.on('object:added', updateDataURL);
        editorRef.on('object:modified', updateDataURL);
        editorRef.on('object:removed', updateDataURL);
        editorRef.on('canvas:modified', updateDataURL);

        return () => {
            editorRef.off('object:added', updateDataURL);
            editorRef.off('object:modified', updateDataURL);
            editorRef.off('object:removed', updateDataURL);
            editorRef.off('canvas:modified', updateDataURL);
        }
    }, [editorRef])


    useEffect(() => {
        if (!dataURL || !textureRef.current) return;

        const selectElement = textureRef.current;

        // 1. Check if an option for the dataURL already exists, if not, create/update one
        let customOption = selectElement.querySelector('option[data-custom="true"]');
        if (!customOption) {
            customOption = document.createElement('option');
            customOption.setAttribute('data-custom', 'true');
            customOption.style.display = 'none'; // Keep it out of the dropdown list
            selectElement.add(customOption);
        }

        // 2. Set the value of the option to the DataURL
        customOption.value = dataURL;
        customOption.textContent = "Current Editor Design";

        // 3. Now select it
        selectElement.value = dataURL;

        // 4. Trigger the change event so Three.js picks it up
        const event = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(event);
    }, [dataURL, textureRef]);
    return (
        <div />
    );
};

export default UpdateMugTexture;