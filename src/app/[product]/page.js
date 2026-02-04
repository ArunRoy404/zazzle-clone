'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import EditorOptions from '@/components/EditorComponents/EditorOptions';
import BodyEditor from '../components/BodyEditor';
import TextOptionsHorizontal from '../components/TextOptions/TextOptionsHorizontal';
import RenderImageAPI from '@/components/RenderImage/RenderImageAPI';
import useModelStore from '@/store/useModelStore';
import ViewImagesModalAPI from '@/components/RenderImage/ViewImagesModalAPI';
import EditorDrawer from '@/components/EditorComponents/EditorDrawer/EditorDrawer';
import { Loader2, AlertCircle } from "lucide-react";
// import RenderProduct from '@/components/RenderProduct/RenderProduct';

const ProductEditor = () => {
  const { setChosenModel } = useModelStore();
  const params = useParams();
  const productId = params?.product;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        const response = await fetch(`${baseUrl}/products/${productId}`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        const data = await response.json();
        setProduct(data);
        setChosenModel(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProducts();
    }
  }, [productId, setChosenModel]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-gray-600 font-medium">Loading Product Editor...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <p className="text-gray-500">{error || "The requested product could not be loaded."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render actual Editor
  return (
    <div className='relative bg-gray-100 flex-1 flex items-center justify-center h-full'>
      {/* 3D Model View (Currently Disabled) */}
      <div className='fixed top-80 right-20 z-100'>
        {/* <RenderModel /> */}
      </div>

      {/* API-based Live Preview Sidebar */}
      <div className='hidden xl:block fixed top-20 right-10 z-10'>
        <RenderImageAPI />
      </div>

      <div className='absolute bottom-20'>
        <TextOptionsHorizontal />
      </div>

      <div className='hidden xl:block absolute left-10'>
        <EditorOptions />
      </div>

      <div className='absolute bottom-4 right-4 xl:hidden flex items-center gap-2'>
        <EditorDrawer />
        <ViewImagesModalAPI triggerClassname="max-w-max" />
      </div>

      <BodyEditor />
    </div>
  );
};

export default ProductEditor;
