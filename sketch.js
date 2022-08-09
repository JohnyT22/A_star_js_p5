
canSize = 800

let m = new Maze(100,100,canSize,canSize)

function setup() {
    createCanvas(canSize, canSize);
}
  
function draw() {
  m.draw()
  m.solveStep()
}
  