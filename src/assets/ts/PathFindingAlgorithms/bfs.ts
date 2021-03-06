import {
  rowSize,
  colSize,
  algorithmType,
  manualStart,
  bfsSteps,
  dijkstrasPath,
  startBtn,
  clearPathBtn,
  wallBtn,
  gridContainer,
} from "../Grid/gridIndex";
import { setWall } from "../Grid/createWalls";

//timing of the visualization
let time = (<HTMLInputElement>document.querySelector(".speedSlider"))
  .value as unknown as number;

//change color of a node during and after traversal
const changeColor = (node: HTMLElement, count: number, cost: number): void => {
  setTimeout(() => {
    node.setAttribute("class", "chosenPath");
    if (cost) {
      node.innerHTML = `${cost}`;
    }
  }, count * time);
  setTimeout(() => {
    node.setAttribute("class", "pathColor");
  }, count * time + 100);
};

//update node color an cost during traversal
const checkUpdateNode = (
  row: number,
  col: number,
  curr: HTMLElement,
  checker: HTMLElement[],
  visited: HTMLElement[],
  count: number
): boolean | HTMLElement | void => {
  if (row >= 0 && col >= 0 && row < rowSize && col < colSize) {
    let node = document.querySelector(
      `div[row="${row}"][col="${col}"]`
    ) as HTMLElement;
    let wall = node.getAttribute("wall");
    if (wall == "1") return;
    let prow = curr.getAttribute("row") as unknown as number;
    let pcol = curr.getAttribute("col") as unknown as number;
    if (algorithmType.classList.contains("dijkstras")) {
      var cost = Math.min(
        Number(curr.getAttribute("cost")) + Number(node.getAttribute("weight")),
        Number(node.getAttribute("cost"))
      );
    } else {
      var cost = Math.min(
        Number(curr.getAttribute("cost")) +
          Math.abs(Math.abs(prow - row) + Math.abs(pcol - col)),
        node.getAttribute("cost") as unknown as number
      );
    }
    if (cost < Number(node.getAttribute("cost"))) {
      node.setAttribute(
        "parent",
        curr.getAttribute("row") + "|" + curr.getAttribute("col")
      );
      node.setAttribute("cost", `${cost}`);
    }

    //change color
    changeColor(curr, count, Number(curr.getAttribute("cost")));
    if (!visited.includes(node)) {
      checker.push(node);
      bfsSteps.push([row, col, cost, prow, pcol]);
    }
    visited.push(node);
    return node;
  } else {
    return false;
  }
};

//algorithm implementation - bfs for unweighted, dijkstras for weighted graphs
export const bfs = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
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

  //start algorithm
  let visited: HTMLElement[] = [startNode];
  let checker: HTMLElement[] = [startNode];
  let count: number = 1;

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
    if (
      !algorithmType.classList.contains("dijkstras") &&
      row == x2 &&
      col == y2
    )
      break;
    let wall = Number(curr.getAttribute("wall"));
    if (wall == 1) continue;

    //check 4 sides of node, top, right, bottom, left
    checkUpdateNode(row + 1, col, curr, checker, visited, count);
    checkUpdateNode(row - 1, col, curr, checker, visited, count);
    checkUpdateNode(row, col - 1, curr, checker, visited, count);
    checkUpdateNode(row, col + 1, curr, checker, visited, count);
    count++;
  }

  //highlight path after traversal
  setTimeout(() => {
    startNode.setAttribute("class", "pathNode");
    while (endNode.getAttribute("parent") != "null") {
      endNode.setAttribute("class", "chosenPath");
      let coor = endNode.getAttribute("parent") as unknown as string;
      let spCoor = coor.split("|");
      let prow: number = parseInt(spCoor[0]);
      let pcol: number = parseInt(spCoor[1]);
      endNode = document.querySelector(
        `div[row="${prow}"][col="${pcol}"]`
      ) as HTMLElement;
      dijkstrasPath.push([Number(prow), Number(pcol)]);
    }
    endNode = document.querySelector(
      `div[row="${x2}"][col="${y2}`
    ) as HTMLElement;
    endNode.setAttribute("class", "pathNode");
  }, count * time + 100);

  //re-enable disabled buttons
  setTimeout(() => {
    startBtn.removeAttribute("disabled");
    clearPathBtn.removeAttribute("disabled");
    manualStart.removeAttribute("disabled");
    wallBtn.removeAttribute("disabled");
  }, count * time + 100);
};
