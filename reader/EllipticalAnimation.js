/**
 * Descendent of MyAnimation
 */
function EllipticalAnimation(id,time,pc,rx,rz,startAng,rotAng) {
    Animation.call(this,id,time);

    this.pc = pc;
    this.rx = rx;
    this.rz = rz;
    this.startAng = startAng*Math.PI/180;
    this.rotAng = rotAng*Math.PI/180;

    //var totalDist = this.r*this.rotAng;
    //this.vel = totalDist/this.time;

    this.w = this.rotAng/this.time;
}

EllipticalAnimation.prototype = Object.create(Animation.prototype);

/**
 * Calculates the transformation at deltaTime
 */
EllipticalAnimation.prototype.getTransformation = function(deltTime)
{
    transformation = new MyTransformation(this.id);

    var angAtual = this.startAng + this.w*deltTime; //angulo da distancia percorrida ate    agora

    transformation.translate(this.pc.getX(),this.pc.getY(),this.pc.getZ());
    transformation.translate(this.rx*Math.cos(angAtual), 0, this.rz*Math.sin(angAtual));
    //transformation.rotate('y',angAtual);

    return transformation;
}
