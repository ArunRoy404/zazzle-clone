import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus } from "lucide-react";
import EditorDrawerContainer from "./EditorDrawerContainer";


const EditorDrawer = () => {
    return (
        <Drawer>
            <DrawerTrigger >
                <Button variant="outline">
                    <Plus size={16} />
                </Button>
            </DrawerTrigger>
            <DrawerContent>

                <DrawerFooter>
                    <EditorDrawerContainer />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default EditorDrawer;