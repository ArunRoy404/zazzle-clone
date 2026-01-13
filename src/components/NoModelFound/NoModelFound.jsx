"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, SearchX, ArrowLeft } from 'lucide-react';

const NoProductFound = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">

                {/* Visual Element */}
                <div className="relative mb-8 flex justify-center">
                    {/* Decorative soft glow */}
                    <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                    <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-slate-100">
                        <SearchX size={56} className="text-indigo-600" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Product Not Found
                </h1>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => router.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                        <Home size={18} />
                        Home Page
                    </Link>
                </div>

               
            </div>
        </div>
    );
};

export default NoProductFound;