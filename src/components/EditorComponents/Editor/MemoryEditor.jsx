'use client'


import { applyCommonStyles } from "@/services/CommonControlStyle";
import { handleDeleteObject, handleRemoveText, initClipboard, initUndoRedo, touchToText } from "@/services/Editor";
import { useEditorStore } from "@/store/useEditorStore";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";



const MemoryEditor = () => {
    const { editorRef, setEditorRef, pages, currentPage } = useEditorStore()

    let width = 760;
    let height = Math.round(1.412 * width);
    const containerRef = useRef(null);
    const aspectRatio = width / height;


    const renderDesign = async (ref) => {
        if (pages[currentPage]) {
            await ref?.loadFromJSON(pages[currentPage]);
        }
        ref?.renderAll();
        ref?.getObjects()?.forEach(obj => applyCommonStyles(obj));
    }


    useEffect(() => {
        if (!width || !height) return

        const fabricCanvas = new fabric.Canvas('canvas', {
            enableRetinaScaling: true,
            width,
            height,
            backgroundColor: 'white',
            layout: 'blank',
        })

        fabricCanvas.setLayout = (newLayout) => { fabricCanvas.layout = newLayout }
        fabricCanvas.setBackgroundColor = (newColor) => { fabricCanvas.backgroundColor = newColor }

        touchToText({ ref: fabricCanvas })

        setEditorRef(fabricCanvas);
        renderDesign(fabricCanvas);

        const removeClipboardListeners = initClipboard(fabricCanvas);
        const cleanupUndo = initUndoRedo(fabricCanvas);

        const handleDelete = (e) => handleDeleteObject({ e, ref: fabricCanvas })
        const handleRemove = (e) => handleRemoveText({ e, ref: fabricCanvas })
        window.addEventListener("keydown", handleDelete);
        window.addEventListener("keydown", handleRemove);



        return () => {
            window.removeEventListener("keydown", handleDelete);
            window.removeEventListener("keydown", handleRemove);
            removeClipboardListeners();
            cleanupUndo();
            fabricCanvas.dispose();
        }
    }, [currentPage])


    const resizeCanvas = () => {
        // Check if the actual Fabric DOM elements are ready
        if (!editorRef || !editorRef.lowerCanvasEl || !containerRef.current) return;

        const parentWidth = containerRef.current.clientWidth;
        const scale = parentWidth / width;

        editorRef.setDimensions({
            width: width * scale,
            height: height * scale
        });
        editorRef.setZoom(scale);
        editorRef.requestRenderAll();
    };



    useEffect(() => {
        resizeCanvas();
    }, [width, height, editorRef]);



    return (
        <div ref={containerRef} className='max-w-[310px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[700px] overflow-hidden '
            style={{ aspectRatio: aspectRatio }}
        >
            <canvas id="canvas" />
        </div>
    );
};

export default MemoryEditor;