import { addText } from '@/services/Editor';
import { useEditorStore } from '@/store/useEditorStore';
import { useTextObjectStore } from '@/store/useTextObjectStore';
import { Type } from 'lucide-react';

const CardTextInsert = () => {
    const { editorRef } = useEditorStore()
    const { currentFontFamily, currentFontSize, currentTextColor } = useTextObjectStore()

    const handleAddText = ({ text, position }) => {
        if (!!text) {
            addText({ position, text, fontFamily: currentFontFamily, fontSize: currentFontSize, color: currentTextColor, ref: editorRef })
            return
        }
        addText({ position, fontFamily: currentFontFamily, fontSize: currentFontSize, color: currentTextColor, ref: editorRef })
    }

    return (
        <div
            className='bg-[#F9FAFB] grid grid-cols-1 flex-1 min-w-70'
        >
            <div
                onClick={() => handleAddText({ text: 'Add Text', position: 'top' })}
                className='border border-dashed cursor-pointer flex gap-2 items-center text-subtitle font-semibold justify-center m-4'
            >
                <Type />
                <p
                >Add Text</p>
            </div>
            <div
                onClick={() => handleAddText({ text: 'Happy Birthday! I Hope You Have a Great Day', position: 'center' })}
                className='border border-dashed cursor-pointer text-center flex gap-2 items-center text-subtitle font-semibold justify-center m-4'
            >
                <p>Happy Birthday! <br />
                    I Hope You Have a Great Day</p>
            </div>
            <div
                onClick={() => handleAddText({ text: 'Add Text', position: 'bottom' })}
                className='border border-dashed cursor-pointer flex gap-2 items-center text-subtitle font-semibold justify-center m-4'
            >
                <Type />
                <p>Add Text</p>
            </div>
        </div>
    );
};

export default CardTextInsert;