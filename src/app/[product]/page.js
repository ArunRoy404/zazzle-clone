'use client'

import { useState, useEffect } from 'react'; // Added useState
import { useParams } from 'next/navigation';
import EditorOptions from '@/components/EditorComponents/EditorOptions';
import BodyEditor from '../components/BodyEditor';
import TextOptionsHorizontal from '../components/TextOptions/TextOptionsHorizontal';
import RenderImage from '@/components/RenderImage/RenderImage';
import { modelList } from '@/data/modelList';
import useModelStore from '@/store/useModelStore';
import RenderModel from '@/components/RenderModel/RenderModel';
import ViewImagesModal from '@/components/RenderImage/ViewImagesModal';
import EditorDrawer from '@/components/EditorComponents/EditorDrawer/EditorDrawer';
import NoModelFound from '@/components/NoModelFound/NoModelFound';

const ProductEditor = () => {
  const { chosenModel, setChosenModel } = useModelStore();
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state
  const params = useParams();
  const product = params?.product;

  const mugModelData = modelList.find(
    (model) => model.name.toLocaleLowerCase() === product?.toString().toLocaleLowerCase()
  );

  useEffect(() => {
    if (mugModelData) {
      setChosenModel(mugModelData);
    }
    // Set loading to false after the search/assignment logic finishes
    setIsLoading(false);
  }, [mugModelData, setChosenModel]);

  // 1. Show a spinner or skeleton while checking for the model
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading Editor...</p>
      </div>
    );
  }

  // 2. If loading is done and still no model, show Error state
  if (!chosenModel) return <NoModelFound />;

  // 3. Render actual Editor
  return (
    <div className='relative bg-gray-100 flex-1 flex items-center justify-center h-full'>
      <div className='fixed top-80 right-20 z-100'>
        <RenderModel />
      </div>

      <div className='hidden xl:block fixed top-20 right-10 z-10'>
        <RenderImage modelData={mugModelData} />
      </div>

      <div className='absolute bottom-20'>
        <TextOptionsHorizontal />
      </div>

      <div className='hidden xl:block absolute left-10'>
        <EditorOptions />
      </div>

      <div className='absolute bottom-4 right-4 xl:hidden flex items-center gap-2'>
        <EditorDrawer />
        <ViewImagesModal triggerClassname="max-w-max" />
      </div>

      <BodyEditor />
    </div>
  );
};

export default ProductEditor;