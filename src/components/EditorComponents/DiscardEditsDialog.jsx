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
import { useRouter } from "next/navigation";

export function DiscardEditsDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="cursor-pointer text-primary underline font-semibold">
                    Exit
                </button>
            </DialogTrigger>
            <DialogContent
                className="max-w-[360px] gap-0 rounded-2xl px-0 pt-6 pb-0 border-0 bg-white shadow-xl "
            >
                <DialogHeader className="px-6 pb-3">
                    <DialogTitle className="text-center text-lg font-semibold">
                        Discard edits?
                    </DialogTitle>

                    <DialogDescription className="mt-2 text-center text-sm text-muted-foreground">
                        If you go back now, you&apos;ll lose all of the edits you&apos;ve made.
                    </DialogDescription>
                </DialogHeader>



                {/* Red "Discard" row */}
                <button
                    onClick={() => {
                        setOpen(false)
                        router.push('/templates')
                    }}
                    className="cursor-pointer w-full py-3 px-6 text-center text-base font-semibold text-red-600  "
                >
                    Discard
                </button>

                {/* Save Draft row */}
                <button
                    onClick={() => {
                        setOpen(false)
                        router.push('/templates')
                    }}
                    className="cursor-pointer w-full border-t py-3 px-6 text-center text-base font-semibold">
                    Save Draft
                </button>

                {/* Keep Editing row */}
                <button className="cursor-pointer w-full border-t py-3 px-6 text-center text-base font-semibold"
                    onClick={() => setOpen(false)}
                >
                    Keep Editing
                </button>
            </DialogContent>
        </Dialog >
    );
}
