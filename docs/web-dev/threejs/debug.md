# Debugging

## lil-gui

- A light weight debugging library for three.js
- Can be installed through your standard **npm** or **pnpm**
- `import GUI from 'lil-gui`
- [Reference](https://lil-gui.georgealways.com/)

## Types of Tweaks

- Range: for numbers with min and max.
  - NOTE: For these range sliders use **OnFinishChange** rather than **OnChange**.
- Color: for colors with various formats.
- Text: for simple texts.
- Checkbox: for booleans.
- Select: for a choice from a list of values.
- Button: to trigger functions.
- NOTE: lil-gui can't update variables, only properties!

```js
// Range
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

gui.add(mesh.position, "y");
gui.add(mesh.position, "y", -3, 3, 0.01); // Specify the range.
gui.add(mesh.position, "y").min(-3).max(3).step(0.01);
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");

// Boolean
gui.add(mesh, "visible");
gui.add(material, "wireframe");

// Color
gui.addColor(material, "color");
```

## Dealing with Custom Properties

### Updating Accurate Color

- I say accurate here, as the color used directly by three.js is different to what is rendered with lil-gui.
- We can use an object to track it as we update it to maintain its true value.

```js
const properties = {
  color: "#fff",
};

const material = new THREE.MeshBasicMaterial({ color: properties.color });

gui.addColor(properties, "color").onChange(() => {
  material.color.set(properties.color);
});
```

### Custom Wireframe Debug

```js
const properties = {
  wireframeTriangles: 2,
};

let geometry = new THREE.BoxGeometry(
  1,
  1,
  1,
  properties.wireframeTriangles,
  properties.wireframeTriangles,
  properties.wireframeTriangles
);

const material = new THREE.MeshBasicMaterial({
  color: "blue",
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

gui.add(properties, "wireframeTriangles").onChange(() => {
  geometry.dispose();
  geometry = new THREE.BoxGeometry(
    1,
    1,
    1,
    properties.wireframeTriangles,
    properties.wireframeTriangles,
    properties.wireframeTriangles
  );
  mesh.geometry = geometry;
});
```
