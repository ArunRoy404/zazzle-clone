import { useEditorStore } from '@/store/useEditorStore';
import { addSticker } from '@/services/Editor';

const Sticker = ({ icon: Icon, url }) => {
    const { editorRef } = useEditorStore()

    const handleAddSticker = () => [
        addSticker({ svgURL: url, editorRef })
    ]



    return (
        <div
            className='cursor-pointer'
            onClick={handleAddSticker}
        >
            <Icon />
        </div>
    );
};

export default Sticker;