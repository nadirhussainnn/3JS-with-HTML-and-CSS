import * as THREE from "three";

function main() {
  const canvas = document.querySelector("#canvas");
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

//   const radius = 50;  // ui: radius
//   const segments = 24;  // ui: segments
//   const geometry = new THREE.CircleGeometry(radius, segments);
  
  
    const radius = 50;  // ui: radius
    const segments = 24;  // ui: segments
    const thetaStart = Math.PI * 0.5;  // ui: thetaStart
    const thetaLength = Math.PI * 1.5;  // ui: thetaLength
    const geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);

    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 }); // greenish blue: We changed mesh to show lightening


  const circle = new THREE.Mesh(geometry, material);
  scene.add(circle);

  renderer.render(scene, camera);

  function render(time) {
    time *= 0.001; // convert time to seconds

    circle.rotation.x = time;
    circle.rotation.y = time;

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
