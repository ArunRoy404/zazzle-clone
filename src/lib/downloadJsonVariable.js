export const downloadJsonVariable = (jsonData, fileName = 'layout-data.json') => {
    // 1. Ensure the data is a string
    const dataString = typeof jsonData === 'string'
        ? jsonData
        : JSON.stringify(jsonData, null, 2);

    // 2. Create a Blob with the JSON content
    const blob = new Blob([dataString], { type: 'application/json' });

    // 3. Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // 4. Create a hidden anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // 5. Trigger the download
    document.body.appendChild(link);
    link.click();

    // 6. Cleanup: Remove the link and revoke the URL to save memory
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};