
function CameraAnimation(scene, cam1, cam2, initTime, totalTime) {
    this.scene = scene;
    this.cam1 = cam1;
    this.cam2 = cam2;
    this.initTime = initTime;
    this.totalTime = totalTime;
};


CameraAnimation.prototype.interpolate=function(deltaT,y0,y1)
{
    var y;
    if(this.span == 0)
    {
        y = y0;
    }
    else if(deltaT >= this.totalTime)
    {
        y = y1;
    }
    else
    {
        y = y0 + deltaT*(y1 - y0)/this.totalTime;
    }

    return y;
};

CameraAnimation.prototype.update=function(currTime)
{
    var deltaT = (currTime - this.initTime);

    for(var i = 0; i < 2; i++)
        this.scene.camera.position[i] = this.interpolate(deltaT,this.cam1.getFromVec()[i],this.cam2.getFromVec()[i]);

    for(var i = 0; i < 2; i++)
        this.scene.camera.target[i] = this.interpolate(deltaT,this.cam1.getToVec()[i],this.cam2.getToVec()[i]);

    if(deltaT > this.totalTime)
    {
        this.done = true;
    }

};