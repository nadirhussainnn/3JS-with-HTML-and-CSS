import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; //three/addons is added in HTMl with three in importmaps

function main() {
  //container
  const canvas = document.querySelector("canvas");

  //Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true, //helps GPU
  });

  //Camera
  const fov = 40;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(
    fov,
    canvas.clientWidth / canvas.clientHeight,
    near,
    far
  );
  camera.position.z = 120;

  //Scene
  const scene = new THREE.Scene();

  //Adding directional lighting to Scene
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  //Buffer: to draw a line that will extend at runtime
  const MAX_POINTS = 500;
  const geometry = new THREE.BufferGeometry();

  // attributes
  let positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // draw range
  const drawCount = 2; // draw the first 2 points, only
  geometry.setDrawRange(0, drawCount);

  // material
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // line
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  //Randomly add points to line like this
  positions = line.geometry.attributes.position.array;

  let x, y, z, index;
  x = y = z = index = 0;

  for (let i = 0, l = MAX_POINTS; i < l; i++) {
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;

    x += (Math.random() - 0.5) * 30;
    y += (Math.random() - 0.5) * 30;
    z += (Math.random() - 0.5) * 30;
  }

  const lineMesh = new THREE.Mesh(geometry, material);
  scene.add(lineMesh);
  renderer.render(scene, camera);

  function render(time) {
    time *= 0.001; // convert time to seconds

    lineMesh.rotation.x = time;
    lineMesh.rotation.y = time;
    lineMesh.rotation.z = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  //To resolve shape result issue
  function resizeRendererToDisplaySize(renderer) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  resizeRendererToDisplaySize(renderer);
  scene.background = new THREE.Color(0x000000);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0); //displace the target from origin in y:5 direction
  controls.update(); //Repaint the DOM

  //Dispose unused objects and avoid memory leaks
  //   BufferGeometry.dispose()          //For geometry
  //   Material.dispose()                //Material
  //   Texture.dispose()                 //Material
  //   WebGLRenderTarget.dispose()       //Render target
}

main();
