var scene;
var camera;
var renderer;
var cube;
var line;

function setup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    var edges = new THREE.EdgesGeometry( geometry );
    line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    scene.add( cube );
    scene.add( line );

    camera.position.z = 5;
    camera.position.y = 1;
    
    animate();
}

function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.z += 0.01;
    line.rotation.x += 0.01;
    line.rotation.z += 0.01;
	renderer.render( scene, camera );
}