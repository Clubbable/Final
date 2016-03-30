/**
 * Created by MartinLiu on 2016-03-30.
 */
function Bullet()
{
    this.position = new THREE.Vector3(0,0,0);
    this.movementVector = new THREE.Vector3(0,0,0);
    this.bullet;
    this.isDestroyed = false;

    this.createBullet = function(location, movementVector, scene)
    {
        this.position = location;
        this.movementVector = movementVector;

        var bulletGeometry = Helper.createGeometry(new THREE.Matrix4().set(5,0,0,0, 0,5,0,0, 0,0,5,0, 0,0,0,1));
        var bulletMatrix = new THREE.Matrix4().set(1,0,0,this.position.x, 0,1,0,this.position.y, 0,0,1,this.position.z, 0,0,0,1);
        var normalMaterial = new THREE.MeshNormalMaterial();

        this.bullet = Helper.addObjectToScene(bulletGeometry, bulletMatrix, normalMaterial, scene);

    }

    this.move = function()
    {
        if(!this.isDestroyed)
        {
            this.position.addVectors(this.position, this.movementVector.normalize().multiplyScalar(10));

            var bulletMatrix = new THREE.Matrix4().set(1,0,0,this.position.x, 0,1,0,this.position.y, 0,0,1,this.position.z, 0,0,0,1);
            this.bullet.setMatrix(bulletMatrix);
        }

    }

    this.animate = function(maxHeight, minHeight)
    {
        this.move();

        if(isCollideWithMap(this) || this.position.y > maxHeight || this.position.y < minHeight)
        {
            scene.remove(this.bullet);
            this.bullet = null;
            this.position = new THREE.Vector3(0,0,0);
            this.isDestroyed = true;
        }
    }
}