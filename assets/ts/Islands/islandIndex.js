import { rowSize, colSize } from "../Grid/gridIndex";
export const getGrid = () => {
    let gridMatrix = [];
    let matrix = [];
    for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) {
            var node = document.querySelector(`div[row="${i}"][col="${j}"]`);
            var wall = Number(node.getAttribute("wall"));
            gridMatrix.push(wall);
        }
    }
    while (gridMatrix.length) {
        matrix.push(gridMatrix.splice(0, colSize));
    }
    return matrix;
};
