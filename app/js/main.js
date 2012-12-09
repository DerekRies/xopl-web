var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth - 30, window.innerHeight - 15);
document.body.appendChild(renderer.domElement);

var geo = new THREE.CubeGeometry(1,1,1);
var mat = new THREE.MeshBasicMaterial({color: 0x00ff00 });
var cube = new THREE.Mesh(geo,mat);
scene.add(cube);

var light = new THREE.AmbientLight( 0xff0000 ); 
scene.add( light );

camera.position.z = 5;

function render(){
    requestAnimationFrame(render); 
    // cube.rotation.x += .05;
    var dist = camera.position.z - cube.position.z;
    cube.rotation.y += .01;
    renderer.render(scene, camera);

}



render();