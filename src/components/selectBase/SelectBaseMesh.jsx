import useMeshStore from '@/store/useMeshStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useModelStore from '@/store/useModelStore';
import useBaseStore from '@/store/useBaseStore';

export function SelectBaseMesh() {
    const { meshes } = useMeshStore();
    const { selectedBase, setSelectedBase } = useBaseStore()
    const { chosenModel } = useModelStore()

    
    const handleSelectMesh = (name) => {
        const selected = meshes.find((mesh) => mesh.name === name);
        setSelectedBase(selected);
    }

    return (
        <div className="w-[250px] space-y-2">
            <label className="text-sm font-medium text-slate-500">Select Mesh as Base</label>
            <Select disabled={!chosenModel} onValueChange={handleSelectMesh} value={selectedBase?.name}>
                <SelectTrigger>
                    <SelectValue placeholder="Choose a part..." />
                </SelectTrigger>
                <SelectContent className='z-200' align='start'>
                    {meshes.map((mesh) => (
                        <SelectItem key={mesh.name} value={mesh.name}>
                            {mesh.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            {
                !!selectedBase && (
                    <div className="text-xs text-muted-foreground mt-2">
                        <p>selected: {selectedBase?.name}</p>
                    </div>
                )
            }
        </div>
    );
}
export default SelectBaseMesh;