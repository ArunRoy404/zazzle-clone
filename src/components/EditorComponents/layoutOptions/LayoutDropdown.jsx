import { useState } from 'react';
import { SquarePen } from 'lucide-react';
import { DropdownMenuContent } from '../../ui/dropdown-menu';
import LayoutTick from './LayoutTick';
import { useEditorStore } from '@/store/useEditorStore';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { addText } from '@/services/Editor';


const clearCanvas = (editorRef) => {
    if (editorRef) {
        editorRef.clear();
        editorRef.renderAll();
    }
}


const LayoutDropdown = ({ setActiveTab, setOpen }) => {
    const { editorRef } = useEditorStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pendingLayout, setPendingLayout] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState(editorRef.layout);


    const confirmLayoutChange = (newLayout) => {
        if (!editorRef || !editorRef.backgroundColor) return;

        clearCanvas(editorRef);

        editorRef.setBackgroundColor('white');
        editorRef.setLayout(newLayout);
        editorRef.renderAll();
        setSelectedLayout(newLayout);


        if (newLayout === 'singleText') {
            addText({ position: 'center', ref: editorRef, text: 'Your Title Here' });
        } else if (newLayout === 'multiText') {
            addText({ position: 'top', ref: editorRef, text: 'Header Text' });
            addText({ position: 'center', ref: editorRef, text: 'Main Content' });
            addText({ position: 'bottom', ref: editorRef, text: 'Footer Info' });
        }
    };


    const handleLayoutChange = (newLayout) => {
        if (newLayout === selectedLayout) return;

        const hasContent = editorRef?.getObjects().length > 0;
        if (hasContent) {
            setPendingLayout(newLayout);
            setIsDialogOpen(true);
        } else {
            confirmLayoutChange(newLayout);
        }
    }


    return (
        <>
            {/* Main Dropdown Content */}
            <DropdownMenuContent side="left" align="start" className="w-64 p-4">
                <div className="space-y-3 relative">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Layout</h3>
                        <button
                            onClick={() => {
                                setActiveTab(null)
                                setOpen(false)
                            }}
                            className="text-muted-foreground hover:text-black"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Layout Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Blank Layout */}
                        <div
                            onClick={() => handleLayoutChange('blank')}
                            className="relative flex flex-col gap-1 items-center justify-center border rounded-lg p-2 cursor-pointer hover:border-primary group">
                            <SquarePen />
                            <p className="text-xs">Blank</p>
                            {/* Active Check */}
                            {selectedLayout === 'blank' && <LayoutTick />}
                        </div>


                        {/* Single Text Layout */}
                        <div
                            onClick={() => handleLayoutChange('singleText')}
                            className="relative cursor-pointer hover:border-primary aspect-3/4 border rounded-lg flex items-center justify-center text-sm font-semibold">
                            <p>T</p>
                            {/* Active Check */}
                            {selectedLayout === 'singleText' && <LayoutTick />}
                        </div>


                        {/* Multi Text Layout */}
                        <div
                            onClick={() => handleLayoutChange('multiText')}
                            className="relative cursor-pointer hover:border-primary aspect-3/4 border gap-3 rounded-lg grid grid-cols-1 p-2">
                            <div className="w-full border rounded-md text-xs flex items-center justify-center">T</div>
                            <div className="w-full border rounded-md text-xs flex items-center justify-center">T</div>
                            <div className="w-full border rounded-md text-xs flex items-center justify-center">T</div>
                            {/* Active Check */}
                            {selectedLayout === 'multiText' && <LayoutTick />}
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>


            {/* 6. Confirmation Dialog */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className='max-w-max!'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Selecting a new layout will **remove all existing content** (text, images, shapes) <br /> from your current design. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex items-center'>
                        <AlertDialogCancel className={'flex-1'}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className='flex-1'
                            onClick={() => {
                                // Execute the layout change upon confirmation
                                if (pendingLayout) {
                                    confirmLayoutChange(pendingLayout);
                                    setPendingLayout(null); // Clear pending state
                                }
                            }}
                        >
                            Continue and Clear Content
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default LayoutDropdown;