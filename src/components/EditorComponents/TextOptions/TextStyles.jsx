import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Button } from '@/components/ui/button';
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
} from "lucide-react";
import { cn } from '@/lib/utils';

const TextStyles = ({ className }) => {
    const { editorRef } = useEditorStore();
    const [styles, setStyles] = useState({
        fontWeight: 'normal',
        fontStyle: 'normal',
        underline: false,
        linethrough: false,
    });
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (!editorRef || !editorRef.backgroundColor) return;

        const updateState = () => {
            const activeObject = editorRef.getActiveObject();
            if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
                setStyles({
                    fontWeight: activeObject.fontWeight || 'normal',
                    fontStyle: activeObject.fontStyle || 'normal',
                    underline: activeObject.underline || false,
                    linethrough: activeObject.linethrough || false,
                });
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

    const toggleStyle = (property, valueOn, valueOff = 'normal') => {
        if (!editorRef || !editorRef.backgroundColor) return;
        const activeObject = editorRef.getActiveObject();
        if (activeObject && (activeObject.isType('i-text') || activeObject.isType('text') || activeObject.isType('textbox'))) {
            const currentValue = activeObject[property];
            const newValue = currentValue === valueOn ? valueOff : valueOn;

            // Handle booleans (underline, linethrough) where valueOff might be false
            const finalValue = (typeof valueOn === 'boolean')
                ? !currentValue
                : newValue;

            activeObject.set(property, finalValue);
            activeObject.setCoords();
            editorRef.renderAll();

            setStyles(prev => ({
                ...prev,
                [property]: finalValue
            }));
        }
    };

    const isActive = (property, value) => {
        if (typeof value === 'boolean') {
            return styles[property] === value;
        }
        return styles[property] === value;
    };

    return (
        <div className={cn(
            "flex flex-col gap-1 w-full",
            className
        )}>
            <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
                className={cn("mx-auto h-7 w-7", isActive('fontWeight', 'bold') && "bg-accent text-accent-foreground")}
            >
                <BoldIcon size={15} />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
                className={cn("mx-auto h-7 w-7", isActive('fontStyle', 'italic') && "bg-accent text-accent-foreground")}
            >
                <ItalicIcon size={15} />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => toggleStyle('underline', true, false)}
                className={cn("mx-auto h-7 w-7", isActive('underline', true) && "bg-accent text-accent-foreground")}
            >
                <UnderlineIcon size={15} />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => toggleStyle('linethrough', true, false)}
                className={cn("mx-auto h-7 w-7", isActive('linethrough', true) && "bg-accent text-accent-foreground")}
            >
                <StrikethroughIcon size={15} />
            </Button>
        </div>
    );
};

export default TextStyles;
