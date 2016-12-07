/*
Class MyCell
*/
 function MyCell(scene) {
     CGFobject.call(this,scene);
     this.scene = scene;

     this.cell = new MyCylinder(scene,new MyCylinderData("",1,1,0.1,6,5));
 }

 MyCell.prototype = Object.create(CGFobject.prototype);

 MyCell.prototype.display = function() {
    this.scene.pushMatrix();
        this.scene.translate(1,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.cell.display();
    this.scene.popMatrix();
 };