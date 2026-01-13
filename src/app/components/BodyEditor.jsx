'use client'


import { applyCommonStyles } from "@/services/CommonControlStyle";
import { handleDeleteObject, handleRemoveEmptyText, handleRemoveText } from "@/services/Editor";
import { useEditorStore } from "@/store/useEditorStore";
import useModelStore from "@/store/useModelStore";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";

const BodyEditor = () => {
    const { editorRef, setEditorRef, pages, currentPage } = useEditorStore()
    const { chosenModel } = useModelStore();

    let width = chosenModel?.editorWidth || 2700;
    let height = chosenModel?.editorHeight || 1100;
    const containerRef = useRef(null);
    const aspectRatio = width / height;

    const renderDesign = async (ref) => {
        if (pages[currentPage]) {
            await ref?.loadFromJSON(pages[currentPage]);
        }
        ref?.renderAll();
        ref?.getObjects()?.forEach(obj => applyCommonStyles(obj));
    }


    const initFabric = async (ref) => {
        await renderDesign(ref);
        setEditorRef(ref);
    };




    useEffect(() => {
        if (!width || !height) return

        const fabricCanvas = new fabric.Canvas('canvas', {
            enableRetinaScaling: true,
            preserveObjectStacking: true,
            width,
            height,
            backgroundColor: 'white',
            backgroundImage: null,
            // layout: 'blank',
        })

        fabricCanvas.setLayout = (newLayout) => { fabricCanvas.layout = newLayout }
        fabricCanvas.setBackgroundColor = (newColor) => { fabricCanvas.backgroundColor = newColor }
        fabricCanvas.setBackgroundImage = (newImg) => { fabricCanvas.backgroundImage = newImg }


        initFabric(fabricCanvas)

        const handleDelete = (e) => handleDeleteObject({ e, ref: fabricCanvas })
        const handleRemove = (e) => handleRemoveText({ e, ref: fabricCanvas })
        window.addEventListener("keydown", handleDelete);
        window.addEventListener("keydown", handleRemove);
        const cleanupEmptyText = handleRemoveEmptyText({ ref: fabricCanvas });



        return () => {
            window.removeEventListener("keydown", handleDelete);
            window.removeEventListener("keydown", handleRemove);
            setEditorRef(null);
            fabricCanvas.dispose();
            cleanupEmptyText()
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
        <div>
            <div
                ref={containerRef}
                className={`relative max-w-dvw lg:max-w-[800px] overflow-hidden mx-auto `}
                style={{ aspectRatio: aspectRatio }}
            >
                <div>
                    {/* <CanvasFakeDecoration /> */}
                    <canvas id="canvas" />
                </div>
            </div>
        </div>
    );
};


export default BodyEditor;