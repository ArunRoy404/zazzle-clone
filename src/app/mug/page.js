'use client'

import MemoryOptions from '@/components/EditorComponents/MemoryOptions';
import BodyEditor from '../components/BodyEditor';
import TextOptionsHorizontal from '../components/TextOptions/TextOptionsHorizontal';
import RenderImage from '@/components/RenderImage/RenderImage';
import TestMode from '@/components/TestMode/TestMode';
import ThreeJSExample from '@/components/ThreeJsExample/ThreeJSExample';
import { modelList } from '@/data/modelList';
import useModelStore from '@/store/useModelStore';
import { useEffect } from 'react';



const ThreeJsEditor = () => {
  const mugModelData = modelList.find((model) => model.name === 'Mug');
  const { chosenModel, setChosenModel } = useModelStore()

  useEffect(() => {
    setChosenModel(mugModelData)
  }, [mugModelData, setChosenModel])


  if (!chosenModel) return null;

  return (
    <div className='relative bg-gray-50 flex-1 flex items-center justify-center h-full'>
      <div className='fixed top-20 right-10 z-100'>
        <ThreeJSExample />
      </div>

      <div className='fixed bottom-18 left-10 z-100'>
        <TestMode />
      </div>

      <div className='fixed top-80 right-10 z-10'>
        <RenderImage modelData={mugModelData} />
      </div>

      <div className='absolute top-20'>
        <TextOptionsHorizontal />
      </div>

      <div className='absolute left-10'>
        <MemoryOptions />
      </div>
      <BodyEditor />
    </div>
  );
};

export default ThreeJsEditor;