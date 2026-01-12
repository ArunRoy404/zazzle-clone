import { createDataURL } from "@/services/createDataURL";
import { useEditorStore } from "@/store/useEditorStore";
import { useEffect, useState } from "react";
import * as THREE from "three";

const UpdateMugTexture = ({ threeRef, modelLoaded }) => {
    const { editorRef } = useEditorStore();
    const [dataURL, setDataURL] = useState(null);

    // 1. Sync Fabric.js Canvas to a DataURL state
    useEffect(() => {
        if (!editorRef || !editorRef?.backgroundColor) return;

        const updateDataURL = () => {
            const dataUrl = createDataURL(editorRef);
            setDataURL(dataUrl);
        };

        updateDataURL()

        const events = ['object:added', 'object:modified', 'object:removed', 'canvas:modified'];
        events.forEach(event => editorRef.on(event, updateDataURL));

        return () => {
            events.forEach(event => editorRef.off(event, updateDataURL));
        };
    }, [editorRef]);


    // 2. Directly Update the Three.js Material

        // ... (First useEffect for Fabric events remains exactly as you have it)

        // 2. Directly Update the Three.js Material
        useEffect(() => {
            // Now this effect runs when dataURL changes OR when the model finishes loading
            if (!dataURL || !threeRef.current.material) return;

            const textureLoader = new THREE.TextureLoader();

            textureLoader.load(dataURL, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.flipY = true;

                const material = threeRef.current.material;

                if (material.map) material.map.dispose();

                material.map = texture;
                material.needsUpdate = true;
            });

            // Adding modelLoaded here is the key fix
        }, [dataURL, threeRef, modelLoaded]);


    return null;
};

export default UpdateMugTexture;