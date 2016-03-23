THREE.Object3D.prototype.setMatrix = function(a) {
    this.matrix=a;
    this.matrix.decompose(this.position,this.quaternion,this.scale);
}

var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var WALLSIZEX = 100, WALLSIZEY = 100, WALLSIZEZ=200;

var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 0, 0, 0, 0, 0, 0, 2, 1,],
    [1, 0, 0, 1, 1, 1, 1, 1, 1,],
    [1, 3, 0, 0, 0, 0, 0, 0, 1,],
    [1, 1, 1, 1, 1, 1, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 3, 1,],
    [1, 0, 0, 1, 1, 1, 1, 1, 1,],
    [1, 3, 0, 0, 0, 0, 0, 0, 1,],
    [1, 1, 1, 1, 1, 1, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 3, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1,],



], mapW = map.length, mapH = map[0].length;
init();
animate();

var crabs;

function init() {

    crabs = [];

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 7000 );

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
        //scene.add( object );

    });

    var geometry = new THREE.CubeGeometry( WALLSIZEX, WALLSIZEY, WALLSIZEZ);
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('wall-1.jpg') } );

    var floorgeometry = new THREE.CubeGeometry( 1200, 10, 1200);
    var floormaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('ground_pebble_0057_01.jpg') } );

    var floor = new THREE.Mesh(floorgeometry, floormaterial );
    floor.position.y = -50;
    floor.position.x = 500;
    floor.position.z = 500;

    scene.add(floor);

    var ceilinggeometry = new THREE.CubeGeometry( 1200, 10, 1200);
    var ceilingmaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('1_7990x5696.jpg') } );

    var ceiling = new THREE.Mesh(ceilinggeometry, ceilingmaterial );
    ceiling.position.y = 50;
    ceiling.position.x = 500;
    ceiling.position.z = 500;

    scene.add( ceiling );

    for (var i = 0; i < mapW; i++) {
        for (var j = 0, m = map[i].length; j < m; j++) {
            if (map[i][j] == 1) {
                var mesh = new THREE.Mesh(geometry, material );
                mesh.position.x = i*WALLSIZEX;
                mesh.position.z = j*WALLSIZEY;
                scene.add( mesh );
            }
            if (map[i][j] == 2)
            {
                camera.position.x = i*WALLSIZEX;
                camera.position.z = j*WALLSIZEY;
            }
            if (map[i][j] == 3)
            {
                var crab = new Crab();
                crab.createCrab(new THREE.Vector3(i*WALLSIZEX, 0, j*WALLSIZEY), scene);

                crabs.push(crab);
            }
        }
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener('keydown',onDocumentKeyDown,false);
    //

    window.addEventListener( 'resize', onWindowResize, false );

    camera.lookAt( scene.position );

}

function isCollide() {
    for (var i = 0; i < mapW; i++) {
        for (var j = 0, m = map[i].length; j < m; j++) {
            if (map[i][j] == 1) {
                if(camera.position.x >= (i-0.5)*WALLSIZEX && camera.position.x <= (i+0.5)*WALLSIZEX)
                {
                    if(camera.position.z >= (j-0.5)*WALLSIZEY && camera.position.z <= (j+0.5)*WALLSIZEY)
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;
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
    camera.lookAt.z = cameraLookAt.z;
    camera.lookAt.y = 0;
    camera.lookAt(cameraLookAt);

    prevX = mouseX;
    prevY = mouseY;

}

var cameraPrevX, cameraPrevZ;

function onDocumentKeyDown(event) {

    var delta = 10;

    event = event || window.event;
    var keycode = event.keyCode;

    var cameraLookAt = new THREE.Vector3(camera.lookAt.x, camera.lookAt.y, camera.lookAt.z);
    var cameraPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

    cameraLookAt.subVectors(cameraLookAt , cameraPosition);
    cameraPrevX = cameraLookAt.x;
    cameraPrevZ = cameraLookAt.Z;

    var cameraLeftHand = new THREE.Vector3();
    cameraLeftHand.crossVectors(cameraLookAt, camera.up);

    var cameraLookAtNormalized = cameraLookAt.normalize();
    var cameraLeftHandNormalized = cameraLeftHand.normalize();

    switch (keycode) {
        case 37 :
            camera.position.x = camera.position.x - delta*cameraLeftHandNormalized.x;
            camera.position.z = camera.position.z - delta*cameraLeftHandNormalized.z;

            if(isCollide())
            {
                camera.position.x = camera.position.x + delta*cameraLeftHandNormalized.x;
                camera.position.z = camera.position.z + delta*cameraLeftHandNormalized.z;
            }
            break;
        case 38 :
            camera.position.x = camera.position.x + delta*cameraLookAtNormalized.x;
            camera.position.z = camera.position.z + delta*cameraLookAtNormalized.z;

            if(isCollide())
            {
                camera.position.x = camera.position.x - delta*cameraLookAtNormalized.x;
                camera.position.z = camera.position.z - delta*cameraLookAtNormalized.z;
            }

            break;
        case 39 :
            camera.position.x = camera.position.x + delta*cameraLeftHandNormalized.x;
            camera.position.z = camera.position.z + delta*cameraLeftHandNormalized.z;

            if(isCollide())
            {
                camera.position.x = camera.position.x - delta*cameraLeftHandNormalized.x;
                camera.position.z = camera.position.z - delta*cameraLeftHandNormalized.z;
            }

            break;
        case 40 :
            camera.position.x = camera.position.x - delta*cameraLookAtNormalized.x;
            camera.position.z = camera.position.z - delta*cameraLookAtNormalized.z;

            if(isCollide())
            {
                camera.position.x = camera.position.x + delta*cameraLookAtNormalized.x;
                camera.position.z = camera.position.z + delta*cameraLookAtNormalized.z;
            }

            break;
        case 32 :
            resetCamera();
    }

    renderer.render( scene, camera );

}
//

function animate() {

    requestAnimationFrame( animate );
    render();
    mouseCorrection()
    camera.position.y = 0;

    //crab.move(new THREE.Vector3(0,0,1));

}

function mouseCorrection()
{
    if(windowHalfX - Math.abs(mouseX*2) <= 80)
    {
        var cameraLookAt = new THREE.Vector3(camera.lookAt.x, camera.lookAt.y, camera.lookAt.z);
        var cameraPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

        cameraLookAt.subVectors(cameraLookAt , cameraPosition);
        mouseX > 0 ? cameraLookAt.applyAxisAngle( new THREE.Vector3(0,1,0), -Math.PI/360 ) : cameraLookAt.applyAxisAngle( new THREE.Vector3(0,1,0), Math.PI/360 );
        cameraLookAt.addVectors(cameraPosition, cameraLookAt);

        camera.lookAt.x = cameraLookAt.x;
        camera.lookAt.z = cameraLookAt.z;
        camera.lookAt.y = 0;
        camera.lookAt(cameraLookAt);
    }

}

function render() {

    renderer.render( scene, camera );

}

function resetCamera(){
    camera.lookAt.x = cameraPrevX;
    camera.lookAt.y = cameraPrevZ;
    camera.lookAt.z = 0;
    camera.lookAt(new THREE.Vector3(0,0,0));
}