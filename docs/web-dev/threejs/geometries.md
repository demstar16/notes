# Geometries 

## Box Geometry 

- Takes 6 parameters:
  - width: Size on x-axis.
  - height: Size on y-axis. 
  - depth: Size on z-axis. 
  - widthSegments: Number of subdivisions in x-axis.
  - heightSegments: Number of subdivisions in y-axis. 
  - depthSegments: Number of subdivisions in z-axis.
- In order to see the subdivisions on our mesh, enable `wireframe` in the mesh call.
  - `const material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true})`.

## Custom Geometries 

- If you need a simple custom geometry this can be easily achieved with `BufferGeometry()`.
- You need to create a positions array which specifies each point (x, y, z) in order so that it can all be linked up.
- Then create a positions attribute which is used create your geometry.

```js 
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create 50 triangles (450 values)
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
```


