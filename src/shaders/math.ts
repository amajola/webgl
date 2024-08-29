export type Matrix4x4 = number[][];

export const multiply = (Array1: Matrix4x4, Array2: Matrix4x4) => {
  const answer = [];
  const rows = Array2.length;
  for (let index = 0; index < rows; index++) {
    const multiplyRows = [];
    for (let iter = 0; iter < Array2[index].length; iter++) {
      const value = [];
      for (
        let multiplyIndex = 0;
        multiplyIndex < Array1.length;
        multiplyIndex++
      ) {
        const element = Array1[index][multiplyIndex];
        value.push(element * Array2[multiplyIndex][iter]);
      }
      multiplyRows.push(value.reduce((a, b) => a + b, 0));
    }
    answer.push(multiplyRows);
  }

  return answer;
};

export const translationItems = {
  translation: function translation(tx: number, ty: number) {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [tx, ty, 1],
    ];
  },

  rotation: function rotation(angleInRadians: number) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [
      [c, -s, 0],
      [s, c, 0],
      [0, 0, 1],
    ];
  },

  scaling: function scaling(sx: number, sy: number) {
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];
  },
};
