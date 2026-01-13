import React, { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { useEditorStore } from '@/store/useEditorStore';




const LayersList = () => {
    const { editorRef } = useEditorStore()

    const [objectsArray, setObjectsArray] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );



    const handleDragEnd = (event) => {
        const { active: activeObj, over: overObj } = event;

        if (activeObj.id !== overObj.id) {
            const oldIndex = objectsArray.findIndex(obj => obj.id === activeObj.id);
            const newIndex = objectsArray.findIndex(obj => obj.id === overObj.id);
            const newOrder = arrayMove([...objectsArray], oldIndex, newIndex);
            const bgImg = editorRef.backgroundImage || false

            const bgColor = editorRef.backgroundColor;
            editorRef.clear()

            if (bgImg) {
                editorRef.setBackgroundImage(bgImg)
            } else {
                editorRef.setBackgroundColor(bgColor)
            }

            newOrder.forEach(obj => editorRef.add(obj))
            editorRef.requestRenderAll()
            setObjectsArray(newOrder);
        }
    };



    useEffect(() => {
        if (!editorRef) return

        const handleObjectsChange = () => {
            const objects = editorRef.getObjects();
            setObjectsArray(objects)
        };


        editorRef.on('object:added', handleObjectsChange);
        editorRef.on('object:removed', handleObjectsChange);
        editorRef.on('e_stacking_changed', handleObjectsChange);

        handleObjectsChange();

        return () => {
            editorRef.off('object:added', handleObjectsChange);
            editorRef.off('object:removed', handleObjectsChange);
            editorRef.off('e_stacking_changed', handleObjectsChange);
        };
    }, [editorRef])



    return (
        <div className='min-h-75 max-h-70 md:max-h-125 w-full overflow-y-auto overflow-x-hidden border border-gray-200 rounded-md relative'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                /* restrictToVerticalAxis: Stops left/right 
                   restrictToParentElement: Stops the item from leaving the 500px box
                */
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
                <SortableContext items={objectsArray} strategy={verticalListSortingStrategy}>
                    <div className="p-2">
                        {[...objectsArray].reverse().map((obj) => (
                            <SortableItem key={obj.id} obj={obj} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default LayersList;