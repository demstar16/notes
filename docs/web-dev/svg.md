# SVG

Learnt from reading [Josh Comeau's Article](https://www.joshwcomeau.com/svg/friendly-introduction-to-svg/)

- SVG is the built-in method for illustration, think of it as HTML for drawing rather than documentation.
- The power of SVG comes in being able to apply CSS and JS to the nodes in the SVG.

## Basic Shapes

### Lines

`<line>`: Specify the start point and end point, and BAM! Line.

```html 
<svg width="280" height="280">
  <line
    x1="200"
    y1="160"
    x2="200"
    y2="160"
    stroke="oklch(0.9 0.3 164)"
    stroke-width="5"
  />
</svg>
```

 
- `<line>` elements are invisible by default, in order to pain the line we need to give it a color via the *stroke* attribute, we can also adjust thickness with *stroke-width*.
- These 2 attributes are examples of **presentational attributes**.
- `x1`, `x2`, etc. are examples of **geometry attributes**.

### Rectangles

- Specify an `x` and `y` point which is the top left of the rectangle.
- Your width and height specify the rest of the shape.

```html 
<svg width="300" height="300">
  <rect
    x="60"
    y="100"
    width="180"
    height="100"
    fill="none"
    stroke="oklch(0.9 0.3 164)"
    stroke-width="5"
  />
</svg>
```

- This can look like a div with a border (it does) but there are some key differences.
  - The stroke is drawn through the center of the path.
  - This is true for all shapes.
  - If width or height are zero, the whole shape will disappear.
  - We can round the corners of our rectangle with `rx` and `ry`, referring to the radius on both axis.

### Circle

- Size is dictated by the radius `r`.
- The center point is specified by `cx` and `cy`.
- Can specify `fill`.
- Disappears if radius is 0.

```html 
<svg width="280" height="280">
  <circle
    cx="140"
    cy="140"
    r="70"
    fill="none"
    stroke="oklch(0.9 0.3 164)"
    stroke-width="5"
  />
</svg>
```

### Ellipses

- Similar to a circle but we can choose different values for its horizontal and vertical radius (`rx` and `ry`).
- Essentially allowing us to make ovals.

```html
<svg width="300" height="300">
  <ellipse
    cx="150"
    cy="150"
    rx="75"
    ry="50"
    fill="none"
    stroke="oklch(0.9 0.3 164)"
    stroke-width="5"
  />
</svg>
```


### Polygons

- Lets us create multi-sided shapes.
- `<polygon>` takes a *points* attribute, which is a list of X,Y points.
  - The browser draws a line between each point, and from the final point back to the first.
- NOTE: The `,` in *points* are unnecessary, however they make reading the coordinates much easier!

```js 
// Neat JavaScript for drawing a polygon
const svg = document.querySelector('.parent-svg');
const polygon = document.querySelector('.mister-polygon');

// CHANGE THESE NUMBERS:
const numOfSides = 4;
const radius = 80;

function drawPolygon() {
  const svgWidth = Number(svg.getAttribute('width'));
  const svgHeight = Number(svg.getAttribute('height'));
  const cx = svgWidth / 2;
  const cy = svgHeight / 2;
  
  const points = range(numOfSides).map((index) => {
    // rotationOffset is used to ensure that even-sided
    // polygons like hexagons/octagons are flat-side-up,
    // rather than pointy-side-up.
    // Set this value to '0' if you don’t want this.
    const rotationOffset = numOfSides % 2 === 0
      ? Math.PI / numOfSides
      : 0;
    
    const angle =
      (index * 2 * Math.PI) / numOfSides -
      Math.PI / 2 +
      rotationOffset;
    
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x},${y}`;
  });

  polygon.setAttribute(
    'points',
    points.join(' ')
  );
}

drawPolygon();
```

## Scalability

- In order to easily have a svg scale, we can use the `viewBox` attribute which defines an **internal coordinate system**.
- This stops the shapes from inheriting raw pixel values and instead uses this internal coordinate system.
- `viewBox` takes 4 numbers; or, a nicer way to think of it, 2 pairs of 2 numbers.
  - The first 2 numbers allow us to change which part of the SVG we're viewing.
  - The second 2 numbers specify the width and height of the viewport.
- NOTE: SVGs technically expand in all directions infinitely, so this internal coordinate system helps us specify where in this infinite space we are looking.

```html
<svg
  width="300"
  height="300"
  viewBox="-90 -33 372 372"
>
  <rect
    x="0"
    y="0"
    width="200"
    height="200"
  />
</svg>
```

## Presentational Attributes

- `fill` allows you to fill in shapes.
- `stroke` has a few different options.
  - `stroke`: sets the color of the stroke, default is transparent.
  - `stoke-width`: width of the stroke in pixels.
  - `stroke-dasharray`: sets the width of each segment and the gap between them. 
    - You can have more than 2 numbers for a different repeating pattern.
    - `stroke-width: 10 20`: means a 10px dash with 20px gap between them.
  - `stroke-linecap`: controls how each dash should be capped.
    - `circle`: circles if the dash is 0px.
    - `square`: squares if the dash is 0px.
    - `butt`: default.
- We can animate all these fields with css!!

```css 
@keyframes casinoLights {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 26;
  }
}



rect {
  stroke-dasharray: 0, 26;
  animation:
    casinoLights 400ms linear infinite;
}
```
