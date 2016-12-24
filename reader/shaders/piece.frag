#ifdef GL_ES
precision highp float;
#endif

//recebe do vertice
varying vec2 vTextureCoord;

//recebe do shader
uniform float selected;
uniform float team;
uniform sampler2D uSampler;

void main() {

    vec4 colorText = texture2D(uSampler,vTextureCoord);
	vec4 color = vec4(1.0,0.0,1.0,1.0);

	if(selected == 0.0)
	{
	    if(team == 1.0)
	    {
	        color.b = 0.0;
	    }
	    else
	    {
	        color.r = 0.0;
	    }
	}

	gl_FragColor = color * colorText;
}