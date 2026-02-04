'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { modelList } from "@/data/modelList";
import useModelStore from "@/store/useModelStore";

const HomePage = () => {
    const { setChosenModel } = useModelStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
                const response = await fetch(`${baseUrl}/products`, {
                    headers: {
                        "ngrok-skip-browser-warning": "69420",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Fetched Products:", data);
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-destructive">
                <AlertCircle className="w-12 h-12" />
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="text-sm opacity-80">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Use fetched products if available, otherwise fallback to local modelList
    const displayList = products.length > 0 ? products : modelList;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
                Select a Product
            </h1>

            {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayList.map((model) => (
                    <Link key={model.id} href={`/${model.id}`}>
                    {/* <Link key={model.id} onClick={() => setChosenModel(model)} href={`/${model.name}`}> */}
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-secondary/20 cursor-pointer">
                            <CardContent className="p-0">
                                {/* Thumbnail / Placeholder Section */}
                                <div className="aspect-square relative w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {model.thumbnail ? (
                                        <img
                                            src={model.thumbnail.startsWith('http') ? model.thumbnail : `${process.env.NEXT_PUBLIC_BASE_API_URL}${model.thumbnail}`}
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