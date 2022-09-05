//Loading GLTF models

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });
  const scene = new THREE.Scene();

  let objects;

  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    "./model/scene.gltf",
    (gltf) => {
      const root = gltf.scene;
      root.scale.set(0.07, 0.07, 0.07);
      scene.add(root);
      console.log(dumpObject(root).join("\n"));

      objects = root.getObjectByName("Sketchfab_model"); //name obtained from dumpObject method result [3DObject]
      console.log(objects);
    },
    (xhr) => {
      console.log(`Loaded ${(xhr.loaded / xhr.total) * 100}%`);
    },
    (ud) => {
      console.log("Undefined model");
    },
    (error) => {
      console.log(error);
    }
  );

  //To view model, let lighten it up
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(2, 2, 5);
  scene.add(light);

  const fov = 75;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(
    fov,
    canvas.clientWidth / canvas.clientHeight,
    near,
    far
  );

  camera.position.set(0, 1, 2);
  scene.add(camera);
  renderer.shadowMap.enabled = true;

  renderer.render(scene, camera);

  function animate(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    if (objects) {
      for (const obj of objects.children) {
        obj.rotation.z = time;
      }
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate(animate);

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

  //Move model on mouse over
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();
}

main();

function dumpObject(obj, lines = [], isLast = true, prefix = "") {
  const localPrefix = isLast ? "└─" : "├─";
  lines.push(
    `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
      obj.type
    }]`
  );
  const newPrefix = prefix + (isLast ? "  " : "│ ");
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}
