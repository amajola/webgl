import { glsl } from "../utils/gl";

export const vertexShaderSource = glsl`#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
uniform mat3 u_matrix;
 
// all shaders have a main function
void main() {
  // Apply the transformation matrix to the position
  vec2 position = (u_matrix * vec3(a_position.xy, 1)).xy;

  // Set the transformed position as the output
  gl_Position = vec4(position, a_position.zw);
}
`;
