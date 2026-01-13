import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import editorOptionsData from "@/data/editorOptionsData"

function EditorDrawerContainer() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Tabs defaultValue={editorOptionsData[0].key} className="w-full">
                {/* Dynamic Tab List */}
                <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                    {editorOptionsData.map((item) => (
                        <TabsTrigger
                            key={item.key}
                            value={item.key}
                            className="flex flex-col gap-1 py-2 text-xs"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Dynamic Tab Content */}
                {editorOptionsData.map((item) => (
                    <TabsContent key={item.key} value={item.key}>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground text-center">
                                    Edit your {item.label.toLowerCase()} settings here.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default EditorDrawerContainer