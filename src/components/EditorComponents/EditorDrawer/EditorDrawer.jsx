import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus } from "lucide-react";
import EditorDrawerContainer from "./EditorDrawerContainer";


const EditorDrawer = () => {
    return (
        <Drawer>
            <DrawerTrigger >
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 cursor-pointer shadow-sm">
                    <Plus size={16} />
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerTitle></DrawerTitle>
                <DrawerFooter>
                    <EditorDrawerContainer />
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    );
};

export default EditorDrawer;