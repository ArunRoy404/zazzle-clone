import { Button } from '@/components/ui/button';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { addTextBox } from '@/services/Editor';
import { useEditorStore } from '@/store/useEditorStore';
import { useTextObjectStore } from '@/store/useTextObjectStore';


const MemoryTextInsert = () => {
    const { editorRef } = useEditorStore()
    const { currentFontFamily, currentFontSize, currentTextColor } = useTextObjectStore()

    const handleAddText = ({ text, position, fontSize, fontWeight }) => {
        if (!!text) {
            addTextBox({ position, text, fontFamily: currentFontFamily, fontSize: fontSize || currentFontSize, color: currentTextColor, ref: editorRef, fontWeight })
            return
        }
        addTextBox({ position, fontFamily: currentFontFamily, fontSize: fontSize || currentFontSize, color: currentTextColor, ref: editorRef })
    }



    return (
        <DropdownMenuContent side="left" align="start" className="p-4 w-80">
            <Button
                onClick={() => handleAddText({ text: 'This is a text box', fontSize: 24, fontWeight: 'normal' })}
                className='w-full hover:scale-100 active:scale-100'
            >
                T   Add a text box
            </Button>

            {/* <p className='py-4'>Default text styles</p>

            <div
                className='flex flex-col gap-2'
            >
                <Button
                    onClick={() => handleAddText({ text: 'Heading', fontSize: 52, fontWeight: 'bold' })}
                    variant='outline'
                    className='border-border text-3xl! font-bold p-2 justify-start hover:scale-100 active:scale-100'
                >
                    Add a heading
                </Button>
                <Button
                    onClick={() => handleAddText({ text: 'Subheading', fontSize: 32 })}
                    variant='outline'
                    className='border-border text-normal! p-2 justify-start hover:scale-100 active:scale-100'
                >
                    Add a subheading
                </Button>
                <Button
                    onClick={() => handleAddText({ text: 'This is a body text', fontSize: 16, fontWeight: 'normal' })}
                    variant='outline'
                    className='border-border text-[12px]! p-2 justify-start hover:scale-100 active:scale-100'
                >
                    Add a little bit of body text
                </Button>
            </div> */}
        </DropdownMenuContent>
    );
};

export default MemoryTextInsert;