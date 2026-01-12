import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import useTestModeStore from "@/store/useTestModeStore";

const TestMode = () => {
    const { testMode, setTestMode } = useTestModeStore((state) => state);

    return (
        <div className="flex items-center space-x-2">
            <Switch id="test-mode" checked={testMode} onCheckedChange={setTestMode} />
            <Label htmlFor="test-mode">Test Mode</Label>
        </div>
    );
};

export default TestMode;