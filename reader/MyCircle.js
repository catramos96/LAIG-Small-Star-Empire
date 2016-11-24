/**
 * MyCircle 
 * Constroi um circulo com numero de slices decidido pelo utilizador
 * @constructor
 */
function MyCircle(scene, slices) {
    CGFobject.call(this, scene);
    this.slices = slices;
    this.initBuffers();
}
;

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {
    
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    
    var ang = Math.PI * 2 / this.slices;
    
    //centro
    this.vertices.push(0, 0, 0);
    this.texCoords.push(0.5,0.5);
    this.normals.push(0, 0, 1);

    for (var i = 0; i < this.slices; i++) {
        this.texCoords.push(0.5+Math.cos(ang*i)/2,0.5-Math.sin(ang*i)/2);
        this.vertices.push(Math.cos(ang * i), Math.sin(ang * i), 0);
        this.normals.push(0, 0, 1);
        
        if (i % 2 != 0) {// a cada 2 vertices  
            this.indices.push(0, i, i + 1);
        } 
        if(i% 2 == 0){
             this.indices.push(0, i, i + 1);
        }
        if (i == this.slices - 1) {
          this.indices.push(0, i+1, 1);
            //último triangulo
        }
    }    
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;
