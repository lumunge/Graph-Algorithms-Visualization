import { rowSize, colSize, gridContainer } from "../Grid/gridIndex";
import { setWall } from "../Grid/createWalls";
import { getGrid } from "./islandIndex";

//timing of the visualization
let time = (<HTMLInputElement>document.querySelector(".speedSlider"))
  .value as unknown as number;
let bool: boolean = false;

class NumberOfIslands {
  // without visited matrix
  dfs = (
    matrix: number[][],
    i: number,
    j: number,
    row: number,
    col: number
  ) => {
    if (i < 0 || j < 0 || i > row - 1 || j > col - 1 || matrix[i][j] != 1) {
      return;
    }
    if (matrix[i][j] == 1) {
      //check neighbors
      matrix[i][j] = 0;
      this.dfs(matrix, i + 1, j, row, col); //right
      this.dfs(matrix, i - 1, j, row, col); //left
      this.dfs(matrix, i, j + 1, row, col); //up
      this.dfs(matrix, i, j - 1, row, col); //down
      this.dfs(matrix, i + 1, j + 1, row, col); //up-right
      this.dfs(matrix, i - 1, j - 1, row, col); //down-left
      this.dfs(matrix, i + 1, j - 1, row, col); //down-right
      this.dfs(matrix, i - 1, j + 1, row, col); //up-left
    }
  };

  countIslands = (matrix: number[][]): number => {
    let row = matrix.length;
    let col = matrix[0].length;
    let count = 0;
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (matrix[i][j] == 1) {
          //check neighbors
          matrix[i][j] = 0;
          count++;
          this.dfs(matrix, i + 1, j, row, col); //right
          this.dfs(matrix, i - 1, j, row, col); //left
          this.dfs(matrix, i, j + 1, row, col); //up
          this.dfs(matrix, i, j - 1, row, col); //down
          this.dfs(matrix, i + 1, j + 1, row, col); //up-right
          this.dfs(matrix, i - 1, j - 1, row, col); //down-left
          this.dfs(matrix, i + 1, j - 1, row, col); //down-right
          this.dfs(matrix, i - 1, j + 1, row, col); //up-left
        }
      }
    }
    return count;
  };
}

class Visualize {
  changeColor = (node: HTMLElement, count: number) => {
    setTimeout(() => {
      node.setAttribute("class", "chosenPath");
    }, count * time);
    // draw path blue
    setTimeout(() => {
      node.setAttribute("class", "pathColor");
    }, count * time + 100);
    setTimeout(() => {
      let wall = Number(node.getAttribute("wall"));
      if (wall == 1) {
        node.setAttribute("class", "beforeStart wall");
      }
    }, count * time + 100);
  };

  checker = (row: number, col: number) => {
    if (row >= 0 && col >= 0 && row < rowSize && col < colSize) return true;
    return false;
  };

  traverse = (
    node: HTMLElement,
    visited: HTMLElement[],
    count: number,
    endNode: HTMLElement
  ) => {
    let row = Number(node.getAttribute("row"));
    let col = Number(node.getAttribute("col"));

    visited.push(node);
    this.changeColor(node, count);

    // Check all sides of a node
    let cr = row,
      cc = col;

    if (this.checker(cr + 1, cc)) {
      let child = document.querySelector(
        `div[row="${cr + 1}"][col="${cc}"]`
      ) as HTMLElement;
      if (!visited.includes(child))
        this.traverse(child, visited, count + 1, endNode);
    }
    if (this.checker(cr, cc + 1)) {
      let child = document.querySelector(
        `div[row="${cr}"][col="${cc + 1}"]`
      ) as HTMLElement;
      if (!visited.includes(child))
        this.traverse(child, visited, count + 1, endNode);
    }
    if (this.checker(cr - 1, cc)) {
      let child = document.querySelector(
        `div[row="${cr - 1}"][col="${cc}"]`
      ) as HTMLElement;
      if (!visited.includes(child))
        this.traverse(child, visited, count + 1, endNode);
    }
    if (this.checker(cr, cc - 1)) {
      let child = document.querySelector(
        `div[row="${cr}"][col="${cc - 1}"]`
      ) as HTMLElement;
      if (!visited.includes(child))
        this.traverse(child, visited, count + 1, endNode);
    }
  };

  visualizeDFS = () => {
    time = 40 + (time - 1) * -2;
    gridContainer.removeEventListener("mousedown", setWall);
    gridContainer.removeEventListener("mouseover", setWall);
    let startNode = document.querySelector(
      `div[row='${0}'][col='${0}']`
    ) as HTMLElement;
    let endNode = document.querySelector(
      `div[row='${0}'][col='${1}']`
    ) as HTMLElement;

    //disable start button during visualization
    let startBtn = document.querySelector(".start") as HTMLElement;
    startBtn.setAttribute("disabled", "true");

    let visited: HTMLElement[] = [];
    let count: number = 1;
    bool = false;
    this.traverse(startNode, visited, count, endNode);

    const numIslands = new NumberOfIslands();
    let matGrid = getGrid();
    return numIslands.countIslands(matGrid);
  };
}

export const dfsIslands = () => {
  const visual = new Visualize();
  let islands = visual.visualizeDFS();
  setTimeout(() => {
    alert(
      islands == 0
        ? "No islands found, create some islands"
        : "Number of islands: " + islands
    );
    window.location.reload();
  }, rowSize * colSize * time + 1000);
};
