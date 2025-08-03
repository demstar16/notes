# Camera

- Some different cameras that inherit the _Camera_ class:
  - ArrayCamera: Used for rendering a scene multiple times by using multiple cameras (think split screen games).
  - StereoCamera: Used to render the scene through 2 cameras that mimic eyes in order to create a paralax effect (for luring the brain into thinking that there is depth.)
  - CubeCamera: Used to render facing each direction (forward, backward, leftward, rightward, upward, downward) to create a render of the surrounding.
  - OrthographicCamera: Used to create orthographic renders of your scene without perspective. Useful for an RTS game like Age of Empire.
  - PerspectiveCamera: Used for more POV style.

## PerspectiveCamera

- Parameters:
  1. Field of View: The camera view's vertical amplitude angle in degrees.
  - Small angle creates a long scope effect whilst a wide angle creates a fish eye effect.
  - Usually go for a FOV between 45 and 75.
  2. Aspect Ratio: The width divided by the height (usually good practice to store the width and height in an object).
  3. Near: Objects closer than the near value won't be seen.
  4. Far: Similarly, objects further than far won't be seen.
  - If you have too big of a range you can run into render problems, typically between 0.1 and 100 is good.

## OrthographicCamera

- Objects have the same size regardless of their distance from the camera.
- Parameters:
  - left
  - right
  - top
  - bottom
    - How far the camera can see in each direction.
  - near
  - far

## Custom Controls

- An example use case of custom controls is having the camera move based on where the cursor is.

```js
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  // Obtain an amplitude of 1 (min -0.5, mid 0, max 0.5) in both horizontal and vertical
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});
```

- With this event listener we can update the camera (as an example):

```js
const tick = () => {
  camera.position.x = cursor.x;
  camera.position.y = cursor.y;
};
```

- A _hidden_ issue here is that `position.y` is positive going upward in three.js but the clientY axis is positive going downward in the web page.
  - We can fix this by inverting the `cursor.y` in the event listener.

```js
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});
```

## Built-in Controls

- **FlyControls**: Enable moving the camera like you're on a spaceship. Rotation across all 3 axes, forwards and backwards.
- **FirstPersonControls**: Similar to FlyControls but with a fixed up axis. Think of it like a bird view where the bird can't do a barrel roll.
- **PointerLockControls**: Uses the pointer lock JS API. It hides the cursor, keeps it centered, and keeps sending the movements in the `mousemove` event callback. Can be used for FPS games in the browser.
- **OrbitControls**: You can rotate around a point with the left mouse, translate laterally using the right mouse and zoom in or out using the wheel.
- **TrackballControls**: Similar to orbit controls but there are no limits in terms of vertical angle. You can keep rotating and do spins with the camera even if the scene gets upside down.
- **TransformControls**: Nothing to do with the camera, used to add a gizmo to an object to move that object.
- **DragControl**: Nothing to do with the camera, used to move objects on a plane facing the camera by drag and dropping them.

- **NOTE**: It is good practice to list out all your control functionalities you need and then see if a library ticks all those boxes. 
  - If a library doesn't you'll have to implement your own controls.

### Orbit Controls 

- To use you have to specifically import it `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`
- In order for any altercations to take effect you need to call the **update()** method on your controls instance.
- To make the controls smoother we can enable damping: `controls.enableDamping = true`
- For smoothness, in the **tick** or **animation** function be sure to update your controls. 
