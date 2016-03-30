varying vec3 N;
varying vec3 L;
varying vec3 V;
varying vec3 R;

uniform vec3 lightPosition;
uniform vec3 eyePosition;

void main() {

    vec4 pos = modelViewMatrix * vec4(position, 1.0);
    vec3 normalizedPos = vec3(pos)/pos.w;

    N = normalize(normal);
    L = normalize(lightPosition - normalizedPos);
    V = normalize(eyePosition - normalizedPos);
    R = reflect(-L, N);

    gl_Position = projectionMatrix * pos;
}
