// src/components/SelectModel.jsx
import React, { useEffect } from 'react';
import useModelStore from '@/store/useModelStore';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { modelList } from '@/data/modelList';
import useTestModeStore from '@/store/useTestModeStore';
import useMeshStore from '@/store/useMeshStore';


export function SelectModel() {
    const { testMode } = useTestModeStore();
    const { chosenModel, setChosenModel } = useModelStore();
    const { meshes, setSelectedMesh } = useMeshStore();
    const finalModelList = testMode ? modelList.filter((model) => model.name === "Mug") : modelList;


    const handleValueChange = (path) => {
        const selected = modelList.find((model) => model.path === path);
        setChosenModel(selected);
        setSelectedMesh(null)
    };


    useEffect(() => {
        if (testMode && chosenModel?.name === "Mug") {
            setSelectedMesh([...meshes][2]);
        }
    }, [chosenModel, meshes, setSelectedMesh, testMode,])



    return (
        <div className="w-[250px] space-y-2">
            <label className="text-sm font-medium text-slate-500">Select a 3D Model</label>
            <Select
                onValueChange={handleValueChange}
                value={chosenModel?.path}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Choose a model..." />
                </SelectTrigger>
                <SelectContent className='z-200' align='start'>
                    {finalModelList.map((model) => (
                        <SelectItem key={model.path} value={model.path}>
                            {model.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {chosenModel && (
                <p className="text-xs text-muted-foreground mt-2">
                    Currently loading: <span className="font-mono">{chosenModel.path}</span>
                    <br />
                    Camera: (x: {chosenModel?.camera?.x}, y: {chosenModel?.camera?.y}, z: {chosenModel?.camera?.z})
                </p>
            )}
        </div>
    );
}