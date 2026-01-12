import { cn } from "@/lib/utils";

const CanvasFakeDecoration = ({ className }) => {
    return (
        <div className={cn(
            "w-[95%] h-[90%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-dashed border-2 border-gray-500",
            className
        )}>
            {
                [...new Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="absolute h-[80%] top-[50%] translate-y-[-50%] border-l-2 border-dashed border-gray-500"
                        style={{
                            left: `${(index + 1) * 16.6}%`
                        }}
                    />
                ))
            }
        </div>
    );
};

export default CanvasFakeDecoration;