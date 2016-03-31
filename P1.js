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

var health = 100, points = 0;

var ambient;

var ceiling, floor;

var fps = 60;

var isInProgress = true;

var clock;

var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 0, 6, 0, 3, 6, 0, 2, 1,],
    [1, 0, 0, 1, 1, 1, 1, 1, 1,],
    [1, 6, 5, 3, 6, 3, 5, 6, 1,],
    [1, 1, 1, 1, 1, 1, 0, 0, 1,],
    [1, 6, 5, 3, 6, 3, 5, 6, 1,],
    [1, 0, 0, 1, 1, 1, 1, 1, 1,],
    [1, 6, 5, 3, 6, 3, 5, 6, 1,],
    [1, 1, 1, 1, 1, 1, 0, 0, 1,],
    [1, 6, 5, 3, 6, 3, 5, 6, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1,],



], mapW = map.length;
init();
animate();

var crabs, bullets;
var projector;
var overlay;

function createOverlay(mainCanvas)
{
    var canvasContainer = document.getElementById('container');
    var overlayCanvas = document.createElement('canvas');
    overlayCanvas.style.zIndex="1000";
    overlayCanvas.style.position = 'absolute';
    overlayCanvas.style.left = '0px';
    overlayCanvas.style.top = '0px';
    overlayCanvas.width = mainCanvas.clientWidth;
    overlayCanvas.height = mainCanvas.clientHeight;
    canvasContainer.appendChild(overlayCanvas);
    return overlayCanvas;
}

function drawOverlay() {
    var context = overlay.getContext('2d');
    context.clearRect(0, 0, overlay.width, overlay.height);
    var x = 10;
    var y = overlay.height - 60;
    context.font = "20pt Calibri";
    context.fillStyle = "#FFFF00";
    context.fillText("Points: "+points+ "               Health: "+health+ "             FPS:"+parseInt(fps), x, y);

    context.fillStyle = "#0000ff";
    for (var i = 0; i < mapW; i++) {
        for (var j = 0, m = map[i].length; j < m; j++) {
            if (map[i][j] == 1) {

                context.fillRect(i*20, j*20, 20, 20);

            }
        }
    }

    context.fillStyle = "#32CD32";
    context.fillRect(camera.position.x/5, camera.position.z/5, 20, 20);

    context.fillStyle = "#FFFF00";
    for(var i = 0; i < crabs.length; i++)
    {
        context.fillRect(crabs[i].location.x/5, crabs[i].location.z/5, 20, 20);
    }

    context.restore();
}

function init() {

    clock = new THREE.Clock(true);
    projector = new THREE.Projector();

    crabs = [];
    bullets = [];

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 7000 );

    // scene

    scene = new THREE.Scene();



    ambient = new THREE.AmbientLight();
    ambient.color.setRGB(0.75, 0.705, 0.645);
    scene.add( ambient );

    var geometry = new THREE.CubeGeometry( WALLSIZEX, WALLSIZEY, WALLSIZEZ);
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('wall-1.jpg') } );

    var floorgeometry = new THREE.CubeGeometry( 1200, 10, 1200);
    var floormaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('ground_pebble_0057_01.jpg') } );

    floor = new THREE.Mesh(floorgeometry, floormaterial );
    floor.position.y = -50;
    floor.position.x = 500;
    floor.position.z = 500;

    scene.add(floor);

    var ceilinggeometry = new THREE.CubeGeometry( 1200, 10, 1200);
    var ceilingmaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('1_7990x5696.jpg') } );

    ceiling = new THREE.Mesh(ceilinggeometry, ceilingmaterial );
    ceiling.position.y = 50;
    ceiling.position.x = 500;
    ceiling.position.z = 500;

    scene.add(ceiling);

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
                crab.createCrab(new THREE.Vector3(i*WALLSIZEX, -15, j*WALLSIZEY), scene);

                crabs.push(crab);
            }
            if (map[i][j] == 6)
            {
                var light1 = new THREE.PointLight( Math.random() * 0xFFFFFF, 5, 100 );
                light1.position.set(i*WALLSIZEX, 15, j*WALLSIZEY);
                scene.add( light1 );
            }
        }
    }

    var mycanvas = document.getElementsByTagName("canvas")[0];
    var w = mycanvas.clientWidth;
    var h = mycanvas.clientHeight;

    if (!overlay)
        overlay = createOverlay(mycanvas);

    renderer = new THREE.WebGLRenderer({canvas:mycanvas});
    renderer.setSize( w, h );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener('keydown',onDocumentKeyDown,false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    //

    window.addEventListener( 'resize', onWindowResize, false );

    camera.lookAt( scene.position );

}

