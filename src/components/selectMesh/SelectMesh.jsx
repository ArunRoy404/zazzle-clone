import useMeshStore from '@/store/useMeshStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useModelStore from '@/store/useModelStore';

export function SelectMesh() {
    const { meshes, selectedMesh, setSelectedMesh } = useMeshStore();
    const { chosenModel } = useModelStore()

    const handleSelectMesh = (name) => {
        const selected = meshes.find((mesh) => mesh.name === name);
        setSelectedMesh(selected);
    }

    return (
        <div className="w-[250px] space-y-2">
            <label className="text-sm font-medium text-slate-500">Select Mesh for Editor</label>
            <Select
                disabled={!chosenModel}
                onValueChange={handleSelectMesh}
                value={selectedMesh?.name ?? ""}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Choose a part..." />
                </SelectTrigger>
                <SelectContent>
                    {meshes.map((mesh) => (
                        <SelectItem key={mesh.name} value={mesh.name}>
                            {mesh.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            {
                !!selectedMesh && (
                    <div className="text-xs text-muted-foreground mt-2">
                        <p>width: {selectedMesh?.dimensions?.width}</p>
                        <p>height: {selectedMesh?.dimensions?.height}</p>
                        <p>depth: {selectedMesh?.dimensions?.depth}</p>
                    </div>
                )
            }
        </div>
    );
}