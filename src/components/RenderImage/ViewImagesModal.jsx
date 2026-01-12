import React from 'react';
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

const ViewImagesModal = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                    <Eye size={16} />
                    View All Renders ({images.length})
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center">Product Renders</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-4">
                    <Carousel className="w-full max-w-sm">
                        <CarouselContent>
                            {images.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <div className="relative flex flex-col items-center justify-center aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="object-contain w-full h-full"
                                            />

                                            {/* Overlay Info */}
                                            <div className="absolute bottom-0 w-full bg-black/60 p-3 flex justify-between items-center text-white">
                                                <span className="text-sm font-medium">{img.name}</span>
                                                <a
                                                    href={img.url}
                                                    download={`render-${img.name}.png`}
                                                    className="hover:text-blue-400 transition-colors"
                                                >
                                                    <Download size={18} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    <p className="text-muted-foreground text-[12px] mt-6">
                        Showing {images.length} angles of the current model
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewImagesModal;