import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { modelList } from "@/data/modelList";

const HomePage = () => {
    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
                Select a Product
            </h1>

            {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {modelList.map((model) => (
                    <Link key={model.name} href={`/${model.name}`}>
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-secondary/20 cursor-pointer">
                            <CardContent className="p-0">
                                {/* Thumbnail / Placeholder Section */}
                                <div className="aspect-square relative w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {model.thumbnail ? (
                                        <img
                                            src={model.thumbnail}
                                            alt={model.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <ImageIcon size={40} strokeWidth={1.5} />
                                            <span className="text-xs">No Preview</span>
                                        </div>
                                    )}
                                </div>

                                {/* Name Section */}
                                <div className="p-4 bg-white dark:bg-card">
                                    <h3 className="font-semibold text-lg truncate capitalize">
                                        {model.name}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;