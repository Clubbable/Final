/**
 * Created by MartinLiu on 2016-03-23.
 */
function Crab(){

    this.location = new THREE.Vector3(CAMERASTARTX, CAMERASTARTY, CAMERASTARTZ);
    this.headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,0, 0,0,1,17, 0,0,0,1);

    this.crabTorso;
    this.crabHead;

    this.createCrab = function(location, scene)
    {
        this.location = location;

        var torsoGeometry = Helper.createGeometry(new THREE.Matrix4().set(20,0,0,0, 0,20,0,0, 0,0,32,0, 0,0,0,1));
        var torsoMatrix = new THREE.Matrix4().set(1,0,0,this.location.x, 0,1,0,this.location.y, 0,0,1,this.location.z, 0,0,0,1);
        var normalMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('1_7990x5696.jpg') } );

        var headGeometry = Helper.createGeometry(new THREE.Matrix4().set(13,0,0,0, 0,13,0,0, 0,0,8,0, 0,0,0,1));
        var headMatrixRelativeToTorso =  Helper.createObjectMatrixRelativeTo(torsoMatrix, this.headMatrix, 0,0,0);

        var torso = Helper.addObjectToScene(torsoGeometry, torsoMatrix, normalMaterial, scene);
        this.crabTorso = torso;

        var head = Helper.addObjectToScene(headGeometry, headMatrixRelativeToTorso, normalMaterial, scene);
        this.crabHead = head;
    }

    this.getLocation = function()
    {
        return this.location;
    }

    this.move = function(deltaMove)
    {
        this.location.addVectors(this.location, deltaMove);

        var torsoMatrix = new THREE.Matrix4().set(1,0,0,this.location.x, 0,1,0,this.location.y, 0,0,1,this.location.z, 0,0,0,1);
        this.crabTorso.setMatrix(torsoMatrix);

        var headMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, this.headMatrix);
        this.crabHead.setMatrix(headMatrix);
    }
}