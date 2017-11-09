var scene, camera, renderer;

var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.01;

var cube = '';

function init() {
    scene = new THREE.Scene();

    initCube();
    initCamera();
    initRenderer();

    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(70, 2, 1, 10);
    camera.position.set(5, 5, 5);
    camera.lookAt(scene.position);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
}

function initCube() {
    cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial());
    scene.add(cube);

    // cube.rotation.y -=;
}

function camera_up() {
    camera.position.y += 0.1;
}

function camera_down() {
    camera.position.y -= 0.1;
}

function aspect_up() {
    camera.aspect += 1;
}

function aspect_down() {
    camera.aspect -= 1;
}


function render() {
    requestAnimationFrame(render);
    // rotateCube();
    renderer.render(scene, camera);
}


init();
render();