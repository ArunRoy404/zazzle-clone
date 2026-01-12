import SelectBaseMesh from '@/components/selectBase/SelectBaseMesh';
import useBaseStore from '@/store/useBaseStore';
import React from 'react';

const BaseOptions = ({ colorRef, isMaximized }) => {
    const { selectedBase } = useBaseStore();
    
    return (
        <div className={`${isMaximized ? 'absolute' : 'hidden'} top-30 left-4 z-20 flex flex-col gap-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200`}>
            <SelectBaseMesh />


            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Color</label>
                <input disabled={!selectedBase} ref={colorRef} type="color" defaultValue="#ffffff" className="disabled:cursor-not-allowed disabled:opacity-50 h-8 w-12 cursor-pointer border-none bg-transparent" />
            </div>
        </div>
    );
};
export default BaseOptions; 