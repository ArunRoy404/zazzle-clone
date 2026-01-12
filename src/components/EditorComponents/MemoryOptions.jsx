'use client'



import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StickersOptions from "./StickersOptions/StickersOptions"
import memoryOptionsData from "@/data/memoryOptionsData"
import MemoryTextInsert from "./Editor/MemoryTextInsert"
import ImageOptions from "./Editor/ImageOptions"
import useMeshStore from "@/store/useMeshStore"
import LayersOptions from "./Editor/LayersOptions"
import BackgroundOptions from "./Editor/BackgroundOptions"

const MemoryOptions = () => {
    const [activeTab, setActiveTab] = useState(null)
    const [open, setOpen] = useState(false)
    const { selectedMesh } = useMeshStore();
    const isDisabled = !!selectedMesh ? false : true;

    const handleClick = (key) => {
        if (activeTab === key) {
            setActiveTab(null)
            setOpen(false)
        }
        else {
            setActiveTab(key)
            setOpen(true)
        }
    }

    return (
        <DropdownMenu disabled open={isDisabled ? false : open} modal={false}>
            <DropdownMenuTrigger asChild>
                <div className={`${isDisabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''} flex flex-col gap-3 bg-white text-center p-3 rounded-2xl max-h-max`}>
                    {memoryOptionsData?.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => handleClick(item.key)}
                            className={`cursor-pointer flex border rounded-xl flex-col items-center justify-center px-4 py-2 font-semibold
                            ${activeTab === item.key ? 'border-primary text-primary' : ''}`}
                        >
                            {item.icon}
                            <p>{item.label}</p>
                        </button>
                    ))}
                </div>
            </DropdownMenuTrigger>


            {open && !!activeTab && (
                <>
                    {/* ✅ Image Content */}
                    {activeTab === 'image' && <ImageOptions />}

                    {/* ✅ Text Content */}
                    {activeTab === 'text' && <MemoryTextInsert />}

                    {/* ✅ Text Content */}
                    {activeTab === 'bg' && <BackgroundOptions />}

                    {/* ✅ Sticker Content */}
                    {activeTab === 'sticker' && <StickersOptions setActiveTab={setActiveTab} setOpen={setOpen} />}

                    {/* ✅ Layers Content */}
                    {activeTab === 'layers' && <LayersOptions setActiveTab={setActiveTab} setOpen={setOpen} />}
                </>
            )}
        </DropdownMenu>
    )
}

export default MemoryOptions;