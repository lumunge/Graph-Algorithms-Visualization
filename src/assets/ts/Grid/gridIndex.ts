import {
  createEmptyBoard,
  createBoard,
  createStartNode,
  createEndNode,
  refreshBoard,
  refreshEmptyBoard,
} from "./createGrid";
import { setWall } from "./createWalls";
import { setObstacles } from "./generateObstacles";
import { dfs } from "../PathFindingAlgorithms/dfs";
import { bfs } from "../PathFindingAlgorithms/bfs";
import { bfsIslands } from "../Islands/bfsIslands";
import { dfsIslands } from "../Islands/dfsIslands";
import { maxIsland } from "../Islands/largeIsland";
// import { findPaths } from "../PathFindingAlgorithms/findPaths";
import {
  bellmanFord,
  relaxations,
  bellmanStepsLength,
} from "../PathFindingAlgorithms/bellmanFord";

// get DOM elements
export const gridContainer = document.querySelector(
  "#gridContainer"
) as HTMLElement;
export const clearPathBtn = document.querySelector(".clearPath") as HTMLElement;
export const resetBtn = document.querySelector(".reset") as HTMLElement;
const weightBtn = document.querySelector(".weight") as HTMLSelectElement;
const algoBtn = document.querySelector(".algo") as HTMLSelectElement;
export const startBtn = document.querySelector(".start") as HTMLElement;
export const findNextPath = document.querySelector(".findNext") as HTMLElement;
export const wallBtn = document.querySelector(".setWalls") as HTMLElement;
export const speedSlider = document.querySelector(
  ".speedSlider"
) as HTMLElement;
const islandAlgoBtn = document.querySelector(
  ".islandsAlgo"
) as HTMLSelectElement;
export const stepsContainer = document.querySelector(
  ".notification"
) as HTMLElement;
export const algorithmType = document.querySelector(
  ".algorithm"
) as HTMLElement;
export var manualStart = document.querySelector(".manual") as HTMLElement;

manualStart.setAttribute("disabled", "true");
findNextPath.setAttribute("disabled", "true");

//global variables
export var rowSize: number = 20;
export var colSize: number = 40;
export var startRow: number = 4;
export var startCol: number = 5;
export var endRow: number = 15;
export var endCol: number = 32;
export var mouseDown: boolean = false;
export var weightType: string =
  weightBtn.options[weightBtn.selectedIndex].value;
export var algorithm: string = algoBtn.options[algoBtn.selectedIndex].value;
export var islandAlgo: string =
  islandAlgoBtn.options[islandAlgoBtn.selectedIndex].value;

//steps arrays
export let bfsSteps: number[][] = [];
export let dfsSteps: number[][] = [];
export let bellmanSteps: number[][] = [];
export let dijkstrasPath: number[][] = [];
export let bellmanFordPath: number[][] = [];
export let visitedPaths: number[][] = [];

//event listeners
gridContainer.addEventListener("mousedown", () => {
  mouseDown = true;
});
gridContainer.addEventListener("mouseup", () => {
  mouseDown = false;
});
gridContainer.addEventListener("mouseover", () => {
  setWall;
});
wallBtn.addEventListener("click", setObstacles);

islandAlgoBtn.addEventListener("change", () => {
  window.location.reload();
});

//clear path after traversal
export const clearPath = () => {
  gridContainer.addEventListener("mousedown", setWall);
  gridContainer.addEventListener("mouseup", setWall);
  gridContainer.addEventListener("mouseover", setWall);
  if (
    algorithmType.classList.contains("bfs") ||
    algorithmType.classList.contains("dfs") ||
    algorithmType.classList.contains("numIslands") ||
    algorithmType.classList.contains("maxIsland") ||
    algorithmType.classList.contains("findPaths") ||
    algorithmType.classList.contains("findPaths")
  ) {
    refreshEmptyBoard();
  } else if (
    algorithmType.classList.contains("dijkstras") ||
    algorithmType.classList.contains("bellman-ford")
  ) {
    refreshBoard();
  }
  startBtn.style.visibility = "visible";
};

resetBtn.addEventListener("click", () => location.reload());
clearPathBtn.addEventListener("click", clearPath);

//display steps
let stepsTitle = document.createElement("h4");
stepsTitle.classList.add("stepsTitle");
stepsTitle.textContent = "Algorithm Steps";
stepsContainer.append(stepsTitle);

