varying vec3 N;
varying vec3 L;
varying vec3 V;
varying vec3 R;

uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 diffuseMatColor;
uniform vec3 ambientMatColor;
uniform vec3 specularMatColor;
uniform float shiny;

void main() {


    vec3 diffuse = diffuseMatColor * lightColor * max(dot(L,N), 0.0);
    vec3 specular = specularMatColor * pow(max(dot(V,R), 0.0), shiny);
    vec3 ambient = ambientColor * ambientMatColor;

    gl_FragColor = vec4(diffuse+specular+ambient, 1.0);
}
