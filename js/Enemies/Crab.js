/**
 * Created by MartinLiu on 2016-03-23.
 */
function Crab(){

    this.location = new THREE.Vector3(0, 0, 0);

    this.crabTorso;
    this.crabHead;
    this.crabHead2;
    this.crabHead3;

    this.moveDir = 1;
    this.isDestroyed = false;

    this.createCrab = function(location, scene)
    {
        this.location = location;

        var torsoGeometry = Helper.createGeometry(new THREE.Matrix4().set(20,0,0,0, 0,20,0,0, 0,0,20,0, 0,0,0,1));
        var torsoMatrix = new THREE.Matrix4().set(1,0,0,this.location.x, 0,1,0,this.location.y, 0,0,1,this.location.z, 0,0,0,1);
        var normalMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('1_7990x5696.jpg') } );

        var headGeometry = Helper.createGeometry(new THREE.Matrix4().set(14,0,0,0, 0,14,0,0, 0,0,14,0, 0,0,0,1));
        var headMatrixRelativeToTorso =  new THREE.Matrix4().set(1,0,0,0, 0,1,0,15, 0,0,1,0, 0,0,0,1);;

        var head2Geometry = Helper.createGeometry(new THREE.Matrix4().set(8,0,0,0, 0,8,0,0, 0,0,8,0, 0,0,0,1));
        var head2MatrixRelativeToHead =  new THREE.Matrix4().set(1,0,0,0, 0,1,0,25, 0,0,1,0, 0,0,0,1);

        var head3Geometry = Helper.createGeometry(new THREE.Matrix4().set(2,0,0,0, 0,2,0,0, 0,0,2,0, 0,0,0,1));
        var head3MatrixRelativeToHead =  new THREE.Matrix4().set(1,0,0,0, 0,1,0,30, 0,0,1,0, 0,0,0,1);

        var torso = Helper.addObjectToScene(torsoGeometry, torsoMatrix, normalMaterial, scene);
        this.crabTorso = torso;

        var head = Helper.addObjectToScene(headGeometry, headMatrixRelativeToTorso, normalMaterial, scene);
        this.crabHead = head;

        var head2 = Helper.addObjectToScene(head2Geometry, head2MatrixRelativeToHead, normalMaterial, scene);
        this.crabHead2 = head2;

        var head3 = Helper.addObjectToScene(head3Geometry, head3MatrixRelativeToHead, normalMaterial, scene);
        this.crabHead3 = head3;

        this.crabTorso.add(this.crabHead);
        this.crabTorso.add(this.crabHead2);
        this.crabTorso.add(this.crabHead3);

    }

    this.move = function(deltaMove)
    {
        this.location.addVectors(this.location, deltaMove);

        var torsoMatrix = new THREE.Matrix4().set(1,0,0,this.location.x, 0,1,0,this.location.y, 0,0,1,this.location.z, 0,0,0,1);
        this.crabTorso.setMatrix(torsoMatrix);

    }

    this.animate = function(m, mapW, bullets)
    {
        if(!this.isDestroyed) {
            this.move(new THREE.Vector3(0, 0, 1 * this.moveDir));

            for (var i = 0; i < mapW; i++) {
                for (var j = 0, m = map[i].length; j < m; j++) {
                    if (map[i][j] == 5 &&
                        Math.abs(this.location.x - i * WALLSIZEX) <= 30 &&
                        Math.abs(this.location.z - j * WALLSIZEY) <= 30) {
                        this.moveDir *= -1;
                    }
                }
            }

            if (this.isCollide(bullets)) {
                health -= 25;
                this.destroy();
            }
        }
    }

    this.isCollide = function(bullets)
    {
        if(camera.position.x >= this.location.x - 10 && camera.position.x <= this.location.x+10)
        {
            if(camera.position.z >= this.location.z -10 && camera.position.z <= this.location.z+10)
            {
                return true;
            }
        }

        for(var i = 0; i < bullets.length; i++)
        {
            if(bullets[i].position.x >= this.location.x - 10 && bullets[i].position.x <= this.location.x+10)
            {
                if(bullets[i].position.z >= this.location.z -10 && bullets[i].position.z <= this.location.z+10)
                {
                    if(bullets[i].position.y >= this.location.y -10 && bullets[i].position.y <= this.location.y+50)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    this.destroy = function()
    {
        scene.remove(this.crabTorso);
        this.crabHead3 = null;
        this.crabHead2 = null;
        this.crabHead = null;
        this.crabTorso = null;
        this.location = new THREE.Vector3(-500, -500, -500);

        this.isDestroyed = true;

    }
}