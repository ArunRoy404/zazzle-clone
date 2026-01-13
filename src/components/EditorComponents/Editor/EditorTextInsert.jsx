import { Button } from '@/components/ui/button';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { addTextBox } from '@/services/Editor';
import { useEditorStore } from '@/store/useEditorStore';
import { useTextObjectStore } from '@/store/useTextObjectStore';


const EditorTextInsert = ({ isMobile = false }) => {
    const { editorRef } = useEditorStore()
    const { currentFontFamily, currentFontSize, currentTextColor } = useTextObjectStore()

    const handleAddText = ({ text, position, fontSize, fontWeight, width }) => {
        if (!!text) {
            addTextBox({ position, text, fontFamily: currentFontFamily, fontSize: fontSize || currentFontSize, color: currentTextColor, ref: editorRef, fontWeight, width })
            return
        }
        addTextBox({ position, text: 'Edit Text', fontFamily: currentFontFamily, fontSize: fontSize || currentFontSize, color: currentTextColor, ref: editorRef, width })
    }


    if (isMobile) {
        return (
            <Button
                onClick={() => handleAddText({ text: 'This is a text box', fontSize: 16, fontWeight: 'normal', width: 450 })}
                className='w-full hover:scale-100 active:scale-100'
            >
                T   Add a text box
            </Button>
        )
    }


    return (
        <DropdownMenuContent side="left" align="start" className="p-4 w-80">
            <Button
                onClick={() => handleAddText({ text: 'This is a text box', fontSize: 24, fontWeight: 'normal' })}
                className='w-full hover:scale-100 active:scale-100'
            >
                T   Add a text box
            </Button>
        </DropdownMenuContent>
    );
};

export default EditorTextInsert;