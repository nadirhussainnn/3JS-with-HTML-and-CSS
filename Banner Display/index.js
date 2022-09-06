import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; //three/addons is added in HTMl with three in importmaps

// ## Let"s get everything set up
var scene,
  camera,
  renderer,
  can_click = 1,
  position = 0,
  particles = [],
  crates;

// ## Scene options
var wireframe = false; // Set to true to see object wireframes
var sceneLoadDelay = 500; // Delay from when fully loaded to fade in scene

let cameraX = 11; // Camera x position
let cameraY = 1; // Camera y position
let cameraZ = 11; // Camera z position
let cameraZoom = 2; // Camera zoom value
let cameraMoveDelay = 0.5; // Delay after left/right clicked before the cam moves
let cameraMoveSpeed = 1.2; // How fast cam moves to next crate

let crateOffset = 20; // How far each crate is apart
let sceneOffset = 1; // The scene offset

let sceneBg = "black"; // The scene global color

let globalAmbienceIntensity = 0.06; // Set general ambience
let globalAmbienceColor = "#d39cf3"; // General ambience color

let spotLightColor = "#ab4fcd";
let spotLightIntensity = 10;

let floorWidth = 200; // Width of the grass floor
let floorHeight = 100; // Height of the grass floor

let parallaxSeperation = 1; // Distance between back drop panels
let parallaxMidModifier = 3; // Parallax sensitivity

let rockAnimationDelay = 0.6; // Delay after click until crate rocks

let rockAnimationDurationOne = 0.56; // Stage one rock duration
let rockAnimationRotationOne = -0.93; // Stage one rock amount

let rockAnimationDurationTwo = 0.2; // Stage two rock duration
let rockAnimationRotationTwo = 0; // Stage two rock amount

let rockAnimationDurationThree = 0.27; // Stage three rock duration
let rockAnimationRotationThree = 0.25; // Stage three rock amount

let rockAnimationDurationFour = 0.12; // Stage four rock duration
let rockAnimationRotationFour = 0; // Stage four rock amount

let rockAnimationDurationFive = 0.1; // Stage five rock duration
let rockAnimationRotationFive = -0.1; // Stage five rock amount

let rockAnimationDurationSix = 0.05; // Stage six rock duration
let rockAnimationRotationSix = 0; // Stage one six amount

let smokeAmount = 40; // How many smoke particles per crate

let particleAmount = 1000; // Global particle count
let particleMaxSize = 15; // Max particle size

let slidePlayDelay = 500; // Delay from click until slide is played

let forestPanelMid;
// ## Scene options
THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
  var percent = (loaded / total) * 100; // Figure our percent loaded
  $(".loader_inner").css("width", percent + "%"); // Change width of loader
  if (loaded == total) {
    $(".loader").fadeOut(); // Fade loader out
    setTimeout(function () {
      $("#canvas,.ui").fadeIn(); // Fade in our scene
    }, sceneLoadDelay);
  }
};

