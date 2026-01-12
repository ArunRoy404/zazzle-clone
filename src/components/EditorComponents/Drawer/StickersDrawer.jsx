import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Sticker } from "lucide-react";
import StickersContainer from "../StickersOptions/StickersContainer";



const StickersDrawer = () => {
    return (
        <Drawer>
            <DrawerTrigger>
                <Sticker size={15} />
            </DrawerTrigger>


            <DrawerContent>
                <DrawerHeader style={{ display: "none" }}>
                    <DrawerTitle>Manage Stickers</DrawerTitle>
                </DrawerHeader>


                <div
                    className="overflow-auto p-4"
                >
                    <StickersContainer />
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default StickersDrawer;