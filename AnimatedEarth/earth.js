import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; //three/addons is added in HTMl with three in importmaps

function main() {
  const canvas = document.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, logarithmicDepthBuffer: true });
  renderer.shadowMap.enabled = true;
  
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

  //Other camera's

  
  const scene = new THREE.Scene();

  //Adding directional lighting to Scene
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const radius = 10; // ui: radius
  const detail = 2; // ui: detail
  const geometry = new THREE.DodecahedronGeometry(radius, detail);

  //Adding Textures i.e Image, text to Material
  const loader = new THREE.TextureLoader(); //Remove material color while adding texture

  const material = new THREE.MeshPhongMaterial({
    color: 0x44aa88,
    flatShading: true,
    side: THREE.DoubleSide,
    // map: loader.load(
    //   `https://images.unsplash.com/profile-1441298803695-accd94000cac?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128&s=32085a077889586df88bfbe406692202`
    // ),
  });
  //important property: flatShading:true

  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);
  renderer.render(scene, camera);

  function render(time) {
    time *= 0.001; // convert time to seconds

    earth.rotation.x = time;
    earth.rotation.y = time;
    earth.rotation.z = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  //To resolve shape result issue
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
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

  //adding user inputs on Earth, so import {OrbitControls} from '/examples/jsm/controls/OrbitControls.js';
  //   camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0); //displace the target from origin in y:5 direction
  controls.update(); //Repaint the DOM

  //#region Working with differnt lights

  //   const color = 0xffffff;
  //   const intensity = 1;
  //   const light = new THREE.AmbientLight(color, intensity);
  //   scene.add(light);

  //Let's add sky and earth color: So use HemisphereLight
  // A HemisphereLight takes a sky color and a ground color and just multiplies the material's color between those 2 colors—the sky color if the surface of the object is pointing up and the ground color if the surface of the object is pointing down.

  // const skyColor = 0xB1E1FF;  // light blue
  // const groundColor = 0xB97A20;  // brownish orange
  // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  // scene.add(light);

  // Let's switch the code to a DirectionalLight. A DirectionalLight is often used to represent the sun.

  const color = 0xffffff;
  const intensity = 0.5;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, 0, 0);
  scene.add(light);
  scene.add(light.target);

  light.castShadow = true;
  
  //Shadows
  const shadowTexture = loader.load('./round-shadow.jpg');

//   const yOff = Math.abs(Math.sin(time * 2 + ndx));
//     // move the sphere up and down
//     sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);

}

main();

//Making canvas responsive : That canvas defaults to 300x150 CSS pixels in size. so we set it's height and width in css
