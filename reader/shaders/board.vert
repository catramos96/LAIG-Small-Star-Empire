#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec4 coords;

uniform float du;
uniform float dv;
uniform float su;
uniform float sv;

void main() {

	coords = vec4(aVertexPosition, 1.0);

	if((aTextureCoord.s >=(su/du) &&  aTextureCoord.s <=(su+1.0)/du) && 
		(aTextureCoord.t>=(sv/dv) &&  aTextureCoord.t <=(sv+1.0)/dv) && 
		su != -1.0 && sv != -1.0)
	  		coords.z = 0.03;

	gl_Position = uPMatrix * uMVMatrix * coords;

	vTextureCoord = aTextureCoord;
}

