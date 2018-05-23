
varying vec2 vUv;
varying vec3 vNormal, vView;

void main () {

	// vec3 color = vNormal * .5 + .5;
	float shade = dot(-normalize(vView), vNormal) * .5 + .5;
	vec3 color = vec3(shade);
	gl_FragColor = vec4(color, 1);
}