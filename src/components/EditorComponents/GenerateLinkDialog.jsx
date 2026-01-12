"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";




export function GenerateLinkDialog({ text, setIsError, className }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={() => {
            if (!text && !open) {
                setIsError(true)
                return
            }
            setIsError(false)
            setOpen(!open)
        }}>
            <DialogTrigger asChild>
                <Button
                    variant='link'
                    className={cn(
                        'p-0 text-xs underline hover:scale-100! active:scale-100! text-envelope-text',
                        className
                    )}
                >
                    Generate the link
                </Button>
            </DialogTrigger>



            <DialogContent
                className="w-[95vw] sm:max-w-[425px] md:max-w-[500px] gap-0 rounded-2xl px-0 pt-6 border-0 bg-white shadow-xl pb-3"
            >
                <DialogHeader className="px-6 pb-3">
                    <DialogTitle className="text-lg font-semibold text-icon">
                        <button
                            className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
                            onClick={() => toast.error("feature not implemented yet")}
                        >
                            <Link2 className="shrink-0" />
                            <span className="truncate">Copy link</span>
                        </button>
                    </DialogTitle>

                    <DialogDescription className="mt-2 text-sm text-icon leading-relaxed">
                        <span className="font-bold">Anyone with the link</span> <br />
                        <span className="block sm:inline">Anyone who has the link can access this card.</span>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    );
}
