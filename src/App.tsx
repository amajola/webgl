import { useState, useRef, useLayoutEffect } from "react";
import "./App.css";
import { createProgram, draw } from "./utils/gl";
import { vertexShaderSource } from "./shaders/vertex";
import { fragmentShaderSource } from "./shaders/fragment";

function App() {
  const [gl, setGL] = useState<WebGL2RenderingContext | undefined>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    setGL(canvas?.getContext?.("webgl2", {}) ?? undefined);

    if (gl === undefined) {
      // To-do: Create a popup to alert user that WebGL2 is not supported
      console.log("WebGL2 not supported is supported");
      return;
    }
    createTriangle(gl);
  }, [gl]);

  const createTriangle = (gl: WebGL2RenderingContext) => {
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );

    const positionBuffer = gl.createBuffer();

    const voa = gl.createVertexArray();
    if (!voa) throw new Error("Failed to create vertex array");
    gl.bindVertexArray(voa);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [0, 0, 0, 0.5, 0.7, 0, 0.7, 0, 0.7, 0.5, 0, 0.5];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    draw(gl, program, voa);
  };

  return (
    <div className="container">
      <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
  );
}

export default App;
