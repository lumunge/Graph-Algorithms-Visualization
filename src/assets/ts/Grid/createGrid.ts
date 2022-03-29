import {
  rowSize,
  colSize,
  startRow,
  endRow,
  startCol,
  endCol,
  algorithmType,
} from "./gridIndex";

const genRandom = (maxVal: number): number => {
  return (Math.random() * (maxVal - 1)) % maxVal;
};

//bellman ford
const genRandomNeg = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const createNode = (row: number, col: number, weight: number): HTMLElement => {
  var node = document.createElement("div");
  node.setAttribute("class", "beforeStart");
  node.setAttribute("row", row as unknown as string);
  node.setAttribute("col", col as unknown as string);
  node.setAttribute("wall", 0 as unknown as string);
  node.setAttribute("parent", null as unknown as string);
  node.setAttribute("cost", Number.POSITIVE_INFINITY as unknown as string);
  node.setAttribute("weight", weight as unknown as string);
  node.innerText = weight.toString();
  return node;
};

const updateNode = (
  node: HTMLElement,
  row: number,
  col: number,
  weight: number,
  wall: number
): HTMLElement => {
  node.setAttribute("row", row as unknown as string);
  node.setAttribute("col", col as unknown as string);
  node.setAttribute("parent", null as unknown as string);
  node.setAttribute("class", "beforeStart");
  node.setAttribute("cost", Number.POSITIVE_INFINITY as unknown as string);
  node.setAttribute("weight", weight as unknown as string);
  node.innerText = weight.toString();
  if (wall == 1) {
    node.setAttribute("wall", "1");
    node.className += " wall";
  } else {
    node.setAttribute("wall", "0");
  }
  return node;
};

const createEmptyNode = (row: number, col: number): HTMLElement => {
  var node = document.createElement("div");
  node.setAttribute("row", row as unknown as string);
  node.setAttribute("col", col as unknown as string);
  node.setAttribute("wall", "0");
  node.setAttribute("parent", null as unknown as string);
  node.setAttribute("class", "beforeStart");
  node.setAttribute("border", "1px solid #000");
  node.setAttribute("cost", Number.POSITIVE_INFINITY as unknown as string);
  return node;
};

const updateEmptyNode = (
  node: HTMLElement,
  row: number,
  col: number,
  wall: number
): HTMLElement => {
  node.setAttribute("row", row as unknown as string);
  node.setAttribute("col", col as unknown as string);
  node.setAttribute("class", "beforeStart");
  node.setAttribute("parent", null as unknown as string);
  node.setAttribute("border", "1px solid #000");
  node.setAttribute("cost", Number.POSITIVE_INFINITY as unknown as string);
  node.innerText = "";
  if (wall == 1) {
    node.setAttribute("wall", "1");
    node.className += " wall";
  } else {
    node.setAttribute("wall", "0");
  }
  return node;
};

export const createBoard = (): void => {
  var grid = document.querySelector("#gridContainer") as HTMLElement;
  grid.innerHTML = "";
  for (var i = 0; i < rowSize; i++) {
    for (var j = 0; j < colSize; j++) {
      if (algorithmType.classList.contains("dijkstras")) {
        let weight = Math.round(genRandom(5));
        let newNode = createNode(i, j, weight);
        grid.appendChild(newNode);
      } else if (algorithmType.classList.contains("bellman-ford")) {
        let weight = Math.round(genRandomNeg(1, 5));
        let newNode = createNode(i, j, weight);
        grid.appendChild(newNode);
      }
    }
  }
};

export const createEmptyBoard = (): void => {
  var grid = document.querySelector("#gridContainer") as HTMLElement;
  grid.innerHTML = "";
  for (var i = 0; i < rowSize; i++) {
    for (var j = 0; j < colSize; j++) {
      let newNode = createEmptyNode(i, j);
      grid.appendChild(newNode);
    }
  }
};

export const createStartNode = (x1 = 0, y1 = 0): void => {
  var startNode = document.querySelector(
    `div[row='${x1}'][col='${y1}']`
  ) as HTMLElement;
  startNode.setAttribute("cost", "0");
  startNode.setAttribute("class", "pathNode");
  if (!algorithmType.classList.contains("numIslands")) {
    startNode.innerHTML = "A";
  }
};

export const createEndNode = (x2 = rowSize - 1, y2 = colSize - 1): void => {
  var endNode = document.querySelector(
    `div[row='${x2}'][col='${y2}']`
  ) as HTMLElement;
  endNode.setAttribute("class", "pathNode");
  if (!algorithmType.classList.contains("numIslands")) {
    endNode.innerHTML = "B";
  }
};

export const refreshBoard = (): void => {
  for (var i = 0; i < rowSize; i++) {
    for (var j = 0; j < colSize; j++) {
      var node = document.querySelector(
        `div[row="${i}"][col="${j}"]`
      ) as HTMLElement;
      var weight = node.getAttribute("weight") as unknown as number;
      if (node.getAttribute("wall") == "1") {
        updateNode(node, i, j, weight, 1);
      } else {
        updateNode(node, i, j, weight, 0);
      }
    }
  }
  createStartNode(startRow, startCol);
  createEndNode(endRow, endCol);
};

export const refreshEmptyBoard = (): void => {
  for (var i = 0; i < rowSize; i++) {
    for (var j = 0; j < colSize; j++) {
      var node = document.querySelector(
        `div[row="${i}"][col="${j}"]`
      ) as HTMLElement;
      if (node.getAttribute("wall") == "1") {
        updateEmptyNode(node, i, j, 1);
      } else {
        updateEmptyNode(node, i, j, 0);
      }
    }
  }
  createStartNode(startRow, startCol);
  createEndNode(endRow, endCol);
};
