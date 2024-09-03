import { useState, useRef, useLayoutEffect } from "react";
import "./App.css";
import { createProgram } from "./utils/gl";
import { vertexShaderSource } from "./shaders/vertex";
import { fragmentShaderSource } from "./shaders/fragment";
import { setColors, setGeometry } from "./utils/createF";
import { degToRad, m4 } from "./utils/math";
import { resizeCanvasToDisplaySize } from "./utils/screen";

function App() {
  const [gl, setGL] = useState<WebGL2RenderingContext | undefined>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  interface Slider {
    name: string;
    value: number;
  }
  const [values, setValues] = useState<Slider[]>([
    { name: "feildOfView", value: 20 },
    { name: "x", value: -150 },
    { name: "y", value: 0 },
    { name: "z", value: -360 },
    { name: "angleX", value: 190 },
    { name: "angleY", value: 40 },
    { name: "angleZ", value: 30 },
  ]);

  const handleSliderChange = (index: number, newValue: number) => {
    const newValues = [...values];
    newValues[index].value = newValue;
    setValues(newValues);
  };

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    setGL(canvas?.getContext?.("webgl2", {}) ?? undefined);

    if (gl === undefined) {
      // To-do: Create a popup to alert user that WebGL2 is not supported
      return;
    }

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

    // look up uniform locations
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer
    const positionBuffer = gl.createBuffer();

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set Geometry.
    setGeometry(gl);

    const bindPosition = () => {
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      const size = 3; // 3 components per iteration
      const type = gl.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );
    };

    const bindColor = () => {
      // create the color buffer, make it the current ARRAY_BUFFER
      // and copy in the color values
      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      setColors(gl);

      // Turn on the attribute
      gl.enableVertexAttribArray(colorAttributeLocation);

      // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
      const size = 3; // 3 components per iteration
      const type = gl.UNSIGNED_BYTE; // the data is 8bit unsigned bytes
      const normalize = true; // convert from 0-255 to 0.0-1.0
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next color
      const offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(
        colorAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
      );
    };

    bindPosition();
    bindColor();

    // First let's make some variables
    // to hold the translation,
    const translation = [values[1], values[2], values[3]];
    const rotation = [
      degToRad(values[4].value),
      degToRad(values[5].value),
      degToRad(values[6].value),
    ];
    const scale = [1, 1, 1];
    const fieldOfViewRadians = degToRad(values[0].value);

    const drawScene = (
      gl: WebGL2RenderingContext,
      program: WebGLProgram,
      vao: WebGLVertexArrayObject
    ) => {
      if (!canvasRef.current) return;
      resizeCanvasToDisplaySize(canvasRef.current);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // turn on depth testing
      gl.enable(gl.DEPTH_TEST);

      // tell webgl to cull faces
      gl.enable(gl.CULL_FACE);

      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);

      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao);

      // Compute the matrix
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 1;
      const zFar = 2000;
      let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
      matrix = m4.translate(
        matrix,
        translation[0].value,
        translation[1].value,
        translation[2].value
      );
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // Draw the geometry.
      const primitiveType = gl.TRIANGLES;
      const offset = 0;
      const count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
    };

    drawScene(gl, program, vao);
  }, [gl, values]);

  return (
    <div className="container">
      <div className="sliders">
        {values.map((value, index) => (
          <div key={index} className="">
            <label htmlFor={`slider-${index + 1}`} className="">
              {value.name}
            </label>
            <input
              type="range"
              id={`slider-${index + 1}`}
              min={0}
              max={100}
              step={1}
              value={values[index].value}
              onChange={(newValue) =>
                handleSliderChange(index, Number(newValue.currentTarget.value))
              }
            />
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
  );
}

export default App;
