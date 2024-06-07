import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 15);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 




// function createTerrain(){
// const groundGeo = new THREE.PlaneGeometry(1000,1000, sliders.widthSeg, sliders.heightSeg);

// let disMap = new THREE.TextureLoader()
//     .setPath("536ws.jpg")
//     .load(sliders.heightMap);

//     disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
//     disMap.repeat.set(sliders.horTexture, sliders.vertTexture);

//     const groundMat = new THREE.MeshStandardMaterial ({

//         color:0x000000,
//         wireframe:true,
//         displacementMap: disMap,
//         displacementScale: sliders.dispScale,
//     });


//     groundMesh = new THREE.Mesh(groundGeo, groundMat);
//     scene.add(groundMesh);
//     groundMesh.rotation.x = -Math.PI / 2;
//     groundMesh.position.y = -0.5;


// }
// createTerrain();
const planeGeometry = new THREE.PlaneGeometry(736, 460, 100, 100);
const textureLoader = new THREE.TextureLoader();

console.log('Loading heightmap...');
const heightmapTexture = textureLoader.load('heightMap.jpg', () => {
    console.log('Heightmap loaded successfully.');
});
const texture = textureLoader.load( 'clean-wall-texture.jpg', function ( texture ) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 100, 100 );

} );

console.log('Creating plane material...');
const planeMaterial = new THREE.MeshStandardMaterial({
   map:texture,
    displacementMap: heightmapTexture, 
    displacementScale: -100, 
    wireframe: true 
});
console.log('Plane material created.');


console.log('Creating plane mesh...');
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; 


scene.add(plane);
console.log('Plane mesh created and added to scene.');


const playerGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const otherPlayerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff , wireframe: true});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.5;
scene.add(player);


//hehehehehe github wadaaa
const playerSpeed = 0.5;
const playerNSpeed = -0.5;
const keys = {};

function handleKeyDown(event) {
    keys[event.keyCode] = true;
}

function handleKeyUp(event) {
    keys[event.keyCode] = false;
}

function animatePlayer() {
    controls.update(); 
    // if (keys[87]) { player.position.z -= playerSpeed; }
    // if (keys[83]) { player.position.z += playerSpeed; }
    // if (keys[65]) { player.position.x -= playerSpeed; }
    // if (keys[68]) { player.position.x += playerSpeed; }

// axis eka vector3 ekak wenna hadanna
// rotateOnAxis(axis, speed);
if (keys[67]){
player.translateY(playerSpeed);

}
if (keys[66]){
    player.translateY(playerNSpeed);
    
    }
    else if (keys[65]) {
        // player.position.x += -(playerSpeed);

        player.translateX(playerNSpeed);
        player.rotation.y += 0.05;
    } else if (keys[68]) {
        // player.position.x += playerSpeed;

        player.translateX(playerSpeed);
        player.rotation.y -= 0.05;
    } else if (keys[87]) {
        // player.position.z += -(playerSpeed);

        player.translateZ(playerNSpeed);
    } else if (keys[83]) {
        // player.position.z += playerSpeed;

        player.translateZ(playerSpeed);
    }



    socket.emit('playerCoordinates', { x: player.position.x, y: player.position.y, z: player.position.z });
    camera.position.copy(player.position);
    // camera.position.add(new THREE.Vector3(1.5, 0, 0));
    camera.lookAt(player.position);
    // camera.position.y = player.position.y + 1;
    camera.rotation.y = player.rotation.y;
    camera.position.add(new THREE.Vector3(0, 1, 0));

    requestAnimationFrame(animatePlayer);
    renderer.render(scene, camera);
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
animatePlayer();

const otherPlayers = new Map();

socket.on('otherPlayerCoordinates', (coordinates) => {
    if (otherPlayers.has(coordinates.id)) {
        const otherPlayerMesh = otherPlayers.get(coordinates.id);
        otherPlayerMesh.position.set(coordinates.x, coordinates.y, coordinates.z);
    } else {
        const otherPlayerMesh = new THREE.Mesh(playerGeometry, otherPlayerMaterial);
        otherPlayerMesh.position.set(coordinates.x, coordinates.y, coordinates.z);
        scene.add(otherPlayerMesh);
        otherPlayers.set(coordinates.id, otherPlayerMesh);
    }
});
const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
const skyMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('paka.jpg'),
    side: THREE.BackSide 
});
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);