function startScene() {
  // ## Set up the canvas
  var canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight,
    container = document.getElementById("canvas");

  // ## Create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(sceneBg); // Set the background color of our scene

  // ## Let"s get some light into the scene
  let ambientLight = new THREE.AmbientLight(
    globalAmbienceColor,
    globalAmbienceIntensity
  ); // Create an ambient light source
  scene.add(ambientLight); // Now add the light to our scene

  for (let i = 0; i < 4; i++) {
    let l = new THREE.PointLight(spotLightColor, 20, 10, 4, spotLightIntensity); // Create a PointLight
    l.position.set(5, 4, -i * crateOffset); // Position this light
    l.castShadow = true;
    scene.add(l); // Add all lights to the scene
  }

  // ## Set up the camera
  camera = new THREE.PerspectiveCamera(
    45,
    canvasWidth / canvasHeight,
    1,
    13000
  ); // Create a new camera
  camera.lookAt(scene.position); // Point it at our scenes origin
  camera.position.set(cameraX, cameraY, cameraZ); // Position it to liking
  camera.zoom = cameraZoom; // Zoom in a bit
  camera.updateProjectionMatrix(); // Needs to be called as we have updated the camera position

  // ## Create a new WebGl Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap = true; // Enable shadow maps
  container.appendChild(renderer.domElement); // Append renderer

  // ## Window resize event
  window.addEventListener("resize", onWindowResize, false);

  // // ## Let"s create a constructor for our meshes
  // let object = function () {
  //     THREE.Mesh.apply(this, arguments);
  // };

  // object.prototype = Object.create(THREE.Mesh.prototype);
  // object.prototype.constructor = object;
  // object.verticesNeedUpdate = true; // Needed to update anchor points

  // ## Load in our textures
  THREE.ImageUtils.crossOrigin = "";

  // Grass
  let grassTexture = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/cartoon_grass.jpg"
  );
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; // Allow texture wrapping
  grassTexture.repeat.set(40, 100); // Repeat the grid texture

  // Forest
  let forestFrontTexture = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/forestPanelFront.png"
  );
  forestFrontTexture.wrapS = forestFrontTexture.wrapT = THREE.RepeatWrapping; // Allow texture wrapping
  forestFrontTexture.repeat.set(10, 1); // Repeat the grid texture

  // Forest Mid
  let forestMidTexture = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/forestPanelMid.png"
  );
  forestMidTexture.wrapS = forestMidTexture.wrapT = THREE.RepeatWrapping; // Allow texture wrapping
  forestMidTexture.repeat.set(10, 1); // Repeat the grid texture

  // Particles
  let particleTexture = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/particleTexture.png"
  );

  // Crate textures
  let crateTexture = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/create4texture.png"
  );
  let crateTexture2 = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/crate2.png"
  );
  let crateTexture3 = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/crate5.jpg"
  );
  let crateTexture4 = new THREE.TextureLoader().load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/217233/crate3.jpg"
  );

  // ## Create our materials
  let smokeMaterial = new THREE.MeshPhongMaterial({
    // Smoke
    shading: THREE.SmoothShading,
    color: "white",
    transparent: true,
    opacity: 0,
  });
  let particleMaterial = new THREE.MeshPhongMaterial({
    // Particles
    shading: THREE.SmoothShading,
    transparent: true,
    color: "white",
    map: particleTexture,
  });
  let forestMaterialFront = new THREE.MeshPhongMaterial({
    // Forest front panel
    map: forestFrontTexture,
    transparent: true,
    shininess: 0,
  });
  let forestMaterialMid = new THREE.MeshPhongMaterial({
    // Forest panel mid
    color: "#bd137b",
    map: forestMidTexture,
    transparent: false,
  });
  let grassMaterial = new THREE.MeshPhongMaterial({
    // Grass
    color: "#730549",
    shading: THREE.SmoothShading,
    map: grassTexture,
    shininess: 0,
  });
  let crateMaterial = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture,
  });
  let crateMaterial2 = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture2,
  });
  let crateMaterial3 = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture3,
  });
  let crateMaterial4 = new THREE.MeshPhongMaterial({
    // Crate
    shading: THREE.SmoothShading,
    map: crateTexture4,
  });

  // ## Check if wireframe
  if (wireframe) {
    crateMaterial.wireframe =
      grassMaterial.wireframe =
      smokeMaterial.wireframe =
      forestMaterialMid =
      forestMaterialFront =
        true;
  }

  // ## Create our scene objects

  // Floor
  var floorGeometry = new THREE.PlaneGeometry(floorHeight, floorWidth, 20, 20);
  var floor = new THREE.Mesh(floorGeometry, grassMaterial);

  floor.rotation.x = -Math.PI / 2; // Rotate floor
  floor.position.set(0, 0, -70); // Position floor
  floor.receiveShadow = true; // Let floor receive shadows

  scene.add(floor); // Add it to our scene

  // Forest background panels
  var forestPanelFrontGeometry = new THREE.PlaneGeometry(
    floorWidth + 30,
    34,
    120,
    20
  );
  let forestPanelFront = new THREE.Mesh(
    forestPanelFrontGeometry,
    forestMaterialFront
  );
  forestPanelMid = new THREE.Mesh(forestPanelFrontGeometry, forestMaterialMid);

  forestPanelMid.position.set(0, 0, -parallaxSeperation);

  var forest = new THREE.Object3D();
  forest.rotation.y = Math.PI / 2;
  forest.position.set(-floorHeight / 2, 7, -70);
  forest.add(forestPanelFront, forestPanelMid);

  scene.add(forest);

  // ## Create geometries for each crate
  var crateOneGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
  var crateTwoGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
  var crateThreeGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
  var crateFourGeo = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);

  // ## Create meshes using our constructor
  var crateOne = new THREE.Mesh(crateOneGeo, crateMaterial);
  var crateTwo = new THREE.Mesh(crateTwoGeo, crateMaterial2);
  var crateThree = new THREE.Mesh(crateThreeGeo, crateMaterial3);
  var crateFour = new THREE.Mesh(crateFourGeo, crateMaterial4);

  // ## Lets create an array store all our crates
  crates = [];
  crates.push(crateOne, crateTwo, crateThree, crateFour); // Push objects to array

  // ## Make smoke geometry
  var smokeGeo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

  // ## Loop over our crates and add them into the scene
  for (let i = 0; i < crates.length; i++) {
    crates[i].geometry.translate(0, 1, 1); // 0, 1, 1
    crates[i].position.set(0, 0, -i * crateOffset + sceneOffset);
    crates[i].castShadow = true; // Make crate cast shadows
    for (let a = 0; a < smokeAmount; a++) {
      let s = new THREE.Mesh(smokeGeo, smokeMaterial);
      let num = Math.random() * -2 + 1;
      s.position.set(num, -0.35, 0);
      s.scale.set(0.3, 0.3, 0.3);
      makeSmoke(s);
      crates[i].add(s);
    }
    scene.add(crates[i]); // Add them all to our scene
  }

  // ## Create atmosphere particles
  for (let i = 0; i < particleAmount; i++) {
    var psize = (Math.random() * particleMaxSize) / 100; // Create a random particle size
    var p = new THREE.CircleGeometry(psize, psize, psize); // Create the particle geometry
    let pm = new THREE.Mesh(p, particleMaterial); // Creat the particle mesh
    pm.position.set(
      -Math.random() * 50 + 20,
      Math.random() * 7,
      -Math.random() * 100 + 10
    ); // Position random
    particles.push(pm); // Push particles to an array
    scene.add(pm); // Add the particles to our scene
  }

  // ## Reposition scene
  scene.position.set(0, -1, 0);
}

