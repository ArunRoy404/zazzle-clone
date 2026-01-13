import * as fabric from 'fabric'
import { applyCommonStyles } from './CommonControlStyle';
import { toast } from 'sonner';



export const addIdToObj = (obj) => {
    if (!obj?.id) {
        const timeStamp = new Date().getTime().toString()
        obj.set({
            id: `${obj.type}-${timeStamp}`,
        })
    }
}


export const addText = ({ position, text, fontFamily, fontSize, color, ref, fontWeight, top, left }) => {
    if (!ref) return;

    const canvasWidth = ref.getWidth();
    const canvasHeight = ref.getHeight();
    const zoom = ref.getZoom()



    const textObj = new fabric.IText(text || 'Edit Text', {
        left: left || 60,
        top: top || 60,
        fontFamily: fontFamily || 'Arial',

        fontSize: fontSize || Math.round(26 / zoom),
        fontWeight: fontWeight || 'bold',
        fill: color || '#000000',
        editable: true,
    })



    if (position === 'top') {
        textObj.set({
            paintFirst: 'fill',
            strokeUniform: true,
            objectCaching: false,
            left: canvasWidth / (2 * zoom),
            top: canvasHeight / (7 * zoom),
            originX: 'center',
            originY: 'center',
        });
    }
    if (position === 'center') {
        textObj.set({
            paintFirst: 'fill',
            strokeUniform: true,
            objectCaching: false,
            left: canvasWidth / (2 * zoom),
            top: canvasHeight / (2 * zoom),
            originX: 'center',
            originY: 'center',

            // editable: false,      // can't edit text
            // selectable: false,    // can't select
            // evented: false,       // no mouse events
        });
    }
    if (position === 'bottom') {
        textObj.set({
            paintFirst: 'fill',
            strokeUniform: true,
            objectCaching: false,
            left: canvasWidth / (2 * zoom),
            top: (canvasHeight / (3 * zoom)) * 2.5,
            originX: 'center',
            originY: 'center',
        });
    }

    applyCommonStyles(textObj)

    ref.add(textObj)
    ref.setActiveObject(textObj);
    ref.renderAll();
}



export const addTextBox = ({ position, text, fontFamily, fontSize, color, ref, fontWeight, top, left, width }) => {
    if (!ref) return;

    const canvasWidth = ref.getWidth();
    const canvasHeight = ref.getHeight();
    const zoom = ref.getZoom()


    const texBoxObj = new fabric.Textbox(text || 'Edit Text', {
        left: left || 60,
        top: top || 60,

        // width: 250,
        width: width || 650,
        height: 150,

        fontFamily: fontFamily || 'Arial',
        // fontSize: fontSize || Math.round(64 / zoom),
        fontSize: Math.round(fontSize / zoom),
        fontWeight: fontWeight || 'bold',

        fill: color || '#000000',
        breakWords: true,
        editable: true,
    })

    addIdToObj(texBoxObj)


    if (position === 'top') {
        texBoxObj.set({
            paintFirst: 'fill',
            strokeUniform: true,
            objectCaching: false,
            left: canvasWidth / (2 * zoom),
            top: canvasHeight / (7 * zoom),
            originX: 'center',
            originY: 'center',
        });
    }
    if (position === 'center') {
        texBoxObj.set({
            paintFirst: 'fill',
            strokeUniform: true,
            objectCaching: false,
            left: canvasWidth / (2 * zoom),
            top: canvasHeight / (2 * zoom),
            originX: 'center',
            originY: 'center',

            // editable: false,      // can't edit text
            // selectable: false,    // can't select
            // evented: false,       // no mouse events
        });
    }
    if (position === 'bottom') {
        texBoxObj.set({
            paintFirst: 'fill',
            strokeUniform: true,
            objectCaching: false,
            left: canvasWidth / (2 * zoom),
            top: (canvasHeight / (3 * zoom)) * 2.5,
            originX: 'center',
            originY: 'center',
        });
    }

    applyCommonStyles(texBoxObj)

    ref.add(texBoxObj)
    ref.setActiveObject(texBoxObj);
    ref.renderAll();
}




