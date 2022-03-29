import { rowSize, colSize } from "../Grid/gridIndex";

export const getGrid = (): number[][] => {
  let gridMatrix: number[] = [];
  let matrix: number[][] = [];

  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      var node = document.querySelector(
        `div[row="${i}"][col="${j}"]`
      ) as HTMLElement;
      var wall: number = Number(node.getAttribute("wall"));
      gridMatrix.push(wall);
    }
  }
  while (gridMatrix.length) {
    matrix.push(gridMatrix.splice(0, colSize));
  }
  return matrix;
};
