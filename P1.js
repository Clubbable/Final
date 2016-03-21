
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

    var ambient = new THREE.AmbientLight( 0x101030 );
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    scene.add( directionalLight );

    // texture

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    var texture = new THREE.Texture();

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {
    };


    var loader = new THREE.ImageLoader( manager );
    loader.load( 'textures/UV_Grid_Sm.jpg', function ( image ) {

        texture.image = image;
        texture.needsUpdate = true;

    } );

    // model

    var loader = new THREE.OBJLoader( manager );
    loader.load( 'obj/male02/male02.obj', function ( object ) {

        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material.map = texture;

            }

        } );

        object.position.y = - 95;
        scene.add( object );

    }, onProgress, onError );

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

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

function onDocumentKeyDown(event) {
    var delta = 10;
    event = event || window.event;
    var keycode = event.keyCode;
    switch (keycode) {
        case 37 : //left arrow 向左箭头
            camera.position.y -= delta;
            console.log(camera.position.y);
            break;
        case 38 : // up arrow 向上箭头
            camera.position.x = camera.position.x - delta;
            console.log(camera.position.x);
            break;
        case 39 : // right arrow 向右箭头
            camera.position.y = camera.position.y + delta;
            console.log(camera.position.y);
            break;
        case 40 : //down arrow向下箭头
            camera.position.x = camera.position.x + delta;
            console.log(camera.position.x);
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