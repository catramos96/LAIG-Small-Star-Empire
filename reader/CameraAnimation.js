/**
 * Object that handles the animation between 2 points of view
 * @param scene
 * @param cam1
 * @param cam2
 * @param initTime
 * @param totalTime
 * @constructor
 */
function CameraAnimation(scene, cam1, cam2, initTime, totalTime) {
    this.scene = scene;
    this.cam1 = cam1;       //perpective
    this.cam2 = cam2;       //perpective
    this.initTime = initTime;
    this.totalTime = totalTime;

    this.done = false;
};

/**
 * Interpolates the values, just like keyFrameAnimation
 * @param deltaTime
 * @param y0
 * @param y1
 * @returns {*}
 */
CameraAnimation.prototype.interpolate = function(deltaTime,y0,y1)
{
    return y0 + deltaTime*(y1 - y0)/this.totalTime
};

/**
 * Updates the camera position depending on currTime
 * @param currTime
 */
CameraAnimation.prototype.update = function(currTime)
{
    var deltaTime = (currTime - this.initTime);     //elapsed time

    //interpolated values 'from'
    for(var i = 0; i < 2; i++)
        this.scene.camera.position[i] = this.interpolate(deltaTime,this.cam1.getFromVec()[i],this.cam2.getFromVec()[i]);

    //interpolated values 'to'
    for(var i = 0; i < 2; i++)
        this.scene.camera.target[i] = this.interpolate(deltaTime,this.cam1.getToVec()[i],this.cam2.getToVec()[i]);

    //end
    if(deltaTime > this.totalTime)
    {
        this.done = true;
    }

};