// ## Now lets create a timeline for each crate then store it in an array
function timelines() {
  for (let i = 0; i < crates.length; i++) {
    var obj = crates[i];
    var translate = obj.geometry.parameters.width;
    var position = translate / 2 - i * crateOffset + sceneOffset + 1;
    var positionOpposite = -(translate / 2 + i * crateOffset - sceneOffset) + 1;
    var tl = new TimelineMax({
      delay: rockAnimationDelay,
    });
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationOne, {
        x: rockAnimationRotationOne,
        ease: Circ.easeInOut,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationTwo, {
        x: rockAnimationRotationTwo,
        onComplete: switchAnchor,
        onCompleteParams: [obj, -translate, position, 0],
        ease: Expo.easeIn,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationThree, {
        x: rockAnimationRotationThree,
        ease: Expo.easeOut,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationFour, {
        x: rockAnimationRotationFour,
        onComplete: switchAnchor,
        onCompleteParams: [obj, translate, positionOpposite, 0],
        ease: Expo.easeIn,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationFive, {
        x: rockAnimationRotationFive,
        ease: Expo.easeOut,
      })
    );
    tl.add(
      TweenLite.to(crates[i].rotation, rockAnimationDurationSix, {
        x: rockAnimationRotationSix,
        onComplete: switchAnchor,
        onCompleteParams: [obj, 0, positionOpposite, 1],
        ease: Expo.easeIn,
      })
    );
  }
}

let smokeAnims = [];
// ## Create smoke
function makeSmoke(obj) {
  let stl = new TimelineMax({});
  stl.add([
    TweenLite.to(obj.scale, 0.5, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      ease: Expo.easeOut,
    }),
    TweenLite.fromTo(
      obj.material,
      0.5,
      {
        opacity: 1,
      },
      {
        opacity: 0,
      }
    ),
    TweenLite.to(obj.position, 0.5, {
      x: obj.position.x,
      y: 0.02 + Math.random() * 1.3,
      z: obj.position.z + Math.random() * 1.3,
      ease: Expo.easeOut,
    }),
  ]);
  smokeAnims.push(stl);
  stl.stop();
}
function playSmoke() {
  for (let i = 0; i < smokeAnims.length; i++) {
    let s = smokeAnims[i];
    setTimeout(function () {
      s.restart();
    }, 1400);
  }
}

// ## Switch crate anchor
function switchAnchor(object, tZ, pZ, int) {
  object.geometry.translate(0, 0, tZ); // Change crate translation
  object.position.set(0, 0, pZ); // Chage crate position
  can_click = int; // Allow user to click again
}

// ## Animate the scene
function animateScene() {
  requestAnimationFrame(animateScene);
  render();
}

// ## Start everything up!
startScene();
animateScene();

// ## Window resize
function onWindowResize() {
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight;
  renderer.setSize(canvasWidth, canvasHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  render();
}

// ## Crate information array
let crateInfoArray = [
  {
    name: "Noob loot crate", // First crate
    text: "You probably wont get much in this loot crate to be honest, but what can you expect for such a low cost?",
    price: "20,000",
  },
  {
    name: "Novice loot crate", // Second crate
    text: "This loot crate will contain a few relatively decent items that you can show off to your friends",
    price: "49,999",
  },
  {
    name: "Pro loot crate", // Third crate
    text: "Now we are talking, this crate contains loot for the professional player, weapons and items galore",
    price: "119,999",
  },
  {
    name: "God loot crate", // Fourth crate
    text: "Takes pay to win to a new level. Destroy your oppenents with this ultimate loot crate. Instawin",
    price: "999,999",
  },
];

// ## Update info box content
function crateInfo(crate) {
  $(".box").fadeOut(function () {
    // fade box out then...
    $(".box_inner__title").text(crateInfoArray[crate].name); // Change crate name
    $(".box_inner__text").text(crateInfoArray[crate].text); // Change crate description
    $(".box_inner__cost .right").text(crateInfoArray[crate].price); // Change crate Cost
  });
  setTimeout(function () {
    $(".box").fadeIn(); // Fade box back in
  }, 2000);
}

// ## Create a function that will animate the camera along the z axis
function moveCamera(amount) {
  var z = camera.position.z; // Init z
  var move = z + amount; // What point to move to
  TweenMax.to(camera.position, cameraMoveSpeed, {
    // Animate camera to point
    z: move,
    ease: Expo.easeInOut,
    delay: cameraMoveDelay,
  });
  TweenMax.to(forestPanelMid.position, cameraMoveSpeed, {
    // Animate camera to point
    x: forestPanelMid.position.x - amount / parallaxMidModifier,
    ease: Expo.easeInOut,
    delay: cameraMoveDelay,
  });
  setTimeout(function () {}, slidePlayDelay);
}

// ## User interaction
$(".button").click(function () {
  if (can_click == 1 && $(this).hasClass("left") && position > 0) {
    moveCamera(crateOffset); // Move the camera
    position--; // Decrease our position in the slider
    crateInfo(position); // Update crate info
  } else if (
    can_click == 1 &&
    $(this).hasClass("right") &&
    position < crates.length - 1
  ) {
    can_click = 0; // First of all lets stop the user from clicking again and messing things up
    moveCamera(-crateOffset); // Move the camera
    position++; // Increase our position in the slider
    timelines(); // Play the animation of the crate rocking
    playSmoke(); // Play smoke
    crateInfo(position); // Update crate info
  }
});

// ## Go
function render() {
  let p = 0;
  $.each(particles, function () {
    // Each particle in our array
    particles[p].position.y += (Math.random() * 10) / 1000; // Update the y position
    if (particles[p].position.y > 7) {
      // If its out of view...
      particles[p].position.y = 0; // Reset particle position
    }
    p++;
  });
  renderer.render(scene, camera); // Render
}

$(document).on("mousemove", function (e) {
  var x = -(($(window).innerWidth() / 2 - e.pageX) / 6000) + cameraX; // Get current mouse x
  var y = -(($(window).innerWidth() / 2 - e.pageY) / 6000 - cameraY); // Get current mouse x
  camera.position.x = x; // Update cam x
  camera.position.y = y; // Update cam y
});

function deep_ui() {
  var global_perspective = 800; // Global perspective set to parent
  var pivot = 50; // The higher this number the more subtle the pivot effect
  var debug = false; // Shows various debug information
  var animation_delay = 100; // Delay before animation starts cannot be 0. In ms.
  var animation_easing = "ease"; // Animation easing
  var deep_parent = $("*[data-deep-ui='true']"); // Parent with deep active
  var deep_element = $("[data-depth]"); // Elements with depth
  deep_parent.each(function () {
    $(this).css({
      perspective: global_perspective + "px",
      "transform-style": "preserve-3d",
    });
    set_depth();
  });
  function set_depth() {
    deep_element.each(function () {
      $(this).css({
        transform: "translatez(" + $(this).data("depth") + "px)",
        "transform-style": "preserve-3d", // Set CSS to all elements
      });
    });
  }
  $(document).on("mousemove", function (e) {
    var x = -($(window).innerWidth() / 2 - e.pageX) / pivot; // Get current mouse x
    var y = ($(window).innerHeight() / 2 - e.pageY) / pivot; // Get current mouse y
    deep_parent.css("transform", "rotateY(" + x + "deg) rotateX(" + y + "deg)"); // Set parent element rotation
  });
}

// Init
deep_ui();

// Full screen mode
function fullscreen() {
  document.documentElement.webkitRequestFullscreen();
  document.documentElement.mozRequestFullScreen();
  document.documentElement.msRequestFullscreen();
  document.documentElement.requestFullscreen();
}

$(".fullscreen").click(function () {
  fullscreen();
});
