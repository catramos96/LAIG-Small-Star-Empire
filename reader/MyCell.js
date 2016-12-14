/*
Class MyCell
*/
 function MyCell(id,scene,texture) {
     CGFobject.call(this,scene);
     this.scene = scene;
     this.id = id;
     
     this.appearance = new CGFappearance(scene);
	 this.appearance.setEmission(0,0,0,0);
 	 this.appearance.setAmbient(1,1,1,1);
	 this.appearance.setDiffuse(1,1,1,1);
	 this.appearance.setSpecular(1,1,1,1);
	 this.appearance.setShininess(100);
	 this.appearance.setTexture(texture);
	 this.appearance.setTextureWrap('REPEAT', 'REPEAT');

	 /*
        Esta appearance vai ter que ser definida no dsx
	 */
     

     this.cell = new MyCylinder(scene,new MyCylinderData(id,1,1,0.1,6,5));
 }

 MyCell.prototype = Object.create(CGFobject.prototype);

 MyCell.prototype.display = function() {
    this.scene.pushMatrix();
        this.scene.translate(1,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.appearance.apply();
        this.cell.display();
    this.scene.popMatrix();
 };