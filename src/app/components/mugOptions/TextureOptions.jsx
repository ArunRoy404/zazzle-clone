import useMeshStore from '@/store/useMeshStore';


const TextureOptions = ({ textureRef, isMaximized }) => {
    const { selectedMesh } = useMeshStore();

    return (
        <div className={`${isMaximized ? 'absolute' : 'hidden'} top-4 left-4 z-20 flex gap-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200`}>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Texture</label>
                <select disabled={!selectedMesh} ref={textureRef} className="disabled:cursor-not-allowed disabled:opacity-50 border border-slate-300 rounded-md px-2 py-1 text-sm bg-white outline-none">
                    <option value="" hidden>Custom Design</option>
                    <option value="/textures/tofayel_bro.jpg">Tofayel Bro</option>
                    <option value="/textures/model2_img0.jpg">Design 2</option>
                    <option value="/textures/model3_img0.jpg">Design 3</option>
                    <option value="/textures/model4_img0.jpg">Design 4</option>
                </select>
            </div>
        </div>
    );
};

export default TextureOptions;