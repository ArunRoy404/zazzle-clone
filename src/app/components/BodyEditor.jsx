'use client'


import { AlertCircleIcon } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { applyCommonStyles } from "@/services/CommonControlStyle";
import { handleDeleteObject, handleRemoveEmptyText, handleRemoveText, touchToText } from "@/services/Editor";
import { useEditorStore } from "@/store/useEditorStore";
import useMeshStore from "@/store/useMeshStore";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import CanvasFakeDecoration from "./CanvasFakeDecoration";

const BodyEditor = () => {
    const { editorRef, setEditorRef, pages, currentPage } = useEditorStore()
    const { selectedMesh } = useMeshStore()

    let width = 2700;
    let height = 1100;
    // let height = 1624;
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

        touchToText({ ref: fabricCanvas })
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
            {
                !selectedMesh && (
                    <Alert variant="destructive" className='mb-1 bg-transparent'>
                        <AlertCircleIcon />
                        <AlertTitle>Selected a model and a mesh to start editing.</AlertTitle>
                    </Alert>

                )
            }
            <div
                ref={containerRef}
                className={`relative max-w-[800px] overflow-hidden mx-auto 
        ${!selectedMesh ? 'cursor-not-allowed opacity-50' : ''}`}
                style={{ aspectRatio: aspectRatio }}
            >
                {/* Wrap children in a div that catches or disables pointer events */}
                <div className={!selectedMesh ? "pointer-events-none" : ""}>
                    {/* <CanvasFakeDecoration /> */}
                    <canvas id="canvas" />
                </div>
            </div>
        </div>
    );
};


export default BodyEditor;