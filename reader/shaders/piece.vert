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

//valores que vao ser enviados para o fragmento
varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;
   	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}

