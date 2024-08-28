export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
  // Get the device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  // Get the canvas size in CSS pixels
  const { width, height } = canvas.getBoundingClientRect();

  // Calculate the canvas size in actual pixels
  const displayWidth = Math.round(width * dpr);
  const displayHeight = Math.round(height * dpr);

  // Resize the drawing buffer if necessary
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  // Return true if the canvas was resized, false otherwise
  return canvas.width !== displayWidth || canvas.height !== displayHeight;
};
