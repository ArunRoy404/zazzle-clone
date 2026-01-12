// File: src/lib/fonts.js (New File)

import { toast } from "sonner"; // Assuming you use sonner for toasts

export const SYSTEM_FONTS = [
    "Arial",
    "Arial Black",
    "Verdana",
    "Helvetica",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script MT",
    "Palatino",
    "Bookman",
    "Comic Sans MS",
    "Impact",
    "Lucida Sans Unicode",
    "Geneva",
    "Lucida Console"
];

export const FONT_OPTIONS = SYSTEM_FONTS.map(font => ({
    value: font,
    label: font,
}));


export const showSelectionError = () => {
    toast.error("No Text selected", {
        description: (
            <span style={{ color: "black" }}>
                Please select a text on the canvas before changing the font.
            </span>
        ),
        duration: 3000,
    });
};