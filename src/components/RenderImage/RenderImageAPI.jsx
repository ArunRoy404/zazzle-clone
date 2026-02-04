'use client'

import { useEffect, useState } from 'react';
import useModelStore from '@/store/useModelStore';
import { useEditorStore } from '@/store/useEditorStore';
import { createDataURL } from '@/services/createDataURL';
import { processImage } from '@/services/apiRender';
import { Loader2 } from 'lucide-react';
import ViewImagesModalAPI from './ViewImagesModalAPI';

const RenderImageAPI = () => {
    const { chosenModel } = useModelStore();
    const { editorRef } = useEditorStore();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isRendering, setIsRendering] = useState(false);

    useEffect(() => {
        if (!editorRef || !chosenModel?.id) return;

        let debounceTimer;

        const updatePreview = async () => {
            if (debounceTimer) clearTimeout(debounceTimer);

            debounceTimer = setTimeout(async () => {
                try {
                    setIsRendering(true);
                    const dataURL = createDataURL(editorRef);
                    const results = await processImage(dataURL, chosenModel.id, true);
                    if (results && results.length > 0) {
                        setPreviewUrl(results[0]);
                    }
                } catch (error) {
                    console.error("Failed to render preview:", error);
                } finally {
                    setIsRendering(false);
                }
            }, 1000);
        };

        updatePreview();

        const events = ['object:added', 'object:modified', 'object:removed', 'canvas:modified'];
        events.forEach(event => editorRef.on(event, updatePreview));

        return () => {
            if (debounceTimer) clearTimeout(debounceTimer);
            events.forEach(event => editorRef.off(event, updatePreview));
        };
    }, [editorRef, chosenModel?.id]);

    return (
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-md bg-white w-fit border border-slate-100">
            <div className="relative group w-40 h-40 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Product Preview"
                        className={`w-full h-full object-contain transition-opacity duration-300 ${isRendering ? 'opacity-50' : 'opacity-100'}`}
                    />
                ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="text-[10px]">Initializing...</span>
                    </div>
                )}

                {isRendering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                )}

                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white px-2 py-0.5 text-center">
                    {isRendering ? 'Processing...' : 'Live Preview'}
                </span>
            </div>

            <div>
                <ViewImagesModalAPI />
            </div>
        </div>
    );
};

export default RenderImageAPI;
