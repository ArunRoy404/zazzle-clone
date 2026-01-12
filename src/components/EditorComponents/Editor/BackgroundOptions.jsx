import { useRef } from 'react';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/store/useEditorStore';
import { Upload, Trash2 } from 'lucide-react'; // Optional icons
import * as fabric from 'fabric';

const BackgroundOptions = () => {
    const { editorRef } = useEditorStore();
    const fileInputRef = useRef(null);

    const localTextures = [
        { id: 'm1', url: '/textures/model1_img0.jpg' },
        { id: 'm2', url: '/textures/model2_img0.jpg' },
        { id: 'm3', url: '/textures/model3_img0.jpg' },
        { id: 'm4', url: '/textures/model4_img0.jpg' },
    ];

    // Core logic to apply the image to the canvas
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

            // Instead of just editorRef.setBackgroundImage(img)
            editorRef.set('backgroundImage', img);
            editorRef.requestRenderAll();
            editorRef.fire('canvas:modified');
        } catch (error) {
            console.error("Error applying background:", error);
        }
    };


    // Handle Local File Upload
    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result;
            applyBackground(data);
        };
        reader.readAsDataURL(file);

        // Reset input so the same file can be uploaded again if deleted
        e.target.value = '';
    };

    return (
        <DropdownMenuContent side="left" align="start" className="p-0 w-80 bg-white shadow-xl border-none">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-sm text-gray-700">Background</h3>
                <button
                    onClick={() => {
                        // Instead of just editorRef.setBackgroundImage(img)
                        editorRef.set('backgroundImage', null);
                        editorRef.set('backgroundColor', 'white');
                        editorRef.requestRenderAll();
                        editorRef.fire('canvas:modified');
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove Background"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="p-3 space-y-4">
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

                {/* Preset Textures Section */}
                <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Presets</p>
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
        </DropdownMenuContent>
    );
};

export default BackgroundOptions;