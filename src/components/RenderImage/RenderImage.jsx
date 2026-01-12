import useThreeRefStore from '@/store/useThreeRefStore';
import { useState } from 'react';
import * as THREE from 'three'
import { Button } from '../ui/button';
import { toast } from 'sonner';
import ViewImagesModal from './ViewImagesModal';
import useModelStore from '@/store/useModelStore';



const RenderImage = () => {
    const { threeRef } = useThreeRefStore();
    const { chosenModel } = useModelStore()
    const [capturedImages, setCapturedImages] = useState([]);


    // captures in the current resolution
    // const captureAngle = (name, x, y, z) => {
    //     const { scene, camera, renderer, orbitControls } = threeRef || {}

    //     if (!renderer || !camera || !scene) {
    //         toast.error("Three.js engine not fully initialized");
    //         return;
    //     }


    //     camera.position.set(x, y, z)
    //     camera.lookAt(0, 0, 0)
    //     if (orbitControls) orbitControls.update();
    //     renderer.render(scene, camera)
    //     const dataURL = renderer.domElement.toDataURL("image/png");
    //     setCapturedImages(prev => [{ name, url: dataURL }, ...prev])
    // };



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
    const captureAngle = (name, x, y, z) => {
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
        setCapturedImages(prev => [{ name, url: dataUrl }, ...prev].slice(0, 8));
    };



    const handleRenderAllImages = () => {
        setCapturedImages([])
        angles.forEach(angle => captureAngle(angle.name, ...angle.pos));
    }



    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-md bg-white border border-gray-200 w-fit">
            <p className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>Render Studio ({capturedImages.length}/8)</p>


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