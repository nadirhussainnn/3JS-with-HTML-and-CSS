import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; //three/addons is added in HTMl with three in importmaps

function main() {
  const canvas = document.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    logarithmicDepthBuffer: true,
  });
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

  const color = 0xffffff;
  const intensity = 0.5;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, 0, 0);
  scene.add(light);
  scene.add(light.target);

  light.castShadow = true;

  //Audio

  // create an AudioListener and add it to the camera
  // const listener = new THREE.AudioListener();
  // camera.add(listener);

  // // create a global audio source
  // const sound = new THREE.Audio(listener);

  // // load a sound and set it as the Audio object's buffer
  // const audioLoader = new THREE.AudioLoader();
  // audioLoader.load("./audio.ogg", function (buffer) {
  //   sound.setBuffer(buffer);
  //   sound.setLoop(true);
  //   sound.setVolume(0.5);
  //   sound.play();
  // });

  //Positional audio: i.e playing from specific shape or object

  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create the PositionalAudio object (passing in the listener)
  const sound = new THREE.PositionalAudio(listener);

  // load a sound and set it as the PositionalAudio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("./audio.ogg", function (buffer) {     //mp3 also supported
    sound.setBuffer(buffer);        
    sound.setRefDistance(20);
    sound.play();
  });

    earth.add(sound)  //add in mesh 

    //Zoom in and out earth to analyze the difference
}

main();

//Making canvas responsive : That canvas defaults to 300x150 CSS pixels in size. so we set it's height and width in css
