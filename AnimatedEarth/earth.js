import * as THREE from "three";

function main() {
  const canvas = document.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(
    fov,
    canvas.clientWidth / canvas.clientHeight,
    near,
    far
  );
  camera.position.z = 120;

  const scene = new THREE.Scene();

  //Adding directional lighting to Scene
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const radius = 10;  // ui: radius
  const detail = 2;  // ui: detail
  const geometry = new THREE.DodecahedronGeometry(radius, detail);
  const material = new THREE.MeshPhongMaterial({ color: 0x44aa88, flatShading:true, side:THREE.DoubleSide });
  //important property: flatShading:true


  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  renderer.render(scene, camera);

  function render(time) {
    time *= 0.001; // convert time to seconds

    earth.rotation.x = time;
    earth.rotation.y = time;
    earth.rotation.z=time

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

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

  //customizing scene

  scene.background=new THREE.Color(0xAAAAAA);
}

main();

//Making canvas responsive : That canvas defaults to 300x150 CSS pixels in size. so we set it's height and width in css
