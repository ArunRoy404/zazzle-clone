export const createDataURL = (editorRef) => {
    const dataURL = editorRef.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
    });
    return dataURL
}