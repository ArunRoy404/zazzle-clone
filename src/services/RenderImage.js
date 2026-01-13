import { toast } from "sonner";
import * as THREE from 'three'


export const captureAngle = (threeRef, name = 'preview', x, y, z,) => {
    const { scene, camera, renderer, orbitControls } = threeRef || {};

    if (!renderer || !camera || !scene) {
        toast.error("Three.js engine not fully initialized");
        return;
    }

    const originalSize = new THREE.Vector2();
    renderer.getSize(originalSize);


    const renderSize = 1024;
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
    return { name, url: dataUrl }
};
