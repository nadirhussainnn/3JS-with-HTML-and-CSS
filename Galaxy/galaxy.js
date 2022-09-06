// // //Linking multiple objects together

// // import * as THREE from "three";
// // import { OrbitControls } from "three/addons/controls/OrbitControls.js"; //three/addons is added in HTMl with three in importmaps

// // function main() {
// //   const canvas = document.querySelector("canvas");
// //   const renderer = new THREE.WebGLRenderer({ canvas, logarithmicDepthBuffer: true });
// //   renderer.shadowMap.enabled = true;
  
// //   const fov = 40;
// //   const near = 0.1;
// //   const far = 1000;
// //   const camera = new THREE.PerspectiveCamera(
// //     fov,
// //     canvas.clientWidth / canvas.clientHeight,
// //     near,
// //     far
// //   );

// //   camera.position.z = 120;

// //   const scene = new THREE.Scene();

// //   //Adding directional lighting to Scene
// //   {
// //     const color = 0xffffff;
// //     const intensity = 1;
// //     const light = new THREE.DirectionalLight(color, intensity);
// //     light.position.set(-1, 2, 4);
// //     scene.add(light);
// //   }

// //   const radius = 10;
// //   const detail = 2;
// //   const geometry = new THREE.DodecahedronGeometry(radius, detail);
// //   const material = new THREE.MeshPhongMaterial({color: 0x44aa88,flatShading: true});
// //   const earth = new THREE.Mesh(geometry, material);
// //   earth.position.x=-5;

// //   const cubeGeo = new THREE.BoxGeometry(15, 15, 15);
// //   const cubeMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
// //   const cube = new THREE.Mesh(cubeGeo, cubeMat);
// //   cube.position.x = 5;  // Translate the cube to the right

// //   earth.add(cube);
// //   scene.add(earth)
// //   renderer.render(scene, camera);

// //   function render(time) {
// //     time *= 0.001; // convert time to seconds

// //     earth.rotation.x = time;
// //     earth.rotation.y = time;
// //     earth.rotation.z = time;

// //     renderer.render(scene, camera);

// //     requestAnimationFrame(render);
// //   }

// //   requestAnimationFrame(render);

// //   //To resolve shape result issue
// //   function resizeRendererToDisplaySize(renderer) {
// //     const width = canvas.clientWidth;
// //     const height = canvas.clientHeight;
// //     const needResize = canvas.width !== width || canvas.height !== height;
// //     if (needResize) {
// //       renderer.setSize(width, height, false);
// //     }
// //     return needResize;
// //   }

// //   resizeRendererToDisplaySize(renderer);
// //   scene.background = new THREE.Color(0x000000);

// //   const controls = new OrbitControls(camera, canvas);
// //   controls.target.set(0, 5, 0); //displace the target from origin in y:5 direction
// //   controls.update(); //Repaint the DOM

// // }

// // main();

// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js"; //three/addons is added in HTMl with three in importmaps

// function main(){

//   const canvas = document.querySelector("canvas");
//   const renderer = new THREE.WebGLRenderer({antialias: true});
//   const controls = new THREE.OrbitControls(camera, canvas);

//   invalidation.then(() => renderer.dispose());
//   // renderer.setSize(width, height);
//   // renderer.setPixelRatio(devicePixelRatio);
//   let fraction = 0;
//   const up = new THREE.Vector3( 0, 1, 0 );
  
//   while (true) {
//     paths.forEach(d => {
//       const axis = new THREE.Vector3( );
//       const newPosition = d.points.getPoint(fraction);
//       const tangent = d.points.getTangent(fraction);
//       d.arrow.position.copy(newPosition);
//       axis.crossVectors( up, tangent ).normalize();
//       const radians = Math.acos( up.dot( tangent ) );
//       d.arrow.quaternion.setFromAxisAngle( axis, radians );
//     });
    
    
//     renderer.render(scene, camera);
//     fraction +=0.001;
//     if (fraction > 1) {
//       fraction = 0;
//     }    
//     yield renderer.domElement;
//   }


//   const scene = ()=>{
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xffffff);
  
//     paths.forEach(d => {
//       scene.add(d.line);
//       scene.add(d.arrow);
//     });
//     const axesHelper = new THREE.AxesHelper( 0.5 );
//     axesHelper.translateX(1);
//     scene.add( axesHelper );
//     return scene;
//   }
// }

// const paths ={
    
//   const material = new THREE.LineBasicMaterial({
//       color: 0x9132a8
//   });
  
//   const arrowMaterial = new THREE.MeshNormalMaterial();
//   const pathsArray = [];
//   for(let i=0; i < numberArrows; i++){
//     const pointsPath = getPointsPath();
//     const points =pointsPath.curves.reduce((p, d)=> [...p, ...d.getPoints(20)], []);
  
//     const geometry = new THREE.BufferGeometry().setFromPoints( points );
//     pathsArray.push({line: new THREE.Line( geometry, material), points: pointsPath, arrow: new THREE.Mesh(arrow, arrowMaterial)});
//   }

//     return pathsArray;
// }

// const getPointsPath = () => {
//   const pointsPath = new THREE.CurvePath();
//   const p1 = new THREE.Vector3( d3.randomUniform(-1, 1)(), d3.randomUniform(-1, 1)(),d3.randomUniform(-1, 1)() );
//   const p2 = new THREE.Vector3( d3.randomUniform(-1, 1)(), d3.randomUniform(-1, 1)(), d3.randomUniform(-1, 1)() );
//   const p3 = new THREE.Vector3( d3.randomUniform(-1, 1)(), d3.randomUniform(-1, 1)(), d3.randomUniform(-1, 1)() );
//   const p4 = new THREE.Vector3( d3.randomUniform(-1, 1)(), d3.randomUniform(-1, 1)(), d3.randomUniform(-1, 1)() );
  
//   const firstLine = new THREE.LineCurve3(p1, p2);
//   const secondLine = new THREE.LineCurve3(p2, p3);
  
//   const thirdLine = new THREE.LineCurve3(p3, p4);

//   pointsPath.add(firstLine);
//   pointsPath.add(secondLine);
//   pointsPath.add(thirdLine);

//   return pointsPath;     
// }