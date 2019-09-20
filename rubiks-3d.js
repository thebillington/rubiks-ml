var scene;
var camera;
var renderer;

var CUBE_SIZE = 1;
var TOTAL_CUBE_SIZE = CUBE_SIZE * 3;
var BASE_LOC = 0;

var cubes = [];

var rotating = false;
var direction = 1;

var rotationAmount;
var rotationSide;
var rotationPoint;
var rotationAxes;

function setup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0,0,0));

    initRubiksCube(0, 0, 0);
    animate();
}

function animate() {
    requestAnimationFrame( animate );
    if (rotating) {
        rotateSide();
    }
	renderer.render( scene, camera );
}

function initRubiksCube(x, y, z) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                var thisCube = getBoxGeometery();
                setCubePosition(thisCube, BASE_LOC + (i * CUBE_SIZE), BASE_LOC + (j * CUBE_SIZE), BASE_LOC + (k * CUBE_SIZE));
                cubes.push(thisCube);
            }
        }
    }
}

function setRightSideRotation(_direction) {
    if (rotating) {
        return;
    }
    rotationSide = [];
    rotationAmount = 0;
    rotationPoint = new THREE.Vector3(2, 1, 1);
    rotationAxes = new THREE.Vector3(1, 0, 0);
    rotating = true;
    direction = _direction;
    for (var i = 0; i < cubes.length; i++) {
        if (cubes[i].cube.position.x == 2) {
            rotationSide.push(cubes[i]);
        }
    }
}

function rotateSide() {
    rotationAmount++;
    if (rotationAmount == 90) {
        rotating = false;
        return;
    }
    for (var i = 0; i < rotationSide.length; i++) {
        rotateCubeAboutPoint(rotationSide[i], direction);
    }
}

function moveCube(cube, dx, dy, dz) {
    cube.cube.position.x += dx;
    cube.cube.position.y += dy;
    cube.cube.position.z += dz;
    cube.line.position.x += dx;
    cube.line.position.y += dy;
    cube.line.position.z += dz;
}

function rotateCube(cube, rx, ry, rz) {
    cube.cube.rotation.x += rx;
    cube.cube.rotation.y += ry;
    cube.cube.rotation.z += rz;
    cube.line.rotation.x += rx;
    cube.line.rotation.y += ry;
    cube.line.rotation.z += rz;
}

function setCubePosition(cube, x, y, z) {
    cube.cube.position.x = x;
    cube.cube.position.y = y;
    cube.cube.position.z = z;
    cube.line.position.x = x;
    cube.line.position.y = y;
    cube.line.position.z = z;
}

function setCubeRotation(cube, x, y, z) {
    cube.cube.rotation.x = x;
    cube.cube.rotation.y = y;
    cube.cube.rotation.z = z;
    cube.line.rotation.x = x;
    cube.line.rotation.y = y;
    cube.line.rotation.z = z;
}

function rotateCubeAboutPoint(obj, theta, pointIsWorld) {
    rotateAboutPoint(obj.cube, rotationPoint, rotationAxes, THREE.Math.degToRad(theta), pointIsWorld);
    rotateAboutPoint(obj.line, rotationPoint, rotationAxes, THREE.Math.degToRad(theta), pointIsWorld);
}

function getBoxGeometery() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    var edges = new THREE.EdgesGeometry( geometry );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    scene.add(cube);
    scene.add(line);
    return {cube: cube, line: line}
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}