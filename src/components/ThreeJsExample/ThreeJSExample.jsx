'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ZoomIn, ZoomOut } from "lucide-react";
import useThreeRefStore from "@/store/useThreeRefStore";
import UpdateMugTexture from "@/app/components/UpdateMugTexture";
import useModelStore from "@/store/useModelStore";

const ThreeJSExample = () => {
    const { chosenModel } = useModelStore();
    const [isMaximized, setIsMaximized] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const { setThreeRef } = useThreeRefStore();
    const lightIntensity = 2;



    const threeRef = useRef({
        scene: new THREE.Scene(),
        camera: null,
        renderer: null,
        currentModel: null,
        orbitControls: null,
        material: null,
        frameId: null,
        isInitialized: false,
        directionalLight: null,
    });



    const containerRef = useRef(null);
    useEffect(() => {
        if (threeRef.current) setThreeRef(threeRef.current);
        return () => setThreeRef(null);
    }, [setThreeRef]);



    const onWindowResize = useCallback(() => {
        const container = containerRef.current;
        const { camera, renderer } = threeRef.current;
        if (!container || !camera || !renderer) return;

        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }, []);



    const init = useCallback(() => {
        if (threeRef.current.isInitialized) return;

        const container = containerRef.current;
        const { scene } = threeRef.current;

        // Camera
        const camera = new THREE.PerspectiveCamera(15, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        camera.position.set(0, 0, 80);
        threeRef.current.camera = camera;

        // Lighting
        const hemispheric = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
        scene.add(hemispheric);
        const directional = new THREE.DirectionalLight(0xffffff, lightIntensity);
        directional.position.set(5, 5, 5);
        scene.add(directional);
        threeRef.current.directionalLight = directional;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });
        renderer.setClearColor(0xf3f4f6, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);
        threeRef.current.renderer = renderer;

        // Controls
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.enableZoom = true;
        threeRef.current.orbitControls = orbitControls;
        threeRef.current.isInitialized = true;

        // Load Model
        const loader = new GLTFLoader();
        loader.load(chosenModel.path, (gltf) => {
            if (threeRef.current.currentModel) scene.remove(threeRef.current.currentModel);

            const model = gltf.scene;
            if (chosenModel?.y) model.position.y = chosenModel.y;

            scene.add(model);
            threeRef.current.currentModel = model;

            model.traverse((obj) => {
                if (obj.isMesh && obj.name.includes(chosenModel.mesh)) {
                    threeRef.current.material = obj.material;
                }
            });

            if (chosenModel?.camera) {
                threeRef.current.camera.position.set(chosenModel.camera.x, chosenModel.camera.y, chosenModel.camera.z);
            }
            setModelLoaded(true);
        });
    }, [chosenModel, lightIntensity]);



    const animate = useCallback(() => {
        const { renderer, scene, camera, orbitControls } = threeRef.current;
        if (renderer && scene && camera) {
            orbitControls?.update();
            renderer.render(scene, camera);
        }
        threeRef.current.frameId = requestAnimationFrame(animate);
    }, []);



    useEffect(() => {
        if (typeof window === "undefined") return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    if (!threeRef.current.isInitialized) {
                        init();
                        animate();
                    } else {
                        onWindowResize();
                    }
                }
            }
        });


        if (containerRef.current) resizeObserver.observe(containerRef.current);
        window.addEventListener("resize", onWindowResize);


        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(threeRef.current.frameId);
            window.removeEventListener("resize", onWindowResize);

            if (threeRef.current.renderer) {
                threeRef.current.renderer.dispose();
                if (containerRef.current?.contains(threeRef.current.renderer.domElement)) {
                    containerRef.current.removeChild(threeRef.current.renderer.domElement);
                }
                threeRef.current.renderer = null;
                threeRef.current.isInitialized = false;
            }
        };
    }, [init, animate, onWindowResize]);




    const containerWidth = isMaximized ? '80dvw' : '200px';
    const containerHeight = isMaximized ? '80dvh' : '200px';

    return (
        <div
            className="flex flex-col rounded-xl shadow-md overflow-hidden bg-gray-100 relative transition-all duration-300"
            style={{ width: containerWidth, height: containerHeight }}
        >
            <UpdateMugTexture threeRef={threeRef} modelLoaded={modelLoaded} />

            <div className="absolute top-2 right-2 z-30 text-slate-400 cursor-pointer">
                {isMaximized ? (
                    <ZoomOut onClick={() => setIsMaximized(false)} size={15} />
                ) : (
                    <ZoomIn onClick={() => setIsMaximized(true)} size={15} />
                )}
            </div>

            <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />
        </div>
    );
};

export default ThreeJSExample;