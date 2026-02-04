'use client'

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2 } from "lucide-react";
import useModelStore from '@/store/useModelStore';
import { useEditorStore } from '@/store/useEditorStore';
import { createDataURL } from '@/services/createDataURL';
import { processImage } from '@/services/apiRender';
import { cn } from '@/lib/utils';

const ViewImagesModalAPI = ({ triggerClassname }) => {
    const { chosenModel } = useModelStore()
    const { editorRef } = useEditorStore()
    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);
    const [capturedImages, setCapturedImages] = useState([]);
    const [isRendering, setIsRendering] = useState(false);

    const handleRenderAllImages = async () => {
        if (!editorRef || !chosenModel?.id) return;

        setIsRendering(true);
        try {
            const dataURL = createDataURL(editorRef);
            // singleView: false to get multiple angles/results from API
            const results = await processImage(dataURL, chosenModel.id, false);
            setCapturedImages(results);
        } catch (error) {
            console.error("Rendering failed", error);
        } finally {
            setIsRendering(false);
        }
    };

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const scrollTo = (index) => {
        api?.scrollTo(index);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"
                    onClick={handleRenderAllImages}
                    className={cn(
                        "flex gap-2 items-center w-full shadow-sm hover:shadow-md transition-all active:scale-95",
                        triggerClassname
                    )}
                >
                    <Eye size={16} />
                    <span>Preview</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] sm:max-w-[700px] bg-white p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-lg">Product Renders</DialogTitle>
                </DialogHeader>

                {isRendering ? (
                    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="text-sm text-slate-500 font-medium animate-pulse">Generating High Quality Renders...</p>
                    </div>
                ) : capturedImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                        <p>Click "Preview" to start rendering</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        {/* Main Carousel View */}
                        <div className="w-full max-w-[320px] sm:max-w-md relative mt-4">
                            <Carousel setApi={setApi} className="w-full">
                                <CarouselContent>
                                    {capturedImages?.map((url, index) => (
                                        <CarouselItem key={index}>
                                            <div className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
                                                <img
                                                    src={url}
                                                    alt={`Angle ${index + 1}`}
                                                    className="object-contain w-full h-full"
                                                />

                                                <div className="absolute bottom-0 w-full bg-black/70 backdrop-blur-sm p-2 sm:p-3 flex justify-between items-center text-white">
                                                    <span className="text-[10px] sm:text-sm font-medium uppercase tracking-wider">
                                                        View {index + 1}
                                                    </span>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download={`render-angle-${index + 1}.png`}
                                                        className="bg-white/20 hover:bg-white/40 p-1.5 sm:p-2 rounded-full transition-colors"
                                                    >
                                                        <Download size={14} className="sm:w-4.5 sm:h-4.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden sm:flex -left-12" />
                                <CarouselNext className="hidden sm:flex -right-12" />
                            </Carousel>
                        </div>

                        <div className="w-full space-y-3">
                            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                Select Angle
                            </p>

                            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 w-full max-w-lg mx-auto">
                                {capturedImages.map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={() => scrollTo(index)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 
                                        ${current === index
                                                ? 'border-blue-600 ring-2 ring-blue-100 scale-105 z-10'
                                                : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={url}
                                            alt={`Angle ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-muted-foreground text-[10px] sm:text-[11px]">
                            View {current + 1} of {capturedImages.length}
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ViewImagesModalAPI;