//log steps for algorithm
export const notification = (
  row: number,
  col: number,
  erow: number,
  ecol: number,
  cost: number,
  prevCost: number
): void => {
  let step: HTMLElement = document.createElement("div");
  step.classList.add("step");
  let push: HTMLElement = document.createElement("p");
  let explore: HTMLElement = document.createElement("p");
  let costText: HTMLElement = document.createElement("p");
  if (algorithmType.classList.contains("bellman-ford")) {
    if (bellmanSteps.length == 0) {
      push.textContent = `Selected (${row}, ${col}) as path.`;
    } else {
      if (bellmanSteps.length) {
        push.textContent = `Relaxing (${row}, ${col}): current cost ${prevCost}, updated cost ${
          cost || "inf"
        }.`;
        explore.textContent = `Processing (${erow}, ${ecol}).`;
      } else {
        push.textContent = `Pushed (${row}, ${col}) to dist[] array.`;
        explore.textContent = `Exploring (${erow}, ${ecol}).`;
      }
    }
  } else if (
    algorithmType.classList.contains("dijkstras") ||
    algorithmType.classList.contains("bfs") ||
    algorithmType.classList.contains("findPaths")
  ) {
    if (bfsSteps.length == 0) {
      push.textContent = `Selected (${row}, ${col}) as path.`;
    } else {
      push.textContent = `Pushed (${row}, ${col}) to array.`;
      explore.textContent = `Processing (${erow}, ${ecol}).`;
      costText.textContent = `Cost from source is ${cost}`;
    }
  } else if (algorithmType.classList.contains("dfs")) {
    if (row == erow && col == ecol) {
      push.textContent = `Pushed (${erow}, ${ecol}) to stack.`;
      explore.textContent = `Exploring (${erow}, ${ecol}).`;
    } else {
      push.textContent = `Popped (${row}, ${col}) from stack.`;
    }
  }
  step.appendChild(push);
  step.appendChild(explore);
  step.appendChild(costText);
  stepsContainer.append(step);
  stepsContainer.scrollTop = stepsContainer.scrollHeight;

  step.addEventListener("click", () => {
    let node = document.querySelector(
      `div[row='${row}'][col='${col}']`
    ) as HTMLInputElement;
    let node1 = document.querySelector(
      `div[row='${erow}'][col='${ecol}']`
    ) as HTMLInputElement;
    setTimeout(() => {
      node.setAttribute("class", "pathColor");
      node1.setAttribute("class", "pathColor");
    }, 1000);
    node1.setAttribute("class", "manualStep");
    node.setAttribute("class", "chosenPath");
  });
};

// step by step visualization
let isPath: boolean = true;
export const stepper = (steps: number[][]): void => {
  gridContainer.removeEventListener("mousedown", setWall);
  gridContainer.removeEventListener("mouseover", setWall);
  wallBtn.setAttribute("disabled", "true");
  if (isPath) {
    clearPath();
    bellmanFordPath.splice(
      0,
      bellmanFordPath.length - bellmanFordPath.length / 5
    );
    startBtn.setAttribute("disabled", "true");
    clearPathBtn.setAttribute("disabled", "true");
    stepsContainer.classList.remove("notification");
    stepsContainer.classList.add("show");
    wallBtn.setAttribute("disabled", "true");
    isPath = false;
  }
  if (steps.length == 0) {
    if (
      algorithmType.classList.contains("dijkstras") ||
      algorithmType.classList.contains("bfs")
    ) {
      if (dijkstrasPath.length == 0) {
        alert("Steps completed!");
      } else {
        //draw path
        var pcol = dijkstrasPath[0][0];
        var prow = dijkstrasPath[0][1];
        let node = document.querySelector(
          `div[row='${prow}'][col='${pcol}']`
        ) as HTMLInputElement;
        setTimeout(() => {
          node.setAttribute("class", "pathColor");
        }, 1000);
        node.setAttribute("class", "chosenPath");
        notification(pcol, prow, 0, 0, 0, 0);
        dijkstrasPath.shift();
      }
    } else if (algorithmType.classList.contains("bellman-ford")) {
      if (bellmanFordPath.length == 0) {
        alert("Bellman ford steps completed!");
      } else {
        //draw path
        var pcol = bellmanFordPath[0][0];
        var prow = bellmanFordPath[0][1];
        let node = document.querySelector(
          `div[row='${pcol}'][col='${prow}']`
        ) as HTMLInputElement;
        node.setAttribute("class", "chosenPath");
        notification(pcol, prow, 0, 0, 0, 0);
        bellmanFordPath.shift();
      }
    } else {
      alert("Completed Steps");
    }
  } else {
    var cr: number = steps[0][0];
    var cc = steps[0][1];
    var cost = steps[0][2];
    var er = steps[0][3];
    var ec = steps[0][4];
    let node = document.querySelector(
      `div[row='${cr}'][col='${cc}']`
    ) as HTMLElement;
    setTimeout(() => {
      node.setAttribute("class", "pathColor");
    }, 1000);
    node.setAttribute("class", "chosenPath");
    //relaxation for bellman ford nodes
    let prevCost = node.innerHTML as unknown as number;
    node.innerHTML = `${cost}` || "inf";
    notification(cr, cc, er, ec, cost, prevCost);
    steps.shift();
  }
};

