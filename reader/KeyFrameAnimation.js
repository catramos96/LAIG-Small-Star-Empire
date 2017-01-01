/**
 * Descendent of MyAnimation
 */
function KeyFrameAnimation(id,time,controlPoints) {
    Animation.call(this,id,time);
    this.controlPoints = controlPoints;
}

KeyFrameAnimation.prototype = Object.create(Animation.prototype);

/**
 * Returns the position at the time received
 * @param time
 * @returns {Array}
 */
KeyFrameAnimation.prototype.getActualFrame = function(time)
{
    var curFrame = [];

    for(var i = 1; i < this.controlPoints.length; i++)
    {
        var t0 = this.controlPoints[i-1][0];
        var t1 = this.controlPoints[i][0];

        if(time >= t0 && time < t1) //pontos de controlo i-1 e i
        {
            for(var j = 1; j < 10; j++)  //tempo, rot, trans, scale
            {
                //interpolacao linear para cada elemento
                var p0 = this.controlPoints[i-1][j];
                var p1 = this.controlPoints[i][j];
                var res = p0 + (time - t0)*(p1 - p0)/(t1 - t0);
                curFrame.push(res);
            }
            break;
        }
    }
    return curFrame;
};

/**
 * Calculates the transformation at deltaTime
 */
KeyFrameAnimation.prototype.getTransformation = function(time){

    var transformation = new MyTransformation(this.id);	//new transformation

    //nova frame em funcao do tempo
    var frame = this.getActualFrame(time);

    transformation.translate(frame[0],frame[1],frame[2]);
    transformation.rotate('x',frame[3]*Math.PI/180);
    transformation.rotate('y',frame[4]*Math.PI/180);
    transformation.rotate('z',frame[5]*Math.PI/180);
    transformation.scale(frame[6],frame[7],frame[8]);

    return transformation;
};


/**
 * Prints information
 */
KeyFrameAnimation.prototype.printInfo = function(){

}