'use client'


import { applyCommonStyles } from "@/services/CommonControlStyle";
import { handleDeleteObject, handleRemoveText, touchToText } from "@/services/Editor";
import { useEditorStore } from "@/store/useEditorStore";
import { useEditorTemplateStore } from "@/store/useEditorTemplateStore";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";

const CardEditor = () => {
    const { editorRef, setEditorRef, pages, currentPage } = useEditorStore()
    const { selectedTemplate } = useEditorTemplateStore();

    let width = selectedTemplate?.src?.width;
    let height = selectedTemplate?.src?.height;
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
        renderDesign(fabricCanvas)

        const handleDelete = (e) => handleDeleteObject({ e, ref: fabricCanvas })
        const handleRemove = (e) => handleRemoveText({ e, ref: fabricCanvas })
        window.addEventListener("keydown", handleDelete);
        window.addEventListener("keydown", handleRemove);



        return () => {
            window.removeEventListener("keydown", handleDelete);
            window.removeEventListener("keydown", handleRemove);
            fabricCanvas.dispose();
        }
    }, [width, height, currentPage])



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
        <div ref={containerRef} className='max-w-[310px] sm:max-w-[400px] md:max-w-[450px] xl:max-w-[500px] overflow-hidden'
            style={{ aspectRatio: aspectRatio }}
        >
            <canvas id="canvas" />
        </div>
    );
};


export default CardEditor;