'use client'

import MemoryOptions from '@/components/EditorComponents/MemoryOptions';
import BodyEditor from './components/BodyEditor';
import TextOptionsHorizontal from './components/TextOptions/TextOptionsHorizontal';
import { SelectModel } from '@/components/selectModel/SelectModel';
import { SelectMesh } from '@/components/selectMesh/SelectMesh';
import RenderImage from '@/components/RenderImage/RenderImage';
import TestMode from '@/components/TestMode/TestMode';
import useTestModeStore from '@/store/useTestModeStore';
import ThreeJSExample from '@/components/ThreeJsExample/ThreeJSExample';



const ThreeJsEditor = () => {
  const { testMode } = useTestModeStore();
  return (
    <div className='relative bg-gray-50 flex-1 flex items-center justify-center h-full'>
      <div className='fixed top-20 right-10 z-100'>
        {/* <PreviewModal /> */}
        <ThreeJSExample />
      </div>

      <div className='fixed bottom-18 left-10 z-100'>
        <TestMode />
      </div>

      <div className='fixed top-80 right-10 z-10'>
        <RenderImage />
      </div>

      <div className='absolute top-20'>
        <TextOptionsHorizontal />
      </div>

      <div className='absolute left-10 top-10'>
        <SelectModel />
      </div>

      {
        !testMode && (
          <div className='absolute left-10 top-40'>
            <SelectMesh />
          </div>
        )
      }

      <div className='absolute left-10'>
        <MemoryOptions />
      </div>
      <BodyEditor />
    </div>
  );
};

export default ThreeJsEditor;