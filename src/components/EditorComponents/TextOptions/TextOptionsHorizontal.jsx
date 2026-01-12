import FontStyleSelection from "./FontStyleSelection";
import FontSizeSelection from "./FontSizeSelection";
import TextColorPicker from "./TextColorPicker";
import TextStyles from "./TextStyles";
import TextAlignment from "./TextAlignment";

const TextOptionsHorizontal = () => {
    return (
        <div
            className="flex flex-col md:flex-row gap-1 bg-white md:shadow-md mx-auto items-center max-w-max rounded-2xl p-3"
        >
            <div className="flex flex-row gap-2 md:items-center">
                <FontStyleSelection />
                <FontSizeSelection />
            </div>

            <div className="flex items-center gap-1">
                <TextColorPicker />
                <TextStyles className='flex flex-row items-center' />
                <TextAlignment className='flex flex-row items-center' />
            </div>
        </div>
    );
};

export default TextOptionsHorizontal;