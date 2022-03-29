import { setWall } from "../Grid/createWalls";
import {
  rowSize,
  colSize,
  manualStart,
  dfsSteps,
  visitedPaths,
  startBtn,
  clearPathBtn,
  wallBtn,
  gridContainer,
  findNextPath,
} from "../Grid/gridIndex";
import { changeColor, checker } from "./dfs";

//timing of the visualization
let time = (<HTMLInputElement>document.querySelector(".speedSlider"))
  .value as unknown as number;
let bool: boolean = false;
let count: number = 1;

//traverse grid
const traverse = (
  node: HTMLElement,
  visited: HTMLElement[],
  cost: number,
  endNode: HTMLElement
): void => {
  let row = Number(node.getAttribute("row"));
  let col = Number(node.getAttribute("col"));
  if (bool || node == endNode) {
    bool = true;
    return;
  }

  let wall: number = Number(node.getAttribute("wall"));
  if (wall == 1) return;

  visited.push(node);
  visitedPaths.push([row, col]);
  dfsSteps.push([row, col, cost, row, col]);
  changeColor(node, cost);

  // Check all sides of a node
  let cr: number = row,
    cc: number = col;

  if (checker(cr + 1, cc)) {
    let child = document.querySelector(
      `div[row="${cr + 1}"][col="${cc}"]`
    ) as HTMLElement;
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr + 1, cc]);
    }
  }
  if (checker(cr, cc + 1)) {
    let child = document.querySelector(
      `div[row="${cr}"][col="${cc + 1}"]`
    ) as HTMLElement;
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr, cc + 1]);
    }
  }
  if (checker(cr - 1, cc)) {
    let child = document.querySelector(
      `div[row="${cr - 1}"][col="${cc}"]`
    ) as HTMLElement;
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr - 1, cc]);
    }
  }
  if (checker(cr, cc - 1)) {
    let child = document.querySelector(
      `div[row="${cr}"][col="${cc - 1}"]`
    ) as HTMLElement;
    if (!visited.includes(child)) {
      traverse(child, visited, cost + 1, endNode);
      count++;
    } else {
      dfsSteps.push([row, col, cost, cr, cc - 1]);
    }
  }
};

//depth first search algorithm
export const findPaths = (
  x1 = 0,
  y1 = 0,
  x2 = rowSize - 1,
  y2 = colSize - 1
): void => {
  time = 40 + (time - 1) * -2;
  gridContainer.removeEventListener("mousedown", setWall);
  gridContainer.removeEventListener("mouseover", setWall);
  let startNode = document.querySelector(
    `div[row='${x1}'][col='${y1}']`
  ) as HTMLElement;
  let endNode = document.querySelector(
    `div[row='${x2}'][col='${y2}']`
  ) as HTMLElement;

  //disable start and clear path buttons
  startBtn.setAttribute("disabled", "true");
  clearPathBtn.setAttribute("disabled", "true");
  wallBtn.setAttribute("disabled", "true");

  let visited: HTMLElement[] = [];
  let cost: number = 1;
  bool = false;

  traverse(startNode, visited, cost, endNode);

  // re-enable disabled buttons
  setTimeout(() => {
    startBtn.removeAttribute("disabled");
    clearPathBtn.removeAttribute("disabled");
    manualStart.removeAttribute("disabled");
    findNextPath.removeAttribute("disabled");
    wallBtn.removeAttribute("disabled");
  }, count * time + 100);
};