export const addSticker = async ({ svgURL, editorRef }) => {
    try {
        const img = await fabric.Image.fromURL(svgURL, {
            crossOrigin: 'anonymous'
        });

        addIdToObj(img)
        img.set({
            left: 50,
            top: 50,
        });
        img.scaleToWidth(600);

        if (typeof applyCommonStyles === "function") {
            applyCommonStyles(img);
        }

        editorRef.add(img);
        editorRef.setActiveObject(img);
        editorRef.renderAll();

    } catch (error) {
        console.error(error);
        toast.error("Error loading Sticker");
    }
};



export const handleDeleteObject = ({ e, ref }) => {
    if (e.key == 'Delete') {
        const activeObjects = ref.getActiveObjects();
        if (activeObjects.length) {
            activeObjects.forEach((obj) => ref.remove(obj));
            ref.discardActiveObject();
            ref.requestRenderAll();
        }
    }
}

export const handleRemoveText = ({ e, ref }) => {
    if (e.key === 'Backspace') {
        const activeObject = ref.getActiveObject();

        if (activeObject && activeObject.type === 'i-text' || activeObject.type === 'textbox') {
            activeObject.set('text', '')
            activeObject.enterEditing()
            activeObject.hiddenTextarea.focus()
            ref.requestRenderAll()
        }

    }
}




export const handleRemoveEmptyText = ({ ref }) => {
    if (!ref) return;

    const onSelectionCleared = (options) => {
        const deselectedObjects = options.deselected || [];

        deselectedObjects.forEach((obj) => {
            if (obj.type === 'i-text' || obj.type === 'textbox') {
                if (!obj.text || obj.text.trim() === "") {
                    ref.remove(obj);
                }
            }
        });
        ref.requestRenderAll();
    };

    ref.on('selection:cleared', onSelectionCleared);
    ref.on('selection:updated', onSelectionCleared);

    return () => {
        ref.off('selection:cleared', onSelectionCleared);
        ref.off('selection:updated', onSelectionCleared);
    };
};





export const touchToText = ({ ref }) => {
    // Move this outside or ensure it persists across calls
    let lastTapTime = 0;
    const doubleTapDelay = 300;

    ref.on('mouse:down', (options) => {
        // Fabric.js normalizes 'mouse:down' to include 'touchstart'
        const currentTapTime = new Date().getTime();
        const timeDiff = currentTapTime - lastTapTime;

        if (timeDiff < doubleTapDelay && timeDiff > 0) {
            // Prevent mobile browser defaults (zoom/scroll)
            if (options.e) {
                options.e.preventDefault();
                options.e.stopPropagation();
            }

            const pointer = ref.getPointer(options.e);

            const newTextBox = new fabric.Textbox('', {
                left: pointer.x,
                top: pointer.y,
                width: 250,
                height: 150,
                fontFamily: 'Arial',
                fontSize: 64,
                fontWeight: 'bold',
                fill: '#000000',
                editable: true,
                objectCaching: false
            });
            addIdToObj(newTextBox)


            if (typeof applyCommonStyles === 'function') {
                applyCommonStyles(newTextBox);
            }

            ref.add(newTextBox);
            ref.setActiveObject(newTextBox);

            // Critical for Mobile: Enter editing first
            newTextBox.enterEditing();

            // Use a slight timeout if the keyboard fails to appear
            setTimeout(() => {
                newTextBox.hiddenTextarea?.focus();
            }, 50);

            ref.requestRenderAll();

            // Reset tap time so a 3rd tap doesn't trigger another text immediately
            lastTapTime = 0;
        } else {
            lastTapTime = currentTapTime;
        }
    });
};



