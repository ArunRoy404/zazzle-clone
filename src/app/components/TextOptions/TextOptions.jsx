import { DropdownMenuContent } from "../../ui/dropdown-menu";
import FontStyleSelection from "./FontStyleSelection";
import FontSizeSelection from "./FontSizeSelection";
import TextColorPicker from "./TextColorPicker";
import TextStyles from "./TextStyles";
import TextAlignment from "./TextAlignment";

const TextOptions = () => {
    return (
        <DropdownMenuContent
            side="left"
            align="start"
            className="space-y-2 rounded-2xl p-3 text-center"
        >
            <FontStyleSelection />
            <FontSizeSelection />
            <TextColorPicker />

            <div className="flex flex-col items-center gap-1 w-full">
                <TextStyles />
                <TextAlignment />
            </div>
        </DropdownMenuContent>
    );
};

export default TextOptions;