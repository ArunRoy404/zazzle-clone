import useThreeRefStore from '@/store/useThreeRefStore';
import { useEffect, useState } from 'react';
import * as THREE from 'three'
import { Button } from '../ui/button';
import { toast } from 'sonner';
import ViewImagesModal from './ViewImagesModal';
import useModelStore from '@/store/useModelStore';
import { useEditorStore } from '@/store/useEditorStore';



const RenderImage = () => {
    const { threeRef } = useThreeRefStore();
    const { chosenModel } = useModelStore()
    const [capturedImages, setCapturedImages] = useState([]);
    const { editorRef } = useEditorStore()
    const [previewImg, setPreviewImage] = useState(null)


    const z1 = chosenModel?.camera?.z || 0          // initial camera z position
    const y1 = Math.round(z1 / 3)                   // calculated top camera position dynamically
    const angledPosition = Math.round(z1 * 0.707)   // calculated camera position for 45° and 135° angles


    const angles = [
        { name: 'Front', pos: [0, y1, z1] },                                   // 0°
        { name: 'Front-Right', pos: [angledPosition, y1, angledPosition] },    // 45°
        { name: 'Right', pos: [z1, y1, 0] },                                   // 90°
        { name: 'Back-Right', pos: [angledPosition, y1, -angledPosition] },    // 135°
        { name: 'Back', pos: [0, y1, -z1] },                                   // 180°
        { name: 'Back-Left', pos: [-angledPosition, y1, -angledPosition] },    // 225°
        { name: 'Left', pos: [-z1, y1, 0] },                                   // 270°
        { name: 'Front-Left', pos: [-angledPosition, y1, angledPosition] },    // 315°
    ];




    // captures in high resolutions 
    const captureAngle = (name, x, y, z, callBackFn) => {
        const { scene, camera, renderer, orbitControls } = threeRef || {};

        if (!renderer || !camera || !scene) {
            toast.error("Three.js engine not fully initialized");
            return;
        }

        const originalSize = new THREE.Vector2();
        renderer.getSize(originalSize);


        const renderSize = 2048;
        renderer.setSize(renderSize, renderSize, false);

        camera.aspect = 1;
        camera.updateProjectionMatrix();


        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        if (orbitControls) orbitControls.update();
        renderer.render(scene, camera);
        const dataUrl = renderer.domElement.toDataURL("image/png", 1.0);


        renderer.setSize(originalSize.x, originalSize.y);
        camera.aspect = originalSize.x / originalSize.y;
        camera.updateProjectionMatrix();


        renderer.render(scene, camera);
        if (callBackFn) {
            callBackFn({ name, url: dataUrl })
        } else {
            setCapturedImages(prev => [{ name, url: dataUrl }, ...prev].slice(0, 8));
        }
    };



    const handleRenderAllImages = () => {
        setCapturedImages([])
        angles.forEach(angle => captureAngle(angle.name, ...angle.pos));
    }



    useEffect(() => {
        if (!editorRef || !editorRef?.backgroundColor) return;

        const updatePreviewImg = () => {
            setTimeout(() => {
                captureAngle(angles[1].name, ...angles[1].pos, setPreviewImage)
            }, 1000);
        }

        editorRef.on('object:added', updatePreviewImg);
        editorRef.on('object:modified', updatePreviewImg);
        editorRef.on('object:removed', updatePreviewImg);
        editorRef.on('canvas:modified', updatePreviewImg);

        return () => {
            editorRef.off('object:added', updatePreviewImg);
            editorRef.off('object:modified', updatePreviewImg);
            editorRef.off('object:removed', updatePreviewImg);
            editorRef.off('canvas:modified', updatePreviewImg);
        }
    }, [editorRef])



    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-md bg-white border border-gray-200 w-fit">
            <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Render Studio ({capturedImages.length}/8)</p>

            <div className="relative group">
                <img
                    src={previewImg?.url}
                    alt={previewImg?.name}
                    className="w-30 h-40 object-cover rounded border bg-gray-50"
                />
                <span className="absolute bottom-0 left-0 bg-black/50 text-[8px] text-white px-1">
                    {previewImg?.name}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
                {capturedImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                        <img
                            src={img.url}
                            alt={img.name}
                            className="w-20 h-20 object-cover rounded border bg-gray-50"
                        />
                        <span className="absolute bottom-0 left-0 bg-black/50 text-[8px] text-white px-1">
                            {img.name}
                        </span>
                    </div>
                ))}
                {/* {capturedImages.length === 0 && (
                    <div className="col-span-2 h-20 border-dashed border-2 border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">
                        No renders yet
                    </div>
                )} */}
            </div>


            <div>
                <Button className='w-full mb-2' onClick={handleRenderAllImages}>
                    {capturedImages.length === 0 ? 'Render All' : 'Re Render All'}
                </Button>

                <ViewImagesModal images={capturedImages} />
            </div>
        </div>
    );
};

export default RenderImage;