export const handleDownloadPDF = (images = [], fileName = "test.pdf") => {
    toast.success("Downloading PDF...");

    if (images.length === 0) return;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();


    const addImageToPDF = (imageDataUrl, isFirstPage = false) => {
        return new Promise((resolve) => {

            const img = new Image()
            img.src = imageDataUrl

            img.onload = () => {
                const imgWidth = img.width
                const imgHeight = img.height

                const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
                const width = imgWidth * ratio
                const height = imgHeight * ratio
                const x = (pageWidth - width) / 2
                const y = (pageHeight - height) / 2

                if (!isFirstPage) pdf.addPage()
                pdf.addImage(imageDataUrl, "PNG", x, y, width, height)
                resolve()

            }
        })
    }


    (async () => {
        for (let i = 0; i < images.length; i++) {
            await addImageToPDF(images[i], i === 0)
        }
        pdf.save(fileName)
    })();
}



export const initClipboard = (canvas) => {
    let clipboard = null;

    const handleKeyDown = async (e) => {
        const activeObject = canvas.getActiveObject();
        if (!activeObject || activeObject.isEditing) return;

        const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c";
        const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";

        /* ================= COPY ================= */
        if (isCopy) {
            clipboard = await activeObject.clone([]);
            return;
        }

        /* ================= PASTE ================= */
        if (isPaste && clipboard) {
            canvas.discardActiveObject();
            const OFFSET = 20;

            if (clipboard.type === "activeSelection") {
                // Create new clones for each object
                const newObjects = await Promise.all(
                    clipboard._objects.map((obj) => obj.clone())
                );

                newObjects.forEach((obj) => {
                    applyCommonStyles?.(obj);
                    obj.set({
                        left: obj.left + OFFSET,
                        top: obj.top + OFFSET,
                        evented: true,
                        selectable: true,
                    });
                    canvas.add(obj);
                });

                const selection = new fabric.ActiveSelection(newObjects, { canvas });
                canvas.setActiveObject(selection);
                selection.setCoords();
            } else {
                // Single object
                const clonedObj = await clipboard.clone([]);
                applyCommonStyles?.(clonedObj);

                clonedObj.set({
                    left: clonedObj.left + OFFSET,
                    top: clonedObj.top + OFFSET,
                    evented: true,
                    selectable: true,
                });

                canvas.add(clonedObj);
                canvas.setActiveObject(clonedObj);
                clonedObj.setCoords();
            }

            canvas.requestRenderAll();
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
};


export const initUndoRedo = (canvas) => {
    let history = [];
    let redoStack = [];
    let isLocked = false; // Prevents saving state while loading a state

    const saveState = () => {
        if (isLocked) return;

        const json = JSON.stringify(canvas.toDatalessJSON());

        // Only save if the state actually changed
        if (history.length > 0 && history[history.length - 1] === json) return;

        history.push(json);
        redoStack = []; // Clear redo when user performs a new action

        // Limit history size to 50 for performance
        if (history.length > 50) history.shift();
    };

    // 1. Listen for changes
    canvas.on('object:modified', saveState);
    canvas.on('object:added', saveState);
    canvas.on('object:removed', saveState);

    // Save initial state
    saveState();

    const handleKeyDown = async (e) => {
        const isUndo = (e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey;
        const isRedo = ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
            ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z');

        if (isUndo) {
            e.preventDefault();
            if (history.length <= 1) return; // Nothing to undo

            isLocked = true;
            const currentState = history.pop();
            redoStack.push(currentState);

            const previousState = history[history.length - 1];

            await canvas.loadFromJSON(previousState);
            canvas.renderAll();
            isLocked = false;
        }

        if (isRedo) {
            e.preventDefault();
            if (redoStack.length === 0) return;

            isLocked = true;
            const nextState = redoStack.pop();
            history.push(nextState);

            await canvas.loadFromJSON(nextState);
            canvas.renderAll();
            isLocked = false;
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        canvas.off('object:modified', saveState);
        canvas.off('object:added', saveState);
        canvas.off('object:removed', saveState);
    };
};