import { rowSize, colSize, endRow, endCol, startRow, startCol, manualStart, bellmanSteps, bellmanFordPath, startBtn, clearPathBtn, wallBtn, gridContainer, } from "../Grid/gridIndex";
import { setWall } from "../Grid/createWalls";
//timing of the visualization
let time = document.querySelector(".speedSlider")
    .value;
let count = 1;
let pathCount = 1;
export const relaxations = 5;
//change color of a node during and after traversal
const changeColor = (node, count, cost) => {
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
const checkUpdateNode = (row, col, curr, checker, visited, count) => {
    if (row >= 0 && col >= 0 && row < rowSize && col < colSize) {
        let node = document.querySelector(`div[row="${row}"][col="${col}"]`);
        let wall = Number(node.getAttribute("wall"));
        if (wall == 1)
            return;
        let cost = Math.min(Number(curr.getAttribute("cost")) + Number(node.getAttribute("weight")), Number(node.getAttribute("cost")));
        if (cost < Number(node.getAttribute("cost"))) {
            node.setAttribute("parent", curr.getAttribute("row") + "|" + curr.getAttribute("col"));
            node.setAttribute("cost", `${cost}`);
        }
        let prow = Number(curr.getAttribute("row"));
        let pcol = Number(curr.getAttribute("col"));
        //change color
        changeColor(curr, count, Number(curr.getAttribute("cost")));
        if (!visited.includes(node)) {
            checker.push(node);
            bellmanSteps.push([row, col, cost, prow, pcol]);
        }
        visited.push(node);
        return node;
    }
    else {
        return false;
    }
};
//relax nodes bellman ford algorithm
const relax = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
    let startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
    //start algorithm
    let visited = [startNode];
    let checker = [startNode];
    while (checker.length != 0) {
        checker.sort((a, b) => {
            if (Number(a.getAttribute("cost")) < Number(b.getAttribute("cost")))
                return 1;
            if (Number(a.getAttribute("cost")) > Number(b.getAttribute("cost")))
                return -1;
            return 0;
        });
        let curr = checker.pop();
        let row = Number(curr.getAttribute("row"));
        let col = Number(curr.getAttribute("col"));
        let wall = Number(curr.getAttribute("wall"));
        if (wall == 1)
            continue;
        //check 4 sides of node, top, right, bottom, left
        checkUpdateNode(row + 1, col, curr, checker, visited, count);
        checkUpdateNode(row - 1, col, curr, checker, visited, count);
        checkUpdateNode(row, col - 1, curr, checker, visited, count);
        checkUpdateNode(row, col + 1, curr, checker, visited, count);
        count++;
        pathCount++;
    }
};
//highlight shortest path
const drawPath = () => {
    let startNode = document.querySelector(`div[row='${startRow}'][col='${startCol}']`);
    let endNode = document.querySelector(`div[row='${endRow}'][col='${endCol}']`);
    //draw route
    setTimeout(() => {
        startNode.setAttribute("class", "pathNode");
        startNode.innerHTML = `${0}`;
        while (endNode.getAttribute("parent") != "null") {
            endNode.setAttribute("class", "chosenPath");
            let coor = endNode.getAttribute("parent");
            let spCoor = coor.split("|");
            let prow = parseInt(spCoor[0]);
            let pcol = parseInt(spCoor[1]);
            endNode = document.querySelector(`div[row="${prow}"][col="${pcol}"]`);
            bellmanFordPath.push([Number(prow), Number(pcol)]);
        }
        endNode.setAttribute("class", "pathNode");
    }, 1000 * time + 100);
};
//original number of steps
export let bellmanStepsLength = 0;
//bellman ford algorithm function
export const bellmanFord = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
    time = 40 + (time - 1) * -2;
    gridContainer.removeEventListener("mousedown", setWall);
    gridContainer.removeEventListener("mouseover", setWall);
    //disable start and clear path buttons
    startBtn.setAttribute("disabled", "true");
    clearPathBtn.setAttribute("disabled", "true");
    wallBtn.setAttribute("disabled", "true");
    let i = 0;
    let run = () => {
        setInterval(() => {
            if (i < relaxations) {
                relax((x1 = 0), (y1 = 0), (x2 = rowSize - 1), (y2 = colSize - 1));
                bellmanStepsLength = bellmanSteps.length;
                i++;
            }
            else {
                setTimeout(() => {
                    startBtn.removeAttribute("disabled");
                    clearPathBtn.removeAttribute("disabled");
                    manualStart.removeAttribute("disabled");
                    wallBtn.removeAttribute("disabled");
                }, pathCount * time + 100);
                const stop = setInterval(run, 5000);
                clearInterval(stop);
            }
            drawPath();
        }, 5000);
    };
    run();
};
