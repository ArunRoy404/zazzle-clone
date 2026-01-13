import { useRef, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Upload, Trash2, Pipette } from 'lucide-react';
import * as fabric from 'fabric';


const BackgroundOptionsContainer = () => {
    const { editorRef } = useEditorStore();
    const fileInputRef = useRef(null);
    const colorPickerRef = useRef(null);
    const [currentColor, setCurrentColor] = useState('#ffffff');


    const localTextures = [
        { id: 'm1', url: '/textures/model1_img0.jpg' },
        { id: 'm2', url: '/textures/model2_img0.jpg' },
        { id: 'm3', url: '/textures/model3_img0.jpg' },
        { id: 'm4', url: '/textures/model4_img0.jpg' },
    ];


    // Updated colors based on your image
    const palette = [
        { name: 'White', value: '#ffffff' },
        { name: 'Gray', value: '#9ca3af' },
        { name: 'Black', value: '#000000' },
        { name: 'Light Blue', value: '#93e0f9' },
        { name: 'Bright Blue', value: '#00aeef' },
        { name: 'Purple', value: '#662d91' },
        { name: 'Pink', value: '#f5b0cf' },
        { name: 'Magenta', value: '#ec008c' },
        { name: 'Red', value: '#ed1c24' },
        { name: 'Orange', value: '#f7941d' },
        { name: 'Brown', value: '#754c24' },
        { name: 'Yellow', value: '#ffcb05' },
    ];

    const applySolidColor = (color) => {
        if (!editorRef) return;
        setCurrentColor(color);
        editorRef.set('backgroundImage', null);
        editorRef.set('backgroundColor', color);
        editorRef.requestRenderAll();
        editorRef.fire('canvas:modified');
    };

    const applyBackground = async (imageUrl) => {
        if (!editorRef) return;
        try {
            const img = await fabric.FabricImage.fromURL(imageUrl);
            const baseWidth = 2700;
            const baseHeight = 1100;
            const scale = Math.max(baseWidth / img.width, baseHeight / img.height);
            img.set({
                scaleX: scale,
                scaleY: scale,
                left: baseWidth / 2,
                top: baseHeight / 2,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
            });
            editorRef.set('backgroundImage', img);
            editorRef.requestRenderAll();
            editorRef.fire('canvas:modified');
        } catch (error) {
            console.error("Error applying background:", error);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result;
            applyBackground(data);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    return (
        <div className='h-70 md:h-full overflow-y-auto'>
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-sm text-gray-700">Background</h3>
                <button
                    onClick={() => {
                        editorRef.set('backgroundImage', null);
                        editorRef.set('backgroundColor', 'white');
                        editorRef.requestRenderAll();
                        editorRef.fire('canvas:modified');
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="p-3 space-y-4">
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Solid Colors</p>

                    {/* Grid layout to match your image style */}
                    <div className="grid grid-cols-6 gap-y-3 gap-x-2 px-1 items-center">
                        {palette.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => applySolidColor(color.value)}
                                className="w-8 h-8 rounded-full border border-gray-100 hover:scale-110 transition-transform shadow-sm"
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}

                        {/* Custom Color Picker as the 13th circle */}
                        <div className="relative">
                            <button
                                onClick={() => colorPickerRef.current?.click()}
                                className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform shadow-sm flex items-center justify-center bg-gray-50 text-gray-500"
                                style={{ borderColor: currentColor }}
                            >
                                <Pipette size={14} />
                            </button>
                            <input
                                type="color"
                                ref={colorPickerRef}
                                className="absolute opacity-0 pointer-events-none"
                                value={currentColor}
                                onChange={(e) => applySolidColor(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg py-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                >
                    <Upload className="text-gray-400 mb-1" size={20} />
                    <span className="text-[11px] font-medium text-gray-600">Upload Custom Image</span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                {/* Textures Section */}
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Textures</p>
                    <div className="grid grid-cols-2 gap-2">
                        {localTextures.map((texture) => (
                            <button
                                key={texture.id}
                                onClick={() => applyBackground(texture.url)}
                                className="group relative aspect-video rounded-md overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all bg-gray-100"
                            >
                                <img
                                    src={texture.url}
                                    alt="texture"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundOptionsContainer;