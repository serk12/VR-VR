import * as THREE from './threejs.org/build/three.module.js';

import {
	BoxLineGeometry
} from './threejs.org/examples/jsm/geometries/BoxLineGeometry.js';
import {
	WEBVR
} from './threejs.org/examples/jsm/vr/WebVR.js';

var camera, scene, renderer;

var room, geometry;

var count = 0;
var radius = 0.08;
var normal = new THREE.Vector3();
var relativeVelocity = new THREE.Vector3();

var clock = new THREE.Clock();

init();
animate();

function set_position(decoded) {
	var polar = calculate_angle(decoded);
	var object = room.children[0];
	object.position.x = polar[0] * 10 * Math.cos(polar[1]);
	object.position.z = -polar[0] * 10 * Math.sin(polar[1]);
	object.position.y = 1;
	console.log(object.position.x);
	console.log(object.position.y);
}

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x505050);

	camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 20);

	room = new THREE.LineSegments(
		new BoxLineGeometry(6, 6, 6, 10, 10, 10),
		new THREE.LineBasicMaterial({
			color: 0x808080
		})
	);
	room.geometry.translate(0, 3, 0);
	scene.add(room);

	var light = new THREE.HemisphereLight(0xffffff, 0x444444);
	light.position.set(1, 1, 1);
	scene.add(light);

	var geometry = new THREE.IcosahedronBufferGeometry(radius, 2);
	var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
		color: Math.random() * 0xffffff
	}));
	object.position.x = 0;
	object.position.z = -3;
	object.position.y = 1;
	room.add(object);
	var request = new AudioFileRequest('./resources/rocket_LR.wav');
	request.onSuccess = set_position;
	request.send();

	//

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.vr.enabled = true;
	document.body.appendChild(renderer.domElement);

	//

	document.body.appendChild(WEBVR.createButton(renderer));

	// helpers

	geometry = new THREE.BufferGeometry();
	geometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3));
	geometry.addAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

	var material = new THREE.LineBasicMaterial({
		vertexColors: true,
		blending: THREE.AdditiveBlending
	});

	//

	window.addEventListener('resize', onWindowResize, false);

	window.addEventListener('keydown', function(event) {
		switch (event.code) {
			case 'KeyL':
				var object = room.children[Math.floor(Math.random() * (room.children.length))].clone();
				object.position.x += Math.random() * (Math.random() > 0.5) ? -1 : 1;
				object.position.y += Math.random() * (Math.random() > 0.5) ? -1 : 1;
				object.position.z += Math.random() * (Math.random() > 0.5) ? -1 : 1;
				room.add(object);
				animate();
				break;
		}
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	renderer.setAnimationLoop(render);
}

function render() {
	renderer.render(scene, camera);
}