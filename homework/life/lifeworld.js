const lifeworld ={
    init(numCols, numRows){
        this.numCols = numCols;
        this.numRows = numRows;
        this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.randomSetup();
    },

    buildArray(){
        let outerArray = [];
        for (let row = 0; row < this.numRows; row++){
            let innerArray = [];
            for (let col = 0; col < this.numCols; col++){
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup(){
        for(let row = 0; row < this.numRows; row++){
            for(let col = 0; col < this.numCols; col++){
                this.world[row][col] = 0;
                if(Math.random() < .1){
                    this.world[row][col] = 1;
                }
            }
        }
    },

    getLivingNeighbors(row, col){
        // TODO:
		// row and col should > than 0, if not return 0
        if(row < 0 || col < 0){
            return 0;
        }
		// row and col should be < the length of the applicable array, minus 1. If not return 0
        else if(row > this.numRows || col > this.numCols){
            return 0;
        }
		
		
		// count up how many neighbors are alive at N,NE,E,SE,S,SW,W,SE - use this.world[row][col-1] etc
		
		// return that sum
    },

    step(){
        this.randomSetup();
    }
}