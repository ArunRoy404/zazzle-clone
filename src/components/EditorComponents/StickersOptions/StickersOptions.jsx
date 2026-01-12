import React from 'react';
import { DropdownMenuContent } from '../../ui/dropdown-menu';
import StickersContainer from './StickersContainer';


const stickersOptions = ({ setActiveTab, setOpen }) => {
    return (
        <DropdownMenuContent side="left" align="start" className="w-80 p-4">
            <div className="space-y-3 relative">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">stickers</h3>
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

                {/* stickers container  */}
                <StickersContainer />
            </div>
        </DropdownMenuContent>
    );
};

export default stickersOptions;