import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Image as ImageIcon } from "lucide-react";
import ImageContainerEditor from "../Editor/ImageContainerEditor";



const ImageDrawer = () => {
    return (
        <Drawer>
            <DrawerTrigger>
                <ImageIcon size={15} />
            </DrawerTrigger>


            <DrawerContent>
                <DrawerHeader style={{ display: "none" }}>
                    <DrawerTitle>Manage Stickers</DrawerTitle>
                </DrawerHeader>


                <div
                    className="overflow-auto p-4"
                >
                    <ImageContainerEditor />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ImageDrawer;