import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


import verticalImg from '@/assets/layoutImages/verticalLayout.png';
import gridImg from '@/assets/layoutImages/gridLayout.png';

import gridJson from '@/demoTemplate/grid-layout-json.json';
import verticalJson from '@/demoTemplate/vertical-layout-json.json';
import { useEditorStore } from '@/store/useEditorStore';



const LayoutModal = () => {
    const [selected, setSelected] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const { setChosenBookPage } = useEditorStore()


    const layouts = [
        {
            id: 'vertical',
            title: 'Vertical Layout',
            image: verticalImg.src,
            description: 'Standard single-column memory list',
            json: verticalJson
        },
        {
            id: 'grid',
            title: 'Grid Layout',
            image: gridImg.src,
            description: '2x2 grid for compact memories',
            json: gridJson,
        }
    ];


    const handleApply = () => {
        if (selected) {
            console.log('selected', selected);
            setChosenBookPage(selected.json)
            setIsOpen(false);
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl sm:max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Choose Memory Book Layout
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Select how you want your memories to be organized on the page.
                    </DialogDescription>
                </DialogHeader>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 overflow-y-auto">
                    {layouts.map((layout) => (
                        <div
                            key={layout.id}
                            onClick={() => setSelected(layout)}
                            className={`relative group cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${selected?.id === layout.id
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-muted hover:border-muted-foreground/50'
                                }`}
                        >
                            {/* Header inside Card */}
                            <div className={`py-2 px-4 text-center text-xs font-bold uppercase tracking-wider transition-colors ${selected?.id === layout.id ? 'bg-primary text-primary text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                {layout.title}
                            </div>

                            {/* Image Preview */}
                            <div className="relative bg-slate-100">
                                <img
                                    src={layout.image}
                                    alt={layout.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Selection Overlay */}
                                {/* {selected === layout.id && (
                                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-primary bg-white rounded-full shadow-lg" />
                                    </div>
                                )} */}
                            </div>
                            {/* 
                            <div className="p-3 text-center">
                                <p className="text-sm text-muted-foreground">{layout.description}</p>
                            </div> */}
                        </div>
                    ))}
                </div>

                <DialogFooter className="sm:justify-end gap-2 border-t pt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!selected}
                        onClick={handleApply}
                        className="px-8"
                    >
                        Apply Layout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LayoutModal;