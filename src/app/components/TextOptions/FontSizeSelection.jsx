import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { useTextObjectStore } from '@/store/useTextObjectStore';

const FontSizeSelection = () => {
    const { editorRef } = useEditorStore();
    const { setCurrentFontSize } = useTextObjectStore();
    const [fontSize, setFontSizeState] = useState(24);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        if (!editorRef || !editorRef.backgroundColor) return;

        const handleSelection = () => {
            const activeObject = editorRef.getActiveObject();
            if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
                const size = activeObject.fontSize || 24;
                setFontSizeState(size);
                setCurrentFontSize(size);
                setIsDisabled(false);
            } else {
                setIsDisabled(true);
            }
        };

        // Initial check
        handleSelection();

        editorRef.on('selection:created', handleSelection);
        editorRef.on('selection:updated', handleSelection);
        editorRef.on('selection:cleared', handleSelection);

        return () => {
            editorRef.off('selection:created', handleSelection);
            editorRef.off('selection:updated', handleSelection);
            editorRef.off('selection:cleared', handleSelection);
        };
    }, [editorRef, setCurrentFontSize]);

    const updateFontSize = (newSize) => {
        if (!editorRef || !editorRef.backgroundColor) return;
        const size = Math.max(1, parseInt(newSize, 10) || 1);

        setFontSizeState(size);
        setCurrentFontSize(size);

        const activeObject = editorRef.getActiveObject();
        if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
            activeObject.set('fontSize', size);
            editorRef.renderAll();
        }
    };

    const handleIncrement = () => updateFontSize(fontSize + 1);
    const handleDecrement = () => updateFontSize(fontSize - 1);

    const handleInputChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setFontSizeState('');
            return;
        }
        updateFontSize(val);
    };

    return (
        <div className={`flex items-center justify-center gap-2 rounded-md border p-1 w-[150px] ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <span
                onClick={handleDecrement}
                className="hidden md:block cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded select-none text-lg"
            >
                -
            </span>
            <input
                type="number"
                value={fontSize}
                onChange={handleInputChange}
                className="w-6 md:w-10 text-xs text-center border-none bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span
                onClick={handleIncrement}
                className="hidden md:block cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded select-none text-lg"
            >
                +
            </span>
        </div>
    );
};

export default FontSizeSelection;