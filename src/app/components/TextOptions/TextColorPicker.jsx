import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from '@/components/ui/button';
import { hexToRgbaArray, rgbaArrayToHexWithAlpha } from '@/lib/colorConvert';
import { useTextObjectStore } from '@/store/useTextObjectStore';
import {
    ColorPicker,
    ColorPickerAlpha,
    ColorPickerEyeDropper,
    ColorPickerFormat,
    ColorPickerHue,
    ColorPickerOutput,
    ColorPickerSelection,
} from '@/components/shadcn-io/color-picker';




const TextColorPicker = () => {
    const { setCurrentTextColor } = useTextObjectStore();
    const { editorRef } = useEditorStore();
    const [color, setColor] = useState("#000000");
    const [disabled, setDisabled] = useState(true);

    const colorArray = hexToRgbaArray(color)
    const colorStyle = ({ backgroundColor: color })


    useEffect(() => {
        if (!editorRef || !editorRef.backgroundColor) return;

        const handleSelection = () => {
            const activeObject = editorRef.getActiveObject();
            if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
                setDisabled(false);
                const fill = activeObject.fill;
                if (typeof fill === 'string') {
                    setColor(fill);
                }
            } else {
                setDisabled(true);
            }
        };

        handleSelection();
        editorRef.on("selection:created", handleSelection);
        editorRef.on("selection:updated", handleSelection);
        editorRef.on("selection:cleared", handleSelection);

        return () => {
            editorRef.off("selection:created", handleSelection);
            editorRef.off("selection:updated", handleSelection);
            editorRef.off("selection:cleared", handleSelection);
        };
    }, [editorRef]);



    const handleColorChange = (newColor) => {
        const formattedColor = rgbaArrayToHexWithAlpha(newColor)
        setColor(formattedColor);

        if (editorRef) {
            const activeObject = editorRef.getActiveObject();
            if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
                activeObject.set('fill', formattedColor);
                editorRef.renderAll();
            }
        }
    };


    const handleSaveColor = () => {
        setCurrentTextColor(color);
    }


    return (
        <DropdownMenu onOpenChange={handleSaveColor}>
            {/* trigger  */}
            <DropdownMenuTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="ghost"
                    size="icon"
                    className="mx-auto flex h-7 w-7 flex-col items-center justify-center p-0"
                >
                    <span className="cursor-pointer text-base font-medium flex items-center flex-col">A
                        <div
                            className="h-1 w-6 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
                            style={colorStyle}
                        />
                    </span>
                </Button>
            </DropdownMenuTrigger>


            {/* color picker  */}
            <DropdownMenuContent side='right' className="" align="start">
                <ColorPicker
                    defaultValue={colorArray}
                    onChange={(newColor) => handleColorChange(newColor)}
                    className="min-w-45 md:min-w-60 h-50 md:h-60 bg-background">
                    <ColorPickerSelection />
                    <div className="flex items-center gap-4">
                        <ColorPickerEyeDropper />
                        <div className="grid w-full gap-1">
                            <ColorPickerHue />
                            <ColorPickerAlpha />
                        </div>
                    </div>
                </ColorPicker>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default TextColorPicker;