const findNextPathFunc = (nodes: []) => {
  let startNextRow = nodes.slice(-1)[0][0];
  let startNextCol = nodes.slice(-1)[0][1];
  let node = document.querySelector(
    `div[row='${startNextRow}'][col='${startNextCol}']`
  ) as HTMLElement;
  nodes.pop();
  clearPath();
  dfs(startRow, startCol, endRow, endCol);
  if (Number(node.getAttribute("wall")) == 0) {
    node.setAttribute("wall", "1");
  }
};

//run normal visualization
const startVisualization = () => {
  if (algorithmType.classList.contains("bfs")) {
    bfs(startRow, startCol, endRow, endCol);
    manualStart.addEventListener("click", () => {
      stepper(bfsSteps);
    });
  } else if (algorithmType.classList.contains("dfs")) {
    dfs(startRow, startCol, endRow, endCol);
    manualStart.addEventListener("click", () => {
      stepper(dfsSteps);
    });
  } else if (algorithmType.classList.contains("dijkstras")) {
    bfs(startRow, startCol, endRow, endCol);
    manualStart.addEventListener("click", () => {
      stepper(bfsSteps);
    });
  } else if (algorithmType.classList.contains("bellman-ford")) {
    bellmanFord(startRow, startCol, endRow, endCol);
    manualStart.addEventListener("click", () => {
      stepper(bellmanSteps);
    });
  } else if (algorithmType.classList.contains("numIslands")) {
    if (islandAlgo === "bfs") {
      bfsIslands();
    } else if (islandAlgo === "dfs") {
      dfsIslands();
    }
  } else if (algorithmType.classList.contains("maxIsland")) {
    maxIsland();
  }
  //  else if (algorithmType.classList.contains("findPaths")) {
  //   findPaths(startRow, startCol, endRow, endCol);
  //   findNextPath.addEventListener("click", () => {
  //     findNextPathFunc(visitedPaths);
  //   });
  //   // manualStart.addEventListener("click", () => {
  //   //   stepper(dfsSteps);
  //   // });
  // }
};
startBtn.addEventListener("click", startVisualization);
// findNextPath.addEventListener("click");

//Initialize board
window.onload = () => {
  gridContainer.addEventListener("mousedown", setWall);
  gridContainer.addEventListener("mouseup", setWall);
  gridContainer.addEventListener("mouseover", setWall);
  if (
    algorithmType.classList.contains("bfs") ||
    algorithmType.classList.contains("dfs") ||
    algorithmType.classList.contains("numIslands") ||
    algorithmType.classList.contains("maxIsland") ||
    algorithmType.classList.contains("findPaths")
  ) {
    createEmptyBoard();
  } else if (
    algorithmType.classList.contains("dijkstras") ||
    algorithmType.classList.contains("bellman-ford")
  ) {
    createBoard();
  }
  if (
    algorithmType.classList.contains("bfs") ||
    algorithmType.classList.contains("dfs") ||
    algorithmType.classList.contains("dijkstras") ||
    algorithmType.classList.contains("bellman-ford") ||
    algorithmType.classList.contains("findPaths")
  ) {
    createStartNode(startRow, startCol);
    createEndNode(endRow, endCol);
  } else if (
    algorithmType.classList.contains("numIslands") ||
    algorithmType.classList.contains("maxIslands")
  ) {
    if (islandAlgo === "bfs") {
      createStartNode(0, 0);
      createEndNode(19, 39);
    } else if (
      islandAlgo === "dfs" ||
      algorithmType.classList.contains("maxIslands")
    ) {
      createStartNode(0, 0);
      createEndNode(0, 1);
    }
  }
};
