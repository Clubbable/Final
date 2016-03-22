
var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );

    // texture

    var manager = new THREE.LoadingManager();
    var texture = new THREE.Texture();

    var loader = new THREE.ImageLoader( manager );
    loader.load( 'wall-1.jpg', function ( image ) {

        texture.image = image;
        texture.needsUpdate = true;

    } );

    // model

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'male02.obj', function ( object ) {

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material.map = texture;

            }

        });

        object.position.y = - 95;
        scene.add( object );

    });

    var geometry = new THREE.CubeGeometry( 10, 10, 10);
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('wall-1.jpg') } );

    var mesh = new THREE.Mesh(geometry, material );
    mesh.position.y = -50;
    scene.add( mesh );

    //

    renderer = new THREE.WebGLRenderer();
    console.log("renderer ", renderer);
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener('keydown',onDocumentKeyDown,false);
    //

    window.addEventListener( 'resize', onWindowResize, false );

    camera.position.x = 50;
    camera.position.y = 50;

    camera.lookAt( scene.position );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

var prevX = 0, prevY = 0;

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

    var cameraLookAt = new THREE.Vector3(camera.lookAt.x, camera.lookAt.y, camera.lookAt.z);
    var cameraPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

    cameraLookAt.subVectors(cameraLookAt , cameraPosition);
    cameraLookAt.applyAxisAngle( new THREE.Vector3(0,1,0), -(mouseX - prevX)*Math.PI/1800 );
    cameraLookAt.applyAxisAngle( new THREE.Vector3(1,0,0), -(mouseY - prevY)*Math.PI/1800 );
    cameraLookAt.addVectors(cameraPosition, cameraLookAt);

    camera.lookAt.x = cameraLookAt.x;
    camera.lookAt.y = cameraLookAt.y;
    camera.lookAt.z = cameraLookAt.z;
    camera.lookAt(cameraLookAt);

    prevX = mouseX;
    prevY = mouseY;
}

function onDocumentKeyDown(event) {
    var delta = 10;
    event = event || window.event;
    var keycode = event.keyCode;

    var cameraLookAt = new THREE.Vector3(camera.lookAt.x, camera.lookAt.y, camera.lookAt.z);
    var cameraPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

    cameraLookAt.subVectors(cameraLookAt , cameraPosition);

    var cameraLeftHand = new THREE.Vector3();
    cameraLeftHand.crossVectors(cameraLookAt, camera.up);

    var cameraLookAtNormalized = cameraLookAt.normalize();
    var cameraLeftHandNormalized = cameraLeftHand.normalize();

    switch (keycode) {
        case 37 :
            camera.position.x = camera.position.x - delta*cameraLeftHandNormalized.x;
            camera.position.y = camera.position.y - delta*cameraLeftHandNormalized.y;
            camera.position.z = camera.position.z - delta*cameraLeftHandNormalized.z;
            break;
        case 38 :
            camera.position.x = camera.position.x + delta*cameraLookAtNormalized.x;
            camera.position.y = camera.position.y + delta*cameraLookAtNormalized.y;
            camera.position.z = camera.position.z + delta*cameraLookAtNormalized.z;
            break;
        case 39 :
            camera.position.x = camera.position.x + delta*cameraLeftHandNormalized.x;
            camera.position.y = camera.position.y + delta*cameraLeftHandNormalized.y;
            camera.position.z = camera.position.z + delta*cameraLeftHandNormalized.z;
            break;
        case 40 :
            camera.position.x = camera.position.x - delta*cameraLookAtNormalized.x;
            camera.position.y = camera.position.y - delta*cameraLookAtNormalized.y;
            camera.position.z = camera.position.z - delta*cameraLookAtNormalized.z;
            break;
    }

    renderer.render( scene, camera );

}
//

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    renderer.render( scene, camera );

}