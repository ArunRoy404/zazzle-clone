import { Check } from 'lucide-react';


const LayoutTick = () => {
    return (
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
            <Check />
        </div>
    );
};

export default LayoutTick;