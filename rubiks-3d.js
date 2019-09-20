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

var RIGHT_FACE = [0,1];
var TOP_FACE = [4,5];
var FRONT_FACE = [8,9];
var LEFT_FACE = [2,3];
var BOTTOM_FACE = [6,7];
var BACK_FACE = [10,11];

var instructions = [];

var turns = [setXSideRotation, setYSideRotation, setZSideRotation]
var directions = [-1,1];
var sides = [0,2];

var speed = 1;

function setup() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);
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

function scramble() {
    for (var i = 0; i < 100; i++) {
        var inst = getRandomInteger(0,3);
        var dir = getRandomInteger(0,2);
        var side = getRandomInteger(0,2);
        addInstruction(turns[inst], directions[dir], sides[side]);
    }
}

function setSpeed(_speed) {
    if (!rotating) speed = _speed;
}

function addInstruction(instruction, direction, face) {
    instructions.push([instruction, direction, face]);
}

function forwardRoll() {
    for (var i = 0; i < 6; i++) {
        addInstruction(setXSideRotation, 1, 2);
        addInstruction(setYSideRotation, -1, 0);
        addInstruction(setXSideRotation, -1, 2);
        addInstruction(setYSideRotation, 1, 0);
    }
}

function reverseRoll() {
    for (var i = 0; i < 6; i++) {
        addInstruction(setYSideRotation, 1, 0);
        addInstruction(setXSideRotation, -1, 2);
        addInstruction(setYSideRotation, -1, 0);
        addInstruction(setXSideRotation, 1, 2);
    }
}

function animate() {
    requestAnimationFrame( animate );
    if (rotating) {
        rotateSide();
    } else {
        if (instructions.length > 0) {
            var f = instructions.shift();
            f[0](f[1], f[2]);
        }
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

function setXSideRotation(_direction, side) {
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
        if (Math.round(cubes[i].cube.position.x) == side) {
            rotationSide.push(cubes[i]);
        }
    }
}

function setYSideRotation(_direction, side) {
    if (rotating) {
        return;
    }
    rotationSide = [];
    rotationAmount = 0;
    rotationPoint = new THREE.Vector3(1, 2, 1);
    rotationAxes = new THREE.Vector3(0, 1, 0);
    rotating = true;
    direction = _direction;
    for (var i = 0; i < cubes.length; i++) {
        if (Math.round(cubes[i].cube.position.y) == side) {
            rotationSide.push(cubes[i]);
        }
    }
}

function setZSideRotation(_direction, side) {
    if (rotating) {
        return;
    }
    rotationSide = [];
    rotationAmount = 0;
    rotationPoint = new THREE.Vector3(1, 1, 2);
    rotationAxes = new THREE.Vector3(0, 0, 1);
    rotating = true;
    direction = _direction;
    for (var i = 0; i < cubes.length; i++) {
        if (Math.round(cubes[i].cube.position.z) == side) {
            rotationSide.push(cubes[i]);
        }
    }
}

function rotateSide() {
    for (var i = 0; i < rotationSide.length; i++) {
        rotateCubeAboutPoint(rotationSide[i], direction * speed);
    }
    rotationAmount += speed;
    if (rotationAmount == 90) {
        rotating = false;
        resetRotation();
    }
}

function resetRotation() {
    for (var i = 0; i < rotationSide.length; i++) {
        if (rotationAxes.x) {
            if (direction == 1) {
                var tempColour = rotationSide[i].cube.geometry.faces[BACK_FACE[0]].color;
                for (var j = 0; j < 2; j++) {
                    rotationSide[i].cube.geometry.faces[BACK_FACE[j]].color = rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color = rotationSide[i].cube.geometry.faces[FRONT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[FRONT_FACE[j]].color = rotationSide[i].cube.geometry.faces[TOP_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[TOP_FACE[j]].color = tempColour;
                }
            } else {
                var tempColour = rotationSide[i].cube.geometry.faces[TOP_FACE[0]].color;
                for (var j = 0; j < 2; j++) {
                    rotationSide[i].cube.geometry.faces[TOP_FACE[j]].color = rotationSide[i].cube.geometry.faces[FRONT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[FRONT_FACE[j]].color = rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color = rotationSide[i].cube.geometry.faces[BACK_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[BACK_FACE[j]].color = tempColour;
                }
            }
        }
        if (rotationAxes.y) {
            if (direction == 1) {
                var tempColour = rotationSide[i].cube.geometry.faces[FRONT_FACE[0]].color;
                for (var j = 0; j < 2; j++) {
                    rotationSide[i].cube.geometry.faces[FRONT_FACE[j]].color = rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color = rotationSide[i].cube.geometry.faces[BACK_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[BACK_FACE[j]].color = rotationSide[i].cube.geometry.faces[RIGHT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[RIGHT_FACE[j]].color = tempColour;
                }
            } else {
                var tempColour = rotationSide[i].cube.geometry.faces[RIGHT_FACE[0]].color;
                for (var j = 0; j < 2; j++) {
                    rotationSide[i].cube.geometry.faces[RIGHT_FACE[j]].color = rotationSide[i].cube.geometry.faces[BACK_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[BACK_FACE[j]].color = rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color = rotationSide[i].cube.geometry.faces[FRONT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[FRONT_FACE[j]].color = tempColour;
                }
            }
        }
        if (rotationAxes.z) {
            if (direction == 1) {
                var tempColour = rotationSide[i].cube.geometry.faces[RIGHT_FACE[0]].color;
                for (var j = 0; j < 2; j++) {
                    rotationSide[i].cube.geometry.faces[RIGHT_FACE[j]].color = rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color = rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color = rotationSide[i].cube.geometry.faces[TOP_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[TOP_FACE[j]].color = tempColour;
                }
            } else {
                var tempColour = rotationSide[i].cube.geometry.faces[TOP_FACE[0]].color;
                for (var j = 0; j < 2; j++) {
                    rotationSide[i].cube.geometry.faces[TOP_FACE[j]].color = rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[LEFT_FACE[j]].color = rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[BOTTOM_FACE[j]].color = rotationSide[i].cube.geometry.faces[RIGHT_FACE[j]].color;
                    rotationSide[i].cube.geometry.faces[RIGHT_FACE[j]].color = tempColour;
                }
            }
        }
        rotationSide[i].cube.rotation.set(0,0,0);
        rotationSide[i].line.rotation.set(0,0,0);
        rotationSide[i].cube.geometry.elementsNeedUpdate = true;
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
    setFaceColours(geometry);
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );
    var cube = new THREE.Mesh( geometry, material );
    var edges = new THREE.EdgesGeometry( geometry );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 5 } ) );
    scene.add(cube);
    scene.add(line);
    return {cube: cube, line: line}
}

function setFaceColours(geometry) {
    for (var i = 0; i < 2; i++) {
        geometry.faces[RIGHT_FACE[i]].color.setHex( 0xffa500 );
        geometry.faces[TOP_FACE[i]].color.setHex( 0x008000 );
        geometry.faces[FRONT_FACE[i]].color.setHex( 0xffffff );
        geometry.faces[LEFT_FACE[i]].color.setHex( 0xff0000 );
        geometry.faces[BOTTOM_FACE[i]].color.setHex( 0x0000ff );
        geometry.faces[BACK_FACE[i]].color.setHex( 0xffff00 );
    }
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

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}