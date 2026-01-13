import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import editorOptionsData from "@/data/editorOptionsData"
import ImageContainerEditor from "../Editor/ImageContainerEditor"
import EditorTextInsert from "../Editor/EditorTextInsert"

function EditorDrawerContainer() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Tabs defaultValue="image" className="w-full">
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

                {/* Individual Content Blocks (No Loop) */}
                <TabsContent value="image">
                    <ImageContainerEditor />
                </TabsContent>

                <TabsContent value="text">
                    <EditorTextInsert isMobile={true} />
                </TabsContent>

                <TabsContent value="bg">
                    <Card><CardContent className="pt-6 text-center text-sm">BG Settings</CardContent></Card>
                </TabsContent>

                <TabsContent value="sticker">
                    <Card><CardContent className="pt-6 text-center text-sm">Stickers Library</CardContent></Card>
                </TabsContent>

                <TabsContent value="layers">
                    <Card><CardContent className="pt-6 text-center text-sm">Layers Panel</CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EditorDrawerContainer