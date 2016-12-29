#ifdef GL_ES
precision highp float;
#endif

//valores que existem sempre :
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

//valores que vão ser enviados para o fragmento
varying vec2 vTextureCoord;

uniform float selected;
uniform float canMove;

void main() {

    //Determine the Z offset for the vertex
    vec3 offset=vec3(0.0,0.0,0.0);
    if(selected == 1.0 || canMove == 1.0)
    {
    	offset.z += 0.1;
    }

	vTextureCoord = aTextureCoord;

   	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

