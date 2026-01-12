'use client'

import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import cardOptionsData from "@/data/cardOptionsData"

import LayoutDropdown from "./layoutOptions/LayoutDropdown"
import TextOptions from "./TextOptions/TextOptions"
import { Plus } from "lucide-react"
import StickersOptions from "./StickersOptions/StickersOptions"
import { useEditorStore } from "@/store/useEditorStore"
import ImageOptions from "./Editor/ImageOptions"

const CardOptions = () => {
    const { addPage } = useEditorStore();
    const [activeTab, setActiveTab] = useState(null)
    const [open, setOpen] = useState(false)

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
        <DropdownMenu open={open} modal={false}>
            <DropdownMenuTrigger asChild>
                <div className='flex flex-col gap-3 bg-white text-center p-3 rounded-2xl max-h-max'>
                    {cardOptionsData?.map((item) => (
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

                    <button
                        onClick={() => addPage()}
                        className={`cursor-pointer flex border rounded-xl flex-col items-center justify-center px-4 py-2 font-semibold`}
                    >
                        <Plus />
                        <p>Add Page</p>
                    </button>
                </div>
            </DropdownMenuTrigger>



            {open && !!activeTab && (
                <>
                    {/* ✅ Layout Content */}
                    {activeTab === 'layout' && <LayoutDropdown setActiveTab={setActiveTab} setOpen={setOpen} />}

                    {/* ✅ Text Content */}
                    {activeTab === 'text' && <TextOptions />}

                    {/* ✅ Image Content */}
                    {activeTab === 'image' && <ImageOptions />}

                    {/* ✅ Sticker Content */}
                    {activeTab === 'sticker' && <StickersOptions setActiveTab={setActiveTab} setOpen={setOpen} />}
                </>
            )}
        </DropdownMenu>
    )
}

export default CardOptions
