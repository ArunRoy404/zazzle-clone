function rgbaArrayToHexWithAlpha(rgba) {
    const [r, g, b, a] = rgba;
    const toHex = (x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    const alphaHex = toHex(a * 255); 
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}


function hexToRgbaArray(hex) {
    // Remove "#" if present
    hex = hex.replace("#", "");

    let r, g, b, a = 1;

    if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        a = parseInt(hex.slice(6, 8), 16) / 255;
    } else {
        throw new Error("Invalid hex color format");
    }

    return [r, g, b, a];
}


export { rgbaArrayToHexWithAlpha, hexToRgbaArray }