import useThreeRefStore from '@/store/useThreeRefStore';
import { useEffect, useState } from 'react';
import ViewImagesModal from './ViewImagesModal';
import useModelStore from '@/store/useModelStore';
import { useEditorStore } from '@/store/useEditorStore';
import { captureAngle } from '@/services/RenderImage';



const RenderImage = () => {
    const { threeRef } = useThreeRefStore();
    const { chosenModel } = useModelStore()
    const { editorRef } = useEditorStore()
    const [previewImg, setPreviewImage] = useState(null)
    const [isPreviewRendering, setIsPreviewRendering] = useState(false);


    const z1 = chosenModel?.camera?.z || 0          // initial camera z position
    const y1 = Math.round(z1 / (chosenModel?.topDivider || 3))                   // calculated top camera position dynamically
    const angledPosition = Math.round(z1 * 0.707)   // calculated camera position for 45° and 135° angles
    const previewAngle = [angledPosition, y1, angledPosition]


    useEffect(() => {
        if (!editorRef || !editorRef?.backgroundColor) return;

        let debounceTimer;

        const updatePreviewImg = () => {
            if (debounceTimer) clearTimeout(debounceTimer);

            debounceTimer = setTimeout(() => {
                setIsPreviewRendering(true);
                setTimeout(() => {
                    const img = captureAngle(threeRef, 'Preview', ...previewAngle);
                    setPreviewImage(img);
                    setIsPreviewRendering(false);
                }, 1000);

            }, 1000);
        };

        updatePreviewImg();

        editorRef.on('object:added', updatePreviewImg);
        editorRef.on('object:modified', updatePreviewImg);
        editorRef.on('object:removed', updatePreviewImg);
        editorRef.on('canvas:modified', updatePreviewImg);

        return () => {
            // 4. Cleanup the timer on unmount
            if (debounceTimer) clearTimeout(debounceTimer);

            editorRef.off('object:added', updatePreviewImg);
            editorRef.off('object:modified', updatePreviewImg);
            editorRef.off('object:removed', updatePreviewImg);
            editorRef.off('canvas:modified', updatePreviewImg);
        };
    }, [editorRef]);
    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-md bg-white w-fit">
            <div className="relative group">
                <img
                    src={previewImg?.url}
                    alt={previewImg?.name}
                    className="w-40 h-40 object-cover rounded bg-gray-50"
                />
                <span className="absolute bottom-0 left-0 bg-black/50 text-sm text-white px-1">
                    {isPreviewRendering ? 'Rendering...' : previewImg?.name}
                </span>
            </div>

            <div>
                <ViewImagesModal />
            </div>
        </div>
    );
};

export default RenderImage;