import { rowSize, colSize, weightType, gridContainer } from "../Grid/gridIndex";
import { setWall } from "../Grid/createWalls";
import { getGrid } from "./islandIndex";
//timing of the visualization
let time = document.querySelector(".speedSlider")
    .value;
//calculate the number of islands
class NumberOfIslands {
    constructor() {
        this.isSafe = (mat, i, j, vis, r, c) => {
            return i >= 0 && i < r && j >= 0 && j < c && mat[i][j] == 1 && !vis[i][j];
        };
        this.bfs = (mat, vis, si, sj, r, c) => {
            let row = [-1, -1, -1, 0, 0, 1, 1, 1];
            let col = [-1, 0, 1, -1, 1, -1, 0, 1];
            let q = [];
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
        this.countIslands = (mat, r, c) => {
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
}
//visualize the calculation
class Visualize {
    constructor() {
        this.changeColor = (node, count) => {
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
        this.checkUpdateNode = (row, col, curr, checker, visited, count) => {
            if (row >= 0 && col >= 0 && row < rowSize && col < colSize) {
                var node = document.querySelector(`div[row="${row}"][col="${col}"]`);
                let prow = Number(curr.getAttribute("row"));
                let pcol = Number(curr.getAttribute("col"));
                if (weightType == "weighted") {
                    var cost = Math.min(Number(curr.getAttribute("cost")) +
                        Number(node.getAttribute("weight")), Number(node.getAttribute("cost")));
                }
                else {
                    var cost = Math.min(Number(curr.getAttribute("cost")) +
                        Math.abs(Math.abs(prow - row) + Math.abs(pcol - col)), Number(node.getAttribute("cost")));
                    if (cost < Number(node.getAttribute("cost"))) {
                        node.setAttribute("parent", curr.getAttribute("row") + "|" + curr.getAttribute("col"));
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
            }
            else {
                return false;
            }
        };
        //bfs algorithm implementation
        this.visualizeBFS = () => {
            time = 40 + (time - 1) * -2;
            gridContainer.removeEventListener("mousedown", setWall);
            gridContainer.removeEventListener("mouseover", setWall);
            var startNode = document.querySelector(`div[row='${0}'][col='${0}']`);
            //hide start and refresh btn
            let startBtn = document.querySelector(".start");
            startBtn.setAttribute("disabled", "true");
            //start algorithm
            var visited = [startNode];
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
                let curr = checker.pop();
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
            let matGrid = getGrid();
            setTimeout(() => {
                alert(numIslands.countIslands(matGrid, rowSize, colSize) == 0
                    ? "No islands found, create some islands"
                    : "Number of islands: " +
                        numIslands.countIslands(matGrid, rowSize, colSize));
                window.location.reload();
            }, count * time + 1000);
        };
    }
}
export const bfsIslands = () => {
    const visual = new Visualize();
    visual.visualizeBFS();
};
