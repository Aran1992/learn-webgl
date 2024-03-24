#version 300 es

uniform vec2 u_resolution;

in vec2 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;

void main() {
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0f;
    vec2 clipSpace = zeroToTwo - 1.0f;
    gl_Position = vec4(clipSpace, 0.0f, 1.0f);
    v_texCoord = a_texCoord;
}