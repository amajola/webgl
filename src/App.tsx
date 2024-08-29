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
      return;
    }
    const positions = createCubePosition({ x: 0, y: 0, z: 0 }, 10);
    const positions1 = createCubePosition({ x: 0, y: 0, z: 0 }, 0.5);
    createCube(gl, positions);
    createCube(gl, positions1);
  }, [gl]);

  type Point = {
    x: number;
    y: number;
    z: number;
  };

  const createCubePosition = (point: Point, size: number) => {
    const triangleOne = [0, 0, 0.5 + size, 0, 0, 0.5 + size];

    return triangleOne;
  };

  const createCube = (gl: WebGL2RenderingContext, positions: Array<number>) => {
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
