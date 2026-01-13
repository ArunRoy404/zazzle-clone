'use client'

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // Ensure you have run 'npx shadcn-ui@latest add dialog'
import RenderModel from '@/components/ThreeJsExample/RenderModel';


const PreviewModal = () => {
    return (
        <Dialog>
            {/* 1. The Trigger Button */}
            <DialogTrigger asChild>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Open 3D Preview
                </button>
            </DialogTrigger>

            {/* 2. The Content - Sized to 90% of Viewport */}
            <DialogContent className="max-w-[90dvw]! max-h-[90vh]! p-0 overflow-hidden flex flex-col">

                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>3D Mug Preview Customizer</DialogTitle>
                </DialogHeader>

                {/* 3. The Body - We put the Three.js component here */}
                <div className="flex-grow relative bg-slate-50">
                    <renderModel />
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default PreviewModal;