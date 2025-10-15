# Textures

- Are images that cover the surfaces of your geometries.

## Types

- Color (albedo): takes the pixels of the texture and applies it to the surface.
- Alpha: is a grey scale image where white is visible and black isn't.
- Height: grey scale image that moves the vertices to create relief. You need to add subdivision to see it.
- Normal: adds small details, and will not move the vertices but lures the light into thinking that the face is orientated differently.
  - Useful for adding details with good performance because you don't need to subdivide the geometry.
- Ambient occlusion: grey scale image that fakes shadow on the surface's crevices.
  - It's not physically accurate but helps create contrast.
- Metalness: grey scale image that specifies which part is metallic (white) and non-metallic (black).
  - Helps create reflection.
- Roughness: Similar to above but with roughness.
  - Helps dissipate light.
- PBR: the 2 above (metalness and roughness) follow PBR principles, Physically Based Rendering.
  - It regroups many techniques that tend to follow real-life directions to get realistic results.

## Loading Textures

### Getting the URL

- 2 main ways to load in a texture:
  - **importing** like a JS dependency.
  - putting the texture in the `static/` folder and referencing it in a variable without the `static/` part. (`const img = '/image.png'`).
    - Only works in Vite.

### Loading the image

```js
const image = new Image();
const texture = new THREE.Texture(image);
texture.colorSpace = THREE.SRGBColorSpace;
image.addEventListener("load", () => {
  texture.needsUpdate = true;
});
image.src = "/textures/door/color.jpg";
```

- NOTE: We need to set the texture's color space to use sRGB if we assign the texture with map or matcap.

### Using TextureLoader

- Essentially does what we already did for us.
- A function that takes the path to the image, and then 3 callback functions.
  - **load**: when the image has loaded successfully.
  - **progress**: when the loading is progressing.
  - **error**: if something went wrong.

```js
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "/textures/door/color.jpg",
  () => {
    console.log("loading finished");
  },
  () => {
    console.log("loading progressing");
  },
  () => {
    console.log("loading error");
  }
);
texture.colorSpace = THREE.SRGBColorSpace;
```

### LoadingManager

- Good for loading multiple images.
- Pass the manager into the textureLoader.

```js
const loadingManger = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManger);
```

- Similarly there are events we can use to help us see what's going on.

```js
loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onLoad = () => {
  console.log("loading finished");
};
loadingManager.onProgress = () => {
  console.log("loading progressing");
};
loadingManager.onError = () => {
  console.log("loading error");
};

const textureLoader = new THREE.TextureLoader(loadingManager);
```

- The main use of LoadingManager I think is to load all the assets in under one loading bar.

## UV Unwrapping

- If you try placing the above texture that works on a cube on a sphere, you'll notice it warping to fit.
- This is known as **UV Unwrapping**.
- It makes sense as each point on a texture has a coordinate on a flat plane, so it won't like as you expect on curved surfaces.
- You can see the UV 2D coordinates in the `geometry.attributes.uv` property.
- Most modelling software (Blender), have things to deal with this for you.

## Transforming the Texture

### Repeat

- You can repeat a texture with the `repeat` property.
- It is a **Vector2**, (x and y properties.)
- A texture is not set up to repeat by default, you need to update `wrapS` and `wrapT` using the `THREE.RepeatWrapping` constant.

```js
texture.repeat.x = 2;
texture.repeat.y = 3;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
```

- You can reverse the direction with `THREE.MirroredRepeatWrapping`.

### Offset

- Simply offsets the UV coordinates.
- Is also a Vector2 (x and y).

```js
texture.offset.x = 0.5;
texture.offset.y = 0.5;
```

### Rotation

- Is a number corresponding to the angle in radians.
- Rotation occurs around the bottom left corner of the cube's faces.
- That is (0, 0) of the UV coordinates.
- We can change the center with the (drum roll please), `center` property.

```js
texture.rotation = Math.PI * 0.25;
texture.center.x = 0.5;
texture.center.y = 0.5;
```

### Filtering & Mipmapping

- Mipmapping is a technique that consists of creating half a smaller version of a texture again and again until you get a 1x1 texture.
- All the texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture.
- ThreeJS and the GPU already handle this, you just pick one of 2 types of filter algorithms...
- **Minification filter**:
  - Happens when the pixels of texture are smaller than the pixels of the render.
  - In other words, the texture is too big for the surface it covers.
  - You can change the minification filter by using the `minFilter` property.
  - There 6 possible values:
    - `THREE.NearestFilter`
    - `THREE.LinearFilter`
    - `THREE.NearestMipmapNearestFilter`
    - `THREE.NearestMipmapLinearFilter`
    - `THREE.LinearMipmapNearestFilter`
    - `THREE.LinearMipmapLinearFilter` (default)
- **Magnification filter**:
  - Works similar to the minification filter, but when the pixels of the texture are bigger than the render's pixels.
  - In other words, the texture too small for the surface it covers.
  - You can change the filter of the texture using the `magFilter` property.
  - There are 2 possible values:
    - `THREE.NearestFilter`
    - `THREE.LinearFilter` (default)

## Format & Optimisation

- When preparing a texture, keep 3 things in mind:
  - The weight
    - Try compress images where possible
  - The size (or resolution)
    - Smallest possible size
  - The data

## Good Sites for Textures

- [poliigon](www.poliigon.com)
- [3dtextures](www.3dtextures.me)
- [arroway-textures](www.arroway-textures.ch)
- Make your own with [Substance Designer](https://www.adobe.com/products/substance3d-designer.html)
