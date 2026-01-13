import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import BackgroundOptionsContainer from './BackgroundOptionsContainer';



const BackgroundOptions = () => {
    return (
        <DropdownMenuContent side="left" align="start" className="p-0 w-80 bg-white shadow-xl border-none">
            <BackgroundOptionsContainer />
        </DropdownMenuContent>
    );
};

export default BackgroundOptions;