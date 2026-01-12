import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Type } from "lucide-react";
import TextOptionsHorizontal from "../TextOptions/TextOptionsHorizontal";



const TextOptionsDrawer = () => {
    return (
        <Drawer>
            <DrawerTrigger>
                <Type size={15} />
            </DrawerTrigger>


            <DrawerContent>
                <DrawerHeader style={{ display: "none" }}>
                    <DrawerTitle>Manage Text Format</DrawerTitle>
                </DrawerHeader>


                <div>
                    <TextOptionsHorizontal />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default TextOptionsDrawer;