# Three JS Basics

## Creating a Scene

- Create a scene with the `Scene` method: `const Scene = new THREE.Scene()`.
- This is where we hold objects that we want to render.
- NOTE: that we need to render the scene in order to see it.

### Mesh 

- A mesh consists of a geometry (cube, sphere, etc.) and a material (how the object looks.)
- Geometry methods typically just require dimensions as inputs.
- Material methods require objects where you can pass properties.

```js 
// Basic Box Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material)
```

### Camera 

- The camera is a theoretical POV. 
- There are many different types.
- The `PerspectiveCamera` class takes a field of view value and an aspect ratio.
  - It is usually pretty standard to have the aspect ratio as the width of the canvas divided by the height of the canvas.

```js 
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
scene.add(camera)
```


### Default Positioning

- Everything by default will render in the center.
- In this case in order to see our simple box mesh we made we can just position the camera backwards a bit.
- **NOTE**: To move the camera backwards we work on the Z axis, and to go back we want a POSITIVE value.
  - `camera.position.z(3)`

## Transform Objects

- 4 properties that can be used to transform objects:
  - `position`
    - Is an instance of the **Vector3** class, meaning it has many useful methods: length(), distanceTo(), normalize(), set()...
  - `scale`
    - Is also an instance of **Vector3**...
    - Avoid using negative values for this property.
  - `rotation`
    - Can use the `rotation` property or the `quaternion` property, updating one updates the other so it's a matter of preference.
- Any object that inherits **Object3D** has these 4 properties.
  - An easy way to know if something inherits this is to check the breadcrumb trail for that item in the docs. 
- These properties are compiled in matrices.

### Rotation 

- `rotation`
  - `rotation` is a **Euler**, a good way to imagine the rotation of is putting a stick through whichever axis you choose and rotating around it.
  - The value of these aces is expressed in radians!!!
    - `math.rotation.x = Math.PI * 0.25`.
  - Combining rotations can give weird results because while rotating one axis you're changing the other axis' orientation.
  - Rotation applies in the `XYZ` order.
  - You can change the order with: `object.rotation.reorder('YXZ')`
- `quaternion`

- We can use the `lookAt()` function to do handy rotation across the z-axis.
  - All it takes is another **Vector3** object and the object will rotate to face what you pass it.

### Combining Transformations 

- You can combine transformations in any order.
- The `Group` class is really handy, it essentially groups objects together so that they can all be scaled together.
  - An example is building a house and then later on you want it bigger, rather than scaling every component, you scale the house group.

```js 
const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = - 1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube3.position.x = 1.5
group.add(cube3)
```

### Axes Helper 

- A useful tool for seeing the axes in your scene.
- Takes one parameter for the length of the lines. 

```js 
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)
```

## Animations 

- `requestAnimationFrame()` takes a function and calls this function on the next frame.
- So we can create a function and in that function call `requestAnimationFrame()` in that function passing it our created function... creating an endless loop.
- A simple example of how to use this:

```js 
const tick = () => {
  // Update objects
  mesh.rotation.y += 0.01;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
```

### GSAP 

- A useful library for animations. 

## Camera 

- Some different cameras that inherit the *Camera* class:
  - ArrayCamera: Used for rendering a scene multiple times by using multiple cameras (think split screen games).
  - StereoCamera: Used to render the scene through 2 cameras that mimic eyes in order to create a paralax effect (for luring the brain into thinking that there is depth.)
  - CubeCamera: Used to render facing each direction (forward, backward, leftward, rightward, upward, downward) to create a render of the surrounding.
  - OrthographicCamera: Used to create orthographic renders of your scene without perspective. Useful for an RTS game like Age of Empire.
  - PerspectiveCamera: Used for more POV style.


### PerspectiveCamera 

- Parameters: 
  1. Field of View: The camera view's vertical amplitude angle in degrees.
    - Small angle creates a long scope effect whilst a wide angle creates a fish eye effect.
    - Usually go for a FOV between 45 and 75.
  2. Aspect Ratio: The width divided by the height (usually good practice to store the width and height in an object).
  3. Near: Objects closer than the near value won't be seen.
  4. Far: Similarly, objects further than far won't be seen.
    - If you have too big of a range you can run into render problems, typically between 0.1 and 100 is good.

### OrthographicCamera 

- Objects have the same size regardless of their distance from the camera.
- Parameters: 
  - left 
  - right 
  - top 
  - bottom 
    - How far the camera can see in each direction. 
  - near 
  - far 