function isCollideWithMap(object) {
    for (var i = 0; i < mapW; i++) {
        for (var j = 0, m = map[i].length; j < m; j++) {
            if (map[i][j] == 1) {
                if(object.position.x >= (i-0.5)*WALLSIZEX && object.position.x <= (i+0.5)*WALLSIZEX)
                {
                    if(object.position.z >= (j-0.5)*WALLSIZEY && object.position.z <= (j+0.5)*WALLSIZEY)
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

function onDocumentMouseDown(e){

    var mouseVector = new THREE.Vector3(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1,
        1 );

    projector.unprojectVector( mouseVector, camera );
    var raycaster = new THREE.Raycaster( camera.position, mouseVector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( scene.children );

    if(intersects[0] != null)
    {
        var bullet = new Bullet();
        var cameraPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
        var movementVector = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
        movementVector.sub(cameraPos);

        bullet.createBullet(cameraPos, movementVector, scene);
        bullets.push(bullet);
    }
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

            if(isCollideWithMap(camera))
            {
                camera.position.x = camera.position.x + delta*cameraLeftHandNormalized.x;
                camera.position.z = camera.position.z + delta*cameraLeftHandNormalized.z;
            }
            break;
        case 38 :
            camera.position.x = camera.position.x + delta*cameraLookAtNormalized.x;
            camera.position.z = camera.position.z + delta*cameraLookAtNormalized.z;

            if(isCollideWithMap(camera))
            {
                camera.position.x = camera.position.x - delta*cameraLookAtNormalized.x;
                camera.position.z = camera.position.z - delta*cameraLookAtNormalized.z;
            }

            break;
        case 39 :
            camera.position.x = camera.position.x + delta*cameraLeftHandNormalized.x;
            camera.position.z = camera.position.z + delta*cameraLeftHandNormalized.z;

            if(isCollideWithMap(camera))
            {
                camera.position.x = camera.position.x - delta*cameraLeftHandNormalized.x;
                camera.position.z = camera.position.z - delta*cameraLeftHandNormalized.z;
            }

            break;
        case 40 :
            camera.position.x = camera.position.x - delta*cameraLookAtNormalized.x;
            camera.position.z = camera.position.z - delta*cameraLookAtNormalized.z;

            if(isCollideWithMap(camera))
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

var counter = 0;
var timer = 0;

function animate() {

    if(isInProgress) {

        for (var i = 0; i < crabs.length; i++) {
            crabs[i].animate(map, mapW, bullets);
        }

        for (var i = 0; i < bullets.length; i++) {
            bullets[i].animate(ceiling.position.y, floor.position.y);
        }
        
        var delta = parseInt(clock.getElapsedTime());
        if(delta == timer)
        {
            timer++;
            fps = counter;
            counter = 0;
        }



        drawOverlay();


        requestAnimationFrame(animate);
        render();
        mouseCorrection()
        camera.position.y = 0;

        ambient.color.setRGB(ambient.color.r - 0.0005, ambient.color.g - 0.0005, ambient.color.b - 0.0005);

        counter++;
    }

    if(health <= 0 || points >= 4)
    {
        isInProgress = false;
        health <= 0 ? drawGameOverOverlay() : drawYouWinOverlay();
        scene = null;
    }

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

function drawGameOverOverlay() {
    var context = overlay.getContext('2d');
    context.clearRect(0, 0, overlay.width, overlay.height);
    var x = 100;
    var y = 160;
    context.font = "54pt Calibri";
    context.fillStyle = "#0000ff"; // text color
    context.fillText("GAME OVER!", x, y);
    context.restore();
}

function drawYouWinOverlay() {
    var context = overlay.getContext('2d');
    context.clearRect(0, 0, overlay.width, overlay.height);
    var x = 100;
    var y = 160;
    context.font = "54pt Calibri";
    context.fillStyle = "#0000ff"; // text color
    context.fillText("YOU WIN!", x, y);
    context.restore();
}