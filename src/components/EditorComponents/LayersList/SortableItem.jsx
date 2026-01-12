import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export const SortableItem = ({ obj }) => {
    const { id } = obj
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        border: '1px solid #ccc',
        margin: '5px 0',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Note: We removed cursor: 'grab' from here 
        // because the whole row shouldn't be draggable
    };

    const handleStyle = {
        cursor: 'grab',
        padding: '5px',
        backgroundColor: '#eee',
        borderRadius: '4px',
        userSelect: 'none',
        marginLeft: '10px'
    };


    return (
        <div ref={setNodeRef} style={style}>
            {/* Left side: Content (Not draggable) */}
            <div className='flex items-center justify-center w-full h-full'>
                {
                    obj?.type === 'textbox' && <span>
                        {obj?.text?.length > 20 ? obj?.text?.slice(0, 20) + '...' : obj?.text}
                    </span>
                }
                {
                    obj?.type === 'image' && <img className='max-w-10' src={obj?._element?.src} alt="" />
                }
            </div>

            {/* Right side: Specific Drag Handle */}
            <div
                style={handleStyle}
                {...attributes}
                {...listeners}
            >
                <GripVertical className='text-gray-500' />
            </div>
        </div>
    );
};