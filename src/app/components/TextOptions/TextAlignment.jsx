import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { List, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart } from 'lucide-react';
import { toast } from 'sonner';

const TextAlignment = ({ className }) => {
    const { editorRef } = useEditorStore();
    const [textAlign, setTextAlign] = useState('left');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (!editorRef || !editorRef.backgroundColor) return;

        const updateState = () => {
            const activeObject = editorRef.getActiveObject();
            if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
                setTextAlign(activeObject.textAlign || 'left');
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        };

        updateState();
        editorRef.on('selection:created', updateState);
        editorRef.on('selection:updated', updateState);
        editorRef.on('selection:cleared', updateState);

        return () => {
            editorRef.off('selection:created', updateState);
            editorRef.off('selection:updated', updateState);
            editorRef.off('selection:cleared', updateState);
        };
    }, [editorRef]);

    const handleAlign = (align) => {
        if (!editorRef || !editorRef.backgroundColor) return;
        const activeObject = editorRef.getActiveObject();
        if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
            activeObject.set('textAlign', align);
            activeObject.setCoords();
            editorRef.renderAll();
            setTextAlign(align);
        }
    };

    // Mapping for icon display
    const AlignIcon = {
        left: TextAlignStart,
        center: TextAlignCenter,
        right: TextAlignEnd,
        justify: TextAlignJustify,
    }[textAlign] || TextAlignStart;

    return (
        <div className={cn(
            "flex flex-col gap-1 w-full",
            className
        )}>
            {/* Alignment Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={disabled}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mx-auto h-7 w-7"
                    >
                        <AlignIcon size={15} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="min-w-10 p-1 flex flex-col gap-1">
                    <DropdownMenuItem onClick={() => handleAlign('left')} className="justify-center cursor-pointer">
                        <TextAlignStart size={15} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAlign('center')} className="justify-center cursor-pointer">
                        <TextAlignCenter size={15} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAlign('right')} className="justify-center cursor-pointer">
                        <TextAlignEnd size={15} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAlign('justify')} className="justify-center cursor-pointer">
                        <TextAlignJustify size={15} />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Placeholder for List - Fabric.js list support is non-trivial. 
                For now, keeping the button but maybe implementing basic indent/bullet later if requested. */}
            <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                className="mx-auto h-7 w-7"
                onClick={() => {
                    if (!editorRef || !editorRef.backgroundColor) return;
                    const activeObject = editorRef.getActiveObject();
                    if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
                        // Simple bullet point implementation
                        const text = activeObject.text;
                        const lines = text.split('\n');
                        const hasBullets = lines.every(line => line.trim().startsWith('• '));

                        const newText = hasBullets
                            ? lines.map(line => line.replace(/^• /, '')).join('\n')
                            : lines.map(line => `• ${line}`).join('\n');

                        activeObject.set('text', newText);
                        editorRef.renderAll();
                    } else {
                        toast.error("Select text to toggle list");
                    }
                }}
            >
                <List size={15} />
            </Button>
        </div>
    );
};

export default TextAlignment;
