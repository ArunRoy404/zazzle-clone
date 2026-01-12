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
import { Download, Eye } from "lucide-react";

const ViewImagesModal = ({ images, handleRenderAllImages }) => {
    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);

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
                <Button variant="outline" onClick={handleRenderAllImages} className="flex gap-2 items-center w-full">
                    <Eye size={16} />
                    <span>Preview</span>
                </Button>
            </DialogTrigger>

            {/* Added max-h-screen and overflow-y-auto for small phones */}
            <DialogContent className="w-[95vw] sm:max-w-[700px] bg-white p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center font-bold text-lg">Product Renders</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center space-y-6">

                    {/* Main Carousel View */}
                    <div className="w-full max-w-[320px] sm:max-w-md relative mt-4">
                        <Carousel setApi={setApi} className="w-full">
                            <CarouselContent>
                                {images.map((img, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="object-contain w-full h-full"
                                            />

                                            {/* Bottom Info Bar - Responsive Text */}
                                            <div className="absolute bottom-0 w-full bg-black/70 backdrop-blur-sm p-2 sm:p-3 flex justify-between items-center text-white">
                                                <span className="text-[10px] sm:text-sm font-medium uppercase tracking-wider">
                                                    {img.name}
                                                </span>
                                                <a
                                                    href={img.url}
                                                    download={`render-${img.name}.png`}
                                                    className="bg-white/20 hover:bg-white/40 p-1.5 sm:p-2 rounded-full transition-colors"
                                                >
                                                    <Download size={14} className="sm:w-[18px] sm:h-[18px]" />
                                                </a>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Hidden on mobile to save space, or use smaller variants */}
                            <CarouselPrevious className="hidden sm:flex -left-12" />
                            <CarouselNext className="hidden sm:flex -right-12" />
                        </Carousel>

                        {/* Mobile-only swipe indicator */}
                        <div className="flex sm:hidden justify-center mt-2 text-[10px] text-slate-400">
                            Swipe to rotate
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                            Select Angle
                        </p>

                        {/* Thumbnail Grid: 4 columns on mobile, 8 on tablet+ */}
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 w-full max-w-lg mx-auto">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollTo(index)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 
                                        ${current === index
                                            ? 'border-blue-600 ring-2 ring-blue-100 scale-105 z-10'
                                            : 'border-slate-200 opacity-60'}`}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.name}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-muted-foreground text-[10px] sm:text-[11px]">
                        Angle {current + 1} of {images.length}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewImagesModal;