'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import useThreeRefStore from "@/store/useThreeRefStore";
import useModelStore from "@/store/useModelStore";
import { useEditorStore } from "@/store/useEditorStore";
import { createDataURL } from "@/services/createDataURL";


const RenderModel = () => {
    const { editorRef } = useEditorStore();
    const { chosenModel } = useModelStore();
    const [modelLoaded, setModelLoaded] = useState(false);
    const { setThreeRef } = useThreeRefStore();
    const [dataURL, setDataURL] = useState(null);



    const threeRef = useRef({
        scene: new THREE.Scene(),
        camera: null,
        renderer: null,
        currentModel: null,
        material: null,
        frameId: null,
        isInitialized: false,
        directionalLight: null,
    });



    useEffect(() => {
        if (threeRef.current) setThreeRef(threeRef.current);
        return () => setThreeRef(null);
    }, [setThreeRef]);




    const init = useCallback(() => {
        if (threeRef.current.isInitialized) return;
        const { scene } = threeRef.current;

        // Camera
        const camera = new THREE.PerspectiveCamera(15, 200 / 200, 0.1, 1000);
        camera.position.set(0, 0, 80);
        threeRef.current.camera = camera;



        // 1. Ambient Light: Keep this low so shadows stay dark
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambient);

        // 2. The "Key Light": This is your main sun. It creates the shadows.
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
        keyLight.position.set(10, 20, 10); // High and to the side
        keyLight.castShadow = true; // Enable shadow casting
        scene.add(keyLight);

        // 3. The "Rim Light": Hits the back/side to make the model pop from the background
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.8); // Slight blue tint
        rimLight.position.set(-10, 10, -10);
        scene.add(rimLight);

        // 4. Fill Light: Soft light from the front so the face isn't pitch black
        const fillLight = new THREE.PointLight(0xffffff, 0.6);
        fillLight.position.set(-5, 0, 15);
        scene.add(fillLight);




        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true,
            preserveDrawingBuffer: true,
        });


        // Create a basic procedural environment (simulates a bright room)
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        // This tells Three.js to use the environment for reflections on all materials
        scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture;


        // Inside your renderer setup
        renderer.outputColorSpace = THREE.SRGBColorSpace; // Ensure this is set
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2; // Increase this slightly if the whole scene is too dark


        renderer.setClearColor(0xf0f7ff, 1); // Very light 'ice blue'
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(200, 200);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        // container.appendChild(renderer.domElement);
        threeRef.current.renderer = renderer;
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
                if (obj.isMesh) {
                    // If you want it to be very shiny/reflective:
                    if (obj.material) {
                        obj.material.roughness = 0.2; // Lower = shinier (0 to 1)
                        obj.material.metalness = 0.1; // Higher = more metallic

                        if (obj.name.includes(chosenModel.mesh)) {
                            threeRef.current.material = obj.material;
                        }
                    }
                }
            });

            if (chosenModel?.camera) {
                threeRef.current.camera.position.set(chosenModel.camera.x, chosenModel.camera.y, chosenModel.camera.z);
            }
            setModelLoaded(true);
        });
    }, [chosenModel]);





    useEffect(() => {
        if (typeof window === "undefined") return;


        if (!threeRef.current.isInitialized) {
            init();
        }

        return () => {
            cancelAnimationFrame(threeRef.current.frameId);

            if (threeRef.current.renderer) {
                threeRef.current.renderer.dispose();

                threeRef.current.renderer = null;
                threeRef.current.isInitialized = false;
            }
        };
    }, [init]);





    // 1. Sync Fabric.js Canvas to a DataURL state
    useEffect(() => {
        if (!editorRef || !editorRef?.backgroundColor) return;

        const updateDataURL = () => {
            const dataUrl = createDataURL(editorRef);
            setDataURL(dataUrl);
        };

        updateDataURL()

        const events = ['object:added', 'object:modified', 'object:removed', 'canvas:modified'];
        events.forEach(event => editorRef.on(event, updateDataURL));

        return () => {
            events.forEach(event => editorRef.off(event, updateDataURL));
        };
    }, [editorRef]);




    useEffect(() => {
        // Now this effect runs when dataURL changes OR when the model finishes loading
        if (!dataURL || !threeRef.current.material) return;

        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(dataURL, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = true;

            const material = threeRef.current.material;

            if (material.map) material.map.dispose();

            material.map = texture;

            // ENSURE COLOR IS NEUTRAL: 
            // This ensures the texture shows its true colors rather than being tinted white.
            material.color.set(0xffffff);

            material.needsUpdate = true;
        });

        // Adding modelLoaded here is the key fix
    }, [dataURL, threeRef, modelLoaded]);







    return null
};

export default RenderModel;