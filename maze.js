
class Cell{
    constructor(x,y,sizeX,sizeY){
        this.g = Infinity;
        this.f = Infinity;
        this.wall = false;
        this.prev = undefined;
        this.neighbors = []

        if(Math.random() < 0.4){
            this.wall = true
        }

        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    draw(colour){
        fill(colour);
        stroke(0);
        rect(this.x*this.sizeX,this.y*this.sizeY,this.sizeX-1,this.sizeY-1)
    }
}

class Maze{
    constructor(sizeX,sizeY, canvasSizeX,canvasSizeY){
        let cellSizeX = canvasSizeX/sizeX;
        let cellSizeY = canvasSizeY/sizeY;

        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.cells=[]

        for(var x = 0; x<sizeX;x++){
            for(var y = 0; y<sizeY;y++){
                this.cells.push(new Cell(x,y,cellSizeX,cellSizeY))
            }
        }

        for(var x = 0; x<sizeX;x++){
            for(var y = 0; y<sizeY;y++){
                let index = y*sizeX + x

                if(x > 0){
                    this.cells[index].neighbors.push(this.cells[index-1])
                }

                if(x < sizeX-1){
                    this.cells[index].neighbors.push(this.cells[index+1])
                }

                if(y > 0){
                    this.cells[index].neighbors.push(this.cells[index-sizeX])
                }

                if(y < sizeY-1){
                    this.cells[index].neighbors.push(this.cells[index+sizeX])
                }

                if(x > 0 && y > 0){
                    this.cells[index].neighbors.push(this.cells[index-1-sizeX])
                }

                if(x < sizeX-1 && y < sizeY-1){
                    this.cells[index].neighbors.push(this.cells[index+1+sizeX])
                }

                if(x > 0 && y < sizeY-1){
                    this.cells[index].neighbors.push(this.cells[index-1+sizeX])
                }

                if(x < sizeX-1 && y > 0){
                    this.cells[index].neighbors.push(this.cells[index+1-sizeX])
                }
            }
        }


        this.start = this.cells[0]
        this.start.wall = false;

        this.end = this.cells[sizeX*sizeY-1];
        this.end.wall = false;

        this.start.g = 0;
        this.start.f = this.getH(this.start,this.end);

        this.openL = []
        this.closeL = [] //just for rendering

        this.openL.push(this.start)
    }

    draw(){
        //background(0);
        this.cells.forEach(c => {
            let col = color(255,255,255) 
            if(c.wall){
                col = color(0,0,0)
            }else if(this.openL.includes(c)){
                col = color(0,205,50)
            }else if(this.closeL.includes(c)){
                col = color(150,150,150)
            }
            c.draw(col)
        })
    }

    getH(a,b){
        return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2))
    }

    reconstructPath(cell,cellColor){
        let tmp = cell
        var next = cell
        while(tmp){
            tmp.draw(cellColor)
            
            stroke(color(255,0,0))
            line(tmp.x*tmp.sizeX+tmp.sizeX/2,tmp.y*tmp.sizeY+tmp.sizeY/2,next.x*next.sizeX+next.sizeX/2,next.y*next.sizeY+next.sizeY/2)

            next = tmp
            tmp = tmp.prev
        }
    }

    solveStep(){
        if(this.openL.length != 0){

            var lowestF = Infinity
            var indexOfLowestF = -1
            for(var i = 0; i<this.openL.length;i++){
                if(this.openL[i].f < lowestF){
                    lowestF = this.openL[i].f
                    indexOfLowestF = i
                }
            }

            var current = this.openL[indexOfLowestF]

            

            if(current === this.end){ //found solution
                console.log("Done");
                this.reconstructPath(current,color(248,252,0))
                noLoop();
                return;
            }
            
            //render path
            this.reconstructPath(current,color(150,0,155))

            this.openL.splice(indexOfLowestF,1);
            this.closeL.push(current);

            current.neighbors.forEach(neighbor => {
                if(!neighbor.wall){
                    let posG = current.g + 1;
                    if(posG < neighbor.g){
                        neighbor.prev = current
                        neighbor.g = posG
                        neighbor.f = posG + this.getH(neighbor,this.end)
                        if(!this.openL.includes(neighbor)){
                            this.openL.push(neighbor)
                        }
                    }
                }
            })

        }else{
            console.log("No Solution");
            noLoop();
        }
    } 
}