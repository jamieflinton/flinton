
const canvas = document.querySelector('canvas');
THREE.ColorManagement.legacyMode = false
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(30, 2, 1, 10000);
camera.position.set(-5, -5, -5);
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas: canvas
});
const target = new THREE.WebGLRenderTarget(window.innerwWidth, window.innerHeight, {
  type: THREE.HalfFloatType,
  format: THREE.RGBAFormat,
  encoding: THREE.sRGBEncoding,
});
target.samples = 8
renderer.setPixelRatio( window.devicePixelRatio/1 );
renderer.setClearColor(0x000000, 0.0);
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
//document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true
controls.minPolarAngle = Math.PI / 2.25;
controls.maxPolarAngle =  Math.PI / 2.5;
controls.maxAzimuthAngle = Math.PI +2.9;
controls.minAzimuthAngle = Math.PI -0;
controls.enablePan = false;
controls.enableZoom = false;
controls.maxDistance = 10;
controls.minDistance = 5;
//controls.autoRotate = true;
const light = new THREE.PointLight(0xffffff, 0.75);
light.position.setScalar(10);
scene.add( light );
const light2 = new THREE.PointLight(0xffffff, 0.5);
light2.position.set(-10,0,0)
//light2.position.setScalar(10);
scene.add( light2 );
//scene.add(new THREE.AmbientLight(0xffffff, 0.25));

 //const helper = new THREE.PointLightHelper(light2);
   // scene.add(helper);


const mat02 = new THREE.MeshLambertMaterial({
toneMapped: false,
color: 0xff01ff,

})

new THREE.GLTFLoader().load('https://jamieflinton.github.io/Rocco/light.glb', function(glb) {

  const objBack = glb.scene; // sword 3D object is loaded
  	objBack.translateZ(0.05);
  	objBack.translateX(0.02);
  	objBack.translateY(0.01);
  	objBack.scale.set(10, 10, 10);
  const mat01 = new THREE.MeshLambertMaterial({
		toneMapped: false,
		emissive: 0xff0135,
		emissiveIntensity: 15,
	});
  objBack.traverse(n => { if ( n.isMesh ) {
       n.material = mat01;
       
  }});
  scene.add(objBack);
});

//var loader = new GLTFLoader();
new THREE.GLTFLoader().load('https://jamieflinton.github.io/Rocco/scene5.glb', function(glb) {
  const obj = glb.scene; 
  obj.scale.set(10, 10, 10);
  scene.add(obj);
});

new THREE.GLTFLoader().load('https://jamieflinton.github.io/Rocco/scene6.glb', function(glb) {

  const objglass = glb.scene; 
  var txt = new THREE.TextureLoader().load("https://jamieflinton.github.io/Rocco/uv.png");
  var new_mtl = new THREE.MeshBasicMaterial( { map: txt } );
	const mat03 = new THREE.MeshPhysicalMaterial({
		//metalness: 0.7,
   // clearcoat: 1,
    transparent: true,
		//opacity: 0.5,
   // reflectivity: 0.1,
    //depthWrite: false,
   // map: txt,
  })
  objglass.scale.set(10, 10, 10);
      objglass.traverse(n => { if ( n.isMesh ) {
       n.material = mat03;
       n.material.map = txt;
       n.material.map.flipY = false;
      }});
  scene.add(objglass);
});

/** COMPOSER */
const renderScene = new THREE.RenderPass(scene, camera);

const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 4, 0.85);
	bloomPass.threshold = 1;
	bloomPass.strength = 3.0;
	bloomPass.radius = 1;
	bloomPass.renderToScreen = true;


const composer = new THREE.EffectComposer(renderer, target);
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(bloomPass);

render();

function render() {
  requestAnimationFrame(render);

  composer.render();
	controls.update();

}
