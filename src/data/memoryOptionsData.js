import { Image, Images, Layers, Sticker, Type } from "lucide-react";

const memoryOptionsData = [
    {
        icon: <Image />,
        label: 'Image',
        key: 'image',
    },
    {
        icon: <Type />,
        label: 'Text',
        key: 'text',
    },
    {
        icon: <Images />,
        label: 'BG',
        key: 'bg',
    },
    {
        icon: <Sticker />,
        label: 'Sticker',
        key: 'sticker',
    },
    {
        icon: <Layers />,
        label: 'Layers',
        key: 'layers',
    },
]


export default memoryOptionsData