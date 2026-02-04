export const processImage = async (dataURL, productId, singleView = true) => {
    try {
        const response = await fetch(dataURL);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('file', blob, 'design.png');
        formData.append('product_id', productId);
        formData.append('singleView', singleView ? 'true' : 'false');

        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        const apiResponse = await fetch(`${baseUrl}/process`, {
            method: 'POST',
            headers: {
                "ngrok-skip-browser-warning": "69420",
            },
            body: formData,
        });

        if (!apiResponse.ok) {
            throw new Error(`API Error: ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        return data.results || [];
    } catch (error) {
        console.error("Error in processImage:", error);
        throw error;
    }
};
