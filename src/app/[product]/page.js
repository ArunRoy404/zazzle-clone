'use client'

import EditorOptions from '@/components/EditorComponents/EditorOptions';
import BodyEditor from '../components/BodyEditor';
import TextOptionsHorizontal from '../components/TextOptions/TextOptionsHorizontal';
import RenderImage from '@/components/RenderImage/RenderImage';
import { modelList } from '@/data/modelList';
import useModelStore from '@/store/useModelStore';
import { useEffect } from 'react';
import RenderModel from '@/components/RenderModel/RenderModel';
import { useParams } from 'next/navigation';
import ViewImagesModal from '@/components/RenderImage/ViewImagesModal';
import EditorDrawer from '@/components/EditorComponents/EditorDrawer/EditorDrawer';



const ProductEditor = () => {
  const { chosenModel, setChosenModel } = useModelStore()
  const params = useParams();
  const { product } = params;


  const mugModelData = modelList.find((model) => model.name === product);
  useEffect(() => {
    if (mugModelData) setChosenModel(mugModelData)
  }, [mugModelData, setChosenModel])


  if (!chosenModel) return null;

  return (
    <div className='relative bg-gray-100 flex-1 flex items-center justify-center h-full'>
      <div className='fixed top-80 right-10 z-100'>
        <RenderModel />
      </div>

      <div className='hidden md:block fixed top-20 right-10 z-10'>
        <RenderImage modelData={mugModelData} />
      </div>

      <div className='hidden md:block absolute top-20'>
        <TextOptionsHorizontal />
      </div>

      <div className='hidden md:block absolute left-10'>
        <EditorOptions />
      </div>


      <div className='absolute bottom-4 right-4 md:hidden flex items-center gap-2'>
        <EditorDrawer />
        <ViewImagesModal />
      </div>



      <BodyEditor />
    </div>
  );
};

export default ProductEditor;