/**
 * Created by MartinLiu on 2016-01-07.
 */
function Helper()
{

}

function makeCube() {
    var unitCube = new THREE.BoxGeometry(1,1,1);
    return unitCube;
}



Helper.createGeometry = function(geometryScale)
{
    var objectGeometry = makeCube();
    objectGeometry.applyMatrix(geometryScale);
    return objectGeometry;
}

Helper.createXAxisRotMatrixForDegree = function(degreeInRad)
{
    var rotate = new THREE.Matrix4().set(  1,        0,         0,        0,
                                            0, Math.cos(degreeInRad),-Math.sin(degreeInRad), 0,
                                            0, Math.sin(degreeInRad), Math.cos(degreeInRad), 0,
                                            0,        0,         0,        1);
    return rotate;
}

Helper.createYAxisRotMatrixForDegree = function(degreeInRad)
{
    var rotate = new THREE.Matrix4().set(  Math.cos(degreeInRad),       0,          Math.sin(degreeInRad),        0,
                                                        0,          1,          0,          0,
                                                        -Math.sin(degreeInRad),       0,          Math.cos(degreeInRad),        0,
                                                        0,          0,          0,          1);
    return rotate;
}

Helper.createObjectMatrixRelativeTo = function(relativeObjectMatrix, actualObjectMatrix, xRot, yRot, zRot)
{
    var actualMatrix = new THREE.Matrix4().multiplyMatrices(relativeObjectMatrix, actualObjectMatrix);
    actualMatrix.multiplyMatrices(actualMatrix, Helper.createYAxisRotMatrixForDegree(yRot));
    actualMatrix.multiplyMatrices(actualMatrix, Helper.createXAxisRotMatrixForDegree(xRot));

    return actualMatrix;
}

Helper.addObjectToScene = function(objectGeometry, objectMatrix, normal, scene)
{
    var objectInstance =  new THREE.Mesh(objectGeometry,normal);
    objectInstance.setMatrix(objectMatrix);
    console.log(objectMatrix);
    scene.add(objectInstance);

    return objectInstance;
}

