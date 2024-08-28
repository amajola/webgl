enum ShaderType {
  VERTEX = WebGLRenderingContext.VERTEX_SHADER,
  FRAGMENT_SHADER = WebGLRenderingContext.FRAGMENT_SHADER,
}

export const createShader = (
  gl: WebGL2RenderingContext,
  type: ShaderType,
  source: string
) => {
  const shader = gl.createShader(type);
  if (shader === null) {
    throw new Error(`Error creating shader type ${type}`);
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  const infoLog = gl.getShaderInfoLog(shader);
  throw new Error(`Error compiling shader type ${type}: ${infoLog}`);
};

export const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: string,
  fragmentShader: string
) => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Error creating the webgl program");
  }
  gl.attachShader(program, createShader(gl, ShaderType.VERTEX, vertexShader));
  gl.attachShader(
    program,
    createShader(gl, ShaderType.FRAGMENT_SHADER, fragmentShader)
  );
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  console.log(success);

  if (success) return program;
  else {
    const infoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Error linking shaders: ${infoLog}`);
  }
};

export const draw = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  voa: WebGLVertexArrayObject
) => {
  // To-do: Figure out how to do the resize
  // resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program);

  gl.bindVertexArray(voa);

  // Draw the geometry.
  // draw
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
};

export const glsl = (x: TemplateStringsArray) => x[0];
