import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/useEditorStore';
import * as fabric from 'fabric';
import { applyCommonStyles } from '@/services/CommonControlStyle';
import { addIdToObj } from '@/services/Editor';

const ImageContainerEditor = () => {
    const { editorRef } = useEditorStore();
    const [images, setImages] = useState([]);

    // Trigger file picker programmatically
    const handleUploadClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = handleImageAdd;
        input.click();
    };

    // Add image(s) to canvas and save to history
    const handleImageAdd = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        for (const file of files) {
            const reader = new FileReader();

            reader.onload = async () => {
                const img = await fabric.Image.fromURL(reader.result);


                img.scaleToWidth(600);

                // ✅ Random placement to avoid overlap
                img.set({
                    left: Math.random() * 200,
                    top: Math.random() * 300,
                });
                addIdToObj(img)
                applyCommonStyles(img);

                editorRef?.add(img);
                editorRef?.renderAll();

                // Save to history
                setImages(prev => [...prev, reader.result]);
            };

            reader.readAsDataURL(file);
        }

        e.target.value = "";
    };

    // Add image from history
    const handleAddFromHistory = async (src) => {
        const img = await fabric.Image.fromURL(src);
        img.scaleToWidth(600);
        img.set({
            left: Math.random() * 200,
            top: Math.random() * 300,
        });

        addIdToObj(img)
        applyCommonStyles(img);

        editorRef?.add(img);
        editorRef?.renderAll();
    };

    return (
        <div>
            <Button className="w-full mb-4" onClick={handleUploadClick}>
                Upload Files
            </Button>

            <p className="py-2 font-semibold">Image History</p>
            <div className="grid grid-cols-2 gap-2 max-h-70 overflow-y-auto md:max-h-auto">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`uploaded-${index}`}
                        className="w-full h-24 object-cover rounded border border-gray-300 cursor-pointer"
                        onClick={() => handleAddFromHistory(src)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageContainerEditor;