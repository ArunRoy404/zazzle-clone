'use client'

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import TextureOptions from "../../app/threejs-editor/components/mugOptions/TextureOptions";
import { ZoomIn, ZoomOut } from "lucide-react";
import UpdateMugTexture from "../../app/threejs-editor/components/UpdateMugTexture";
import { getMeshDetails } from "@/services/showMeshDetails";
import useModelStore from "@/store/useModelStore";
import useMeshStore from "@/store/useMeshStore";
import SelectBaseMesh from "../../app/threejs-editor/components/mugOptions/BaseOptions";
import useBaseStore from "@/store/useBaseStore";
import useThreeRefStore from "@/store/useThreeRefStore";
import { Slider } from "../ui/slider";
import useTestModeStore from "@/store/useTestModeStore";



const ThreeJSExample = () => {
    const { testMode } = useTestModeStore();
    const [lightIntensity, setLightIntensity] = useState(5);
    const [isMaximized, setIsMaximized] = useState(false);
    const { chosenModel } = useModelStore();
    const { setMeshes, selectedMesh, setSelectedMesh } = useMeshStore();
    const { selectedBase } = useBaseStore()
    const { setThreeRef } = useThreeRefStore();



    // ---------------------------------------------------------
    // 1. ENGINE REFS: Core Three.js Objects
    // These are kept in a ref to persist across renders without 
    // triggering re-renders themselves.
    // ---------------------------------------------------------
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
    const textureRef = useRef(null);
    const colorRef = useRef(null);

    useEffect(() => {
        if (threeRef.current) {
            setThreeRef(threeRef.current);
        }

        return () => {
            setThreeRef(null);
        };
    }, [setThreeRef]);

    // ---------------------------------------------------------
    // 2. RESIZE HANDLER: Keep 3D Canvas Responsive
    // Adjusts aspect ratio and renderer size when container dimensions change.
    // ---------------------------------------------------------
    const onWindowResize = useCallback(() => {
        const container = containerRef.current;
        const { camera, renderer } = threeRef.current;
        if (!container || !camera || !renderer) return;

        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }, []);



    // ---------------------------------------------------------
    // 3. INITIALIZATION ENGINE: Setup Scene, Camera, Lights
    // ---------------------------------------------------------
    const init = useCallback(() => {
        if (threeRef.current.isInitialized) return;

        const container = containerRef.current;
        const { scene } = threeRef.current;

        // CAMERA Setup
        const camera = new THREE.PerspectiveCamera(
            15,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 80);
        threeRef.current.camera = camera;


        // LIGHTING Setup
        const hemispheric = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
        scene.add(hemispheric);
        const directional = new THREE.DirectionalLight(0xffffff, lightIntensity);
        directional.position.set(5, 5, 5);
        scene.add(directional);
        threeRef.current.directionalLight = directional;


        // RENDERER Setup
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


        // CONTROLS Setup
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.enableZoom = false; // initial zoom off
        threeRef.current.orbitControls = orbitControls;
        threeRef.current.isInitialized = true;
    }, []);



    // ---------------------------------------------------------
    // 4. ANIMATION LOOP: Constant Rendering
    // ---------------------------------------------------------
    const animate = useCallback(() => {
        const { renderer, scene, camera, orbitControls } = threeRef.current;
        if (renderer && scene && camera) {
            orbitControls?.update();
            renderer.render(scene, camera);
        }
        threeRef.current.frameId = requestAnimationFrame(animate);
    }, []);




    // ---------------------------------------------------------
    // 5. TEXTURE SYSTEM & LIFECYCLE
    // ---------------------------------------------------------
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

        const textureLoader = new THREE.TextureLoader();

        const handleTextureChange = (e) => {
            if (threeRef.current.material) {
                const texture = textureLoader.load(e.target.value);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.flipY = true;

                threeRef.current.material.map = texture;
                threeRef.current.material.needsUpdate = true;
            }
        };

        const textureEl = textureRef.current;
        textureEl?.addEventListener("change", handleTextureChange);
        window.addEventListener("resize", onWindowResize);


        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(threeRef.current.frameId);
            window.removeEventListener("resize", onWindowResize);
            textureEl?.removeEventListener("change", handleTextureChange);

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







    // MODEL SWITCHER: Loads new model when chosenModel changes
    useEffect(() => {
        const { scene, isInitialized } = threeRef.current;
        if (!isInitialized || !chosenModel) return;

        const loader = new GLTFLoader();
        loader.load(chosenModel.path, (gltf) => {
            if (threeRef.current.currentModel) scene.remove(threeRef.current.currentModel);


            if (chosenModel?.y) {
                const model = gltf.scene;
                model.position.y = chosenModel.y;
                scene.add(model);
            }

            // const model = gltf.scene;
            // model.position.y = -1.3;
            // scene.add(model);

            const object = gltf.scene;
            const extractedMeshes = [];

            object.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    extractedMeshes.push(getMeshDetails(obj));
                }
            });

            setMeshes(extractedMeshes);

            scene.add(object);
            threeRef.current.currentModel = object;
            if (chosenModel?.camera) {
                threeRef.current.camera.position.set(chosenModel.camera.x, chosenModel.camera.y, chosenModel.camera.z);
            }

        });
    }, [chosenModel, setMeshes]);




    // Texture SELECTION LOGIC: Update material target when selection changes
    useEffect(() => {
        if (!threeRef.current.currentModel || !selectedMesh) return;

        threeRef.current.currentModel.traverse((obj) => {
            if (obj.name.includes(selectedMesh.name)) {
                threeRef.current.material = obj.material;
            }
        });
    }, [selectedMesh]);





    // Base SELECTION LOGIC 
    useEffect(() => {
        if (!threeRef.current.currentModel || !selectedBase) return;

        // Use an AbortController for easy cleanup of listeners
        const controller = new AbortController();
        const { signal } = controller;

        threeRef.current.currentModel.traverse((obj) => {
            if (obj.isMesh && obj.name.includes(selectedBase.name)) {
                const mat = obj.material;

                // Use the signal to automatically remove this listener later
                colorRef.current?.addEventListener("input", (e) => {
                    mat.color.set(e.target.value);
                }, { signal });
            }
        });

        // CLEANUP: This runs when selectedBase changes or component unmounts
        return () => {
            controller.abort(); // Removes ALL listeners attached with this signal
        };
    }, [selectedBase]);



    // Control zoom dynamically
    useEffect(() => {
        const orbitControls = threeRef.current.orbitControls;

        // Check if the controls actually exist yet
        if (orbitControls) {
            if (testMode && !isMaximized) {
                orbitControls.enableZoom = false;
            } else {
                orbitControls.enableZoom = true;
            }

            // Optional: Update controls if you changed properties
            orbitControls.update();
        }
    }, [testMode, isMaximized]);



    useEffect(() => {
        if (threeRef.current.directionalLight) {
            threeRef.current.directionalLight.intensity = lightIntensity;
        }
    }, [lightIntensity]);



    // UI Styles
    const containerWidth = isMaximized ? '80dvw' : '200px';
    const containerHeight = isMaximized ? '80dvh' : '200px';

    return (
        <div className={`flex flex-col rounded-xl shadow-md overflow-hidden bg-gray-100 relative transition-all duration-300`}
            style={{ width: containerWidth, height: containerHeight }}
        >

            <div
                className="absolute top-3 right-8"
            >
                <Slider
                    value={[lightIntensity]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setLightIntensity(value)}
                    className="w-40"
                />
                <p className="text-xs text-muted-foreground mt-2">
                    Light Intensity: {lightIntensity}
                </p>
            </div>

            {/* The invisible component that listens to the editor and clicks the select box */}
            <UpdateMugTexture textureRef={textureRef} />

            {/* Maximization Controls */}
            {isMaximized ? (
                <ZoomOut onClick={() => setIsMaximized(false)} className="absolute top-2 right-2 z-30 text-slate-400 cursor-pointer" size={15} />
            ) : (
                <ZoomIn onClick={() => setIsMaximized(true)} className="absolute top-2 right-2 z-30 text-slate-400 cursor-pointer" size={15} />
            )}

            {/* Menu Options (Using hidden in CSS instead of conditional rendering) */}
            <div className={testMode ? 'hidden' : ''}>
                <TextureOptions isMaximized={isMaximized} textureRef={textureRef} colorRef={colorRef} />

                <SelectBaseMesh isMaximized={isMaximized} textureRef={textureRef} colorRef={colorRef} />
            </div>

            {/* The 3D Canvas Container */}
            <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />
        </div>
    );
};

export default ThreeJSExample;