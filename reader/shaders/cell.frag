#ifdef GL_ES
precision highp float;
#endif

//recebe do vertice
varying vec2 vTextureCoord;

//recebe do shader
uniform sampler2D uSampler;
uniform float selected;

void main() {

		vec4 color = texture2D(uSampler,vTextureCoord);

		if(selected == 1.0)
		{
		    color.g = 0.0;
		}

		gl_FragColor = color;
}