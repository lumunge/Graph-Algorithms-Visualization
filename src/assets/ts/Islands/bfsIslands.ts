import { rowSize, colSize, weightType, gridContainer } from "../Grid/gridIndex";
import { setWall } from "../Grid/createWalls";
import { getGrid } from "./islandIndex";

//timing of the visualization
let time = (<HTMLInputElement>document.querySelector(".speedSlider"))
  .value as unknown as number;

//calculate the number of islands
class NumberOfIslands {
  isSafe = (
    mat: number[][],
    i: number,
    j: number,
    vis: boolean[][],
    r: number,
    c: number
  ): boolean => {
    return i >= 0 && i < r && j >= 0 && j < c && mat[i][j] == 1 && !vis[i][j];
  };

  bfs = (
    mat: number[][],
    vis: boolean[][],
    si: number,
    sj: number,
    r: number,
    c: number
  ): void => {
    let row: number[] = [-1, -1, -1, 0, 0, 1, 1, 1];
    let col: number[] = [-1, 0, 1, -1, 1, -1, 0, 1];

    let q: number[][] = [];
    q.push([si, sj]);
    vis[si][sj] = true;

    while (q.length != 0) {
      let i = q[0][0];
      let j = q[0][1];
      q.shift();

      for (let k = 0; k < 8; k++) {
        if (this.isSafe(mat, i + row[k], j + col[k], vis, r, c)) {
          vis[i + row[k]][j + col[k]] = true;
          q.push([i + row[k], j + col[k]]);
        }
      }
    }
  };

  countIslands = (mat: number[][], r: number, c: number): number => {
    let vis = new Array(r);
    for (let i = 0; i < c; i++) {
      vis[i] = new Array(c);
      for (let j = 0; j < r; j++) {
        vis[i][j] = false;
      }
    }
    let res = 0;
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        if (mat[i][j] == 1 && !vis[i][j]) {
          this.bfs(mat, vis, i, j, r, c);
          res++;
        }
      }
    }
    return res;
  };
}

//visualize the calculation
class Visualize {
  changeColor = (node: HTMLElement, count: number): void => {
    setTimeout(() => {
      node.setAttribute("class", "chosenPath");
    }, count * time);
    setTimeout(() => {
      let wall = Number(node.getAttribute("wall"));
      if (wall == 1) {
        node.setAttribute("class", "beforeStart wall");
      }
    }, count * time + 100);
  };

  checkUpdateNode = (
    row: number,
    col: number,
    curr: HTMLElement,
    checker: HTMLElement[],
    visited: HTMLElement[],
    count: number
  ) => {
    if (row >= 0 && col >= 0 && row < rowSize && col < colSize) {
      var node = document.querySelector(
        `div[row="${row}"][col="${col}"]`
      ) as HTMLElement;
      let prow = Number(curr.getAttribute("row"));
      let pcol = Number(curr.getAttribute("col"));
      if (weightType == "weighted") {
        var cost = Math.min(
          Number(curr.getAttribute("cost")) +
            Number(node.getAttribute("weight")),
          Number(node.getAttribute("cost"))
        );
      } else {
        var cost = Math.min(
          Number(curr.getAttribute("cost")) +
            Math.abs(Math.abs(prow - row) + Math.abs(pcol - col)),
          Number(node.getAttribute("cost"))
        );
        if (cost < Number(node.getAttribute("cost"))) {
          node.setAttribute(
            "parent",
            curr.getAttribute("row") + "|" + curr.getAttribute("col")
          );
          node.setAttribute("cost", `${cost}`);
        }

        //change color
        this.changeColor(curr, count);
        if (!visited.includes(node)) {
          checker.push(node);
        }
        visited.push(node);
        return node;
      }
    } else {
      return false;
    }
  };

  //bfs algorithm implementation
  visualizeBFS = (): void => {
    time = 40 + (time - 1) * -2;
    gridContainer.removeEventListener("mousedown", setWall);
    gridContainer.removeEventListener("mouseover", setWall);
    var startNode = document.querySelector(
      `div[row='${0}'][col='${0}']`
    ) as HTMLElement;

    //hide start and refresh btn
    let startBtn = document.querySelector(".start") as HTMLElement;
    startBtn.setAttribute("disabled", "true");

    //start algorithm
    var visited: HTMLElement[] = [startNode];
    var checker = [startNode];
    var count = 1;

    while (checker.length != 0) {
      checker.sort((a, b) => {
        if (Number(a.getAttribute("cost")) < Number(b.getAttribute("cost")))
          return 1;
        if (Number(a.getAttribute("cost")) > Number(b.getAttribute("cost")))
          return -1;
        return 0;
      });
      let curr = checker.pop() as unknown as HTMLElement;
      let row = Number(curr.getAttribute("row"));
      let col = Number(curr.getAttribute("col"));

      //check 4 sides of node
      this.checkUpdateNode(row + 1, col, curr, checker, visited, count);
      this.checkUpdateNode(row - 1, col, curr, checker, visited, count);
      this.checkUpdateNode(row, col - 1, curr, checker, visited, count);
      this.checkUpdateNode(row, col + 1, curr, checker, visited, count);
      count++;
    }

    const numIslands = new NumberOfIslands();
    let matGrid: number[][] = getGrid();

    setTimeout(() => {
      alert(
        numIslands.countIslands(matGrid, rowSize, colSize) == 0
          ? "No islands found, create some islands"
          : "Number of islands: " +
              numIslands.countIslands(matGrid, rowSize, colSize)
      );
      window.location.reload();
    }, count * time + 1000);
  };
}

export const bfsIslands = () => {
  const visual = new Visualize();
  visual.visualizeBFS();
};
