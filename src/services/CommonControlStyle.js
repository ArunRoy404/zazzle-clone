import * as fabric from 'fabric';
import { Trash2, RotateCw } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

export const applyCommonStyles = (fabricObj) => {
    if (!fabricObj) return;

    // 1. Apply Styles
    fabricObj.set({
        borderColor: '#3b82f6',
        borderScaleFactor: 3,      // Higher number = thicker outline
        cornerSize: 10,
        transparentCorners: false, // Solid corners often look better with thick borders
        cornerColor: '#3b82f6',
        cornerStrokeColor: '#ffffff', // Adds a white ring around the corner for contrast
        padding: 10,
    });

    // 2. Load Icons (Lucide)
    const deleteSvg = renderToStaticMarkup(<Trash2 color="#ff4d4f" size={20} />);
    const deleteIconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(deleteSvg)}`;
    const rotateSvg = renderToStaticMarkup(<RotateCw color="#3b82f6" size={20} />);
    const rotateIconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rotateSvg)}`;

    const deleteImg = document.createElement('img');
    deleteImg.src = deleteIconUrl;
    const rotateImg = document.createElement('img');
    rotateImg.src = rotateIconUrl;


    // 3. Render Functions
    const createRenderFunction = (img) => {
        return (ctx, left, top, fabricObject) => {
            const size = 24;
            const iconSize = 14;

            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));

            // Draw Circle
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#e5e7eb";
            ctx.stroke();

            // Draw Icon
            ctx.drawImage(img, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
            ctx.restore();
        };
    };

    const renderDeleteIcon = createRenderFunction(deleteImg);
    const renderRotateIcon = createRenderFunction(rotateImg);

    // 4. Action Handlers
    const deleteObject = (eventData, transform) => {
        const target = transform.target;
        const canvas = target.canvas;
        canvas.remove(target);
        canvas.requestRenderAll();
    };

    // 5. Attach Controls

    // Delete Control (Top Right)
    fabricObj.controls.deleteControl = new fabric.Control({
        x: 0.3,
        y: -0.6,
        offsetY: -16,
        cursorStyle: 'pointer',
        render: renderDeleteIcon,
        mouseUpHandler: deleteObject,
        sizeX: 24,
        sizeY: 24,
        touchSizeX: 24,
        touchSizeY: 24,
    });

    // Rotate Control (Top Left)
    fabricObj.controls.rotateControl = new fabric.Control({
        x: -0.3,
        y: -0.6,
        offsetY: -16,
        cursorStyle: 'crosshair',
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: 'rotate',
        render: renderRotateIcon,
        sizeX: 24,
        sizeY: 24,
    });

    // Hide default rotate control (mtr)
    if (fabricObj.controls.mtr) {
        fabricObj.controls.mtr.visible = false;
    }
};