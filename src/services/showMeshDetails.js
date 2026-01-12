import * as THREE from "three";

export const showMeshDetails = (obj) => {
    console.log("Mesh name found:", obj.name);

    // 1. Create a Box3 object
    const box = new THREE.Box3().setFromObject(obj);

    // 2. Get the size (dimensions)
    const size = new THREE.Vector3();
    box.getSize(size);

    // 3. Log the dimensions
    console.log(`Dimensions of ${obj.name}:`, {
        width: size.x.toFixed(2),  // Left to Right
        height: size.y.toFixed(2), // Top to Bottom
        depth: size.z.toFixed(2)   // Front to Back
    });
}



export const getMeshDetails = (obj) => {
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
        name: obj.name,
        dimensions: {
            width: size.x,
            height: size.y,
            depth: size.z
        }
    };
}