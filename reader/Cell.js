/*
Class MyCell
*/
 function Cell(id,scene,texture,board,piece) {
     CGFobject.call(this,scene);
     this.scene = scene;
     this.id = id;
     this.board = board;    //apontador para o tabuleiro a que pertence
     this.piece = piece;    //apontador para a peca que ocupa esta celula
     this.selected = 0;

     this.appearance = new CGFappearance(scene);
	 this.appearance.setEmission(0,0,0,0);
 	 this.appearance.setAmbient(1,1,1,1);
	 this.appearance.setDiffuse(1,1,1,1);
	 this.appearance.setSpecular(1,1,1,1);
	 this.appearance.setShininess(100);
	 this.appearance.setTexture(texture);
	 this.appearance.setTextureWrap('REPEAT', 'REPEAT');

     this.defaultAppearance = new CGFappearance(scene);
     this.defaultAppearance.setEmission(0,0,0,0);
     this.defaultAppearance.setAmbient(1,1,1,1);
     this.defaultAppearance.setDiffuse(1,1,1,1);
     this.defaultAppearance.setSpecular(1,1,1,1);
     this.defaultAppearance.setShininess(100);
     this.defaultAppearance.setTextureWrap('REPEAT', 'REPEAT');

	 /*
        Esta appearance vai ter que ser definida no dsx
	 */

     this.cell = new MyCylinder(scene,new MyCylinderData(id,1,1,0.1,6,5));
 }

 Cell.prototype = Object.create(CGFobject.prototype);

 Cell.prototype.setSelected = function(selected) {
    this.selected = selected;
 }

 Cell.prototype.display = function() {
     this.board.cellShader.setUniformsValues({selected: this.selected});
     this.board.cellShader.setUniformsValues({uSampler: 0});

    this.scene.pushMatrix();
        this.scene.translate(1,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.appearance.apply();
        this.cell.display();
        this.defaultAppearance.apply();
    this.scene.popMatrix();
 };

Cell.prototype.displayPiece = function() {
    if(this.piece != null)
        this.piece.display();
}