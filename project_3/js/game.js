
// initializing constants
const cellWidth = 24; 
const cellSpacing = 0;
const gameContainer = document.querySelector("#gameContainer");
const container = document.querySelector("#worldContainer");
const start = document.querySelector("#startScreen");
const lose = document.querySelector("#loseScreen");
const win = document.querySelector("#winScreen");

const startBtn = document.querySelector("#startBtn");
const retryBtn = document.querySelector("#retryBtn");
let cells = []; // the HTML elements - our "view"

// faking an enumeration here
// mapped to wasd
const keyboard = Object.freeze({
	SHIFT: 		16,
	SPACE: 		32,
	LEFT: 		65, 
	UP: 		87, 
	RIGHT: 		68, 
	DOWN: 		83
});

// this is an enumeration for gameworld levels
const worldTile = Object.freeze({
	FLOOR: 		0,
	WALL: 		1,
	GRASS: 		2,
	WATER: 		3,
	GROUND: 	4
});

// HP bar/timer
const hpTimer = document.querySelector("#hpFill");
let timer;

// sound that plays when the player enters a water tile
let waterAudio = undefined;

// sound that plays when the player bumps into a wall
let bumpAudio = undefined;

// background music that plays through out the page
let bgMusic = undefined;

// sound that plays when the player loses the game
let loseAudio = undefined;

// sound that plays when the player wins
let winAudio = undefined;

// i didn't have time to implement this ^^^^ :'D

// level data is over in gamedata.js
let currentLevelNumber = 1;
let currentGameWorld = undefined;   // a 2D array - the grid:  walls, floors, water, etc...
let currentGameObjects = undefined; // a 1D array - stuff that's on top of the grid and can move: monsters, treasure, keys, etc...

// the player - uses ES6 object literal syntax
const player = Object.seal({
	x:-1,
	y:-1,
	element: undefined,
	moveRight(){this.x++;},
	moveDown(){this.y++;},
	moveLeft(){this.x--;},
	moveUp(){this.y--;},
});

// glass object for later referencing
// is an object but doesn't use object literal syntax
let glass = {
	x: undefined,
	y: undefined,
	element: undefined
}

// II. INIT code
window.onload = ()=>{
	// adding audio
	waterAudio = document.querySelector("#waterAudio");
	waterAudio.volume = 0.3;

	bumpAudio = document.querySelector("#bumpAudio");
	bumpAudio.volume = 0.3;

	bgMusic = document.querySelector("#bgMusic");
	bgMusic.volume = 0.2;

	loseAudio = document.querySelector("#loseAudio");
	loseAudio.volume = 0.3;

	winAudio = document.querySelector("#winAudio");
	winAudio.volume = 0.3;
	startScreen();
}

// assigning the start and retry buttons their onclick functionc (will re/load & re/start the game)
startBtn.onclick = () => startGame();
retryBtn.onclick = () => startGame();

// III. FUNCTIONS
// the elements on the screen that won't change - our "view"
function startScreen(){
	gameContainer.style.display = "none";
	lose.style.display = "none";
	win.style.display = "none";
	start.style.display = "block";
}

function startGame(){
	// hiding any previously shown screens
	start.style.display = "none";
	lose.style.display = "none";

	// first game initialization. this
	currentGameWorld = gameworld["world" + currentLevelNumber];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows,numCols);
	drawGrid(currentGameWorld);
	loadLevel(currentLevelNumber);
	drawGameObjects(currentGameObjects);
	setupEvents();

	gameContainer.style.display = "block";
	bgMusic.play();
}

function loseGame(){
	gameContainer.style.display = "none";
	lose.style.display = "block";
	bgMusic.muted = true;
	loseAudio.play();
}

function winGame(){
	gameContainer.style.display = "none";
	win.style.display = "block";
	bgMusic.muted = true;
	winAudio.play();
}

function createGridElements(numRows,numCols){
	const span = document.createElement('span');
	span.className = 'cell';
	for (let row=0;row<numRows;row++){
	cells.push([]);
		for (let col=0;col<numCols;col++){
			let cell = span.cloneNode();
			cell.style.left = `${col * (cellWidth+cellSpacing)}px`;
			cell.style.top = `${row * (cellWidth+cellSpacing)}px`;
			container.appendChild(cell);
			cells[row][col] = cell;
		}
	}
}

// the elements on the screen that can move and change - also part of the "view"
function loadLevel(levelNum){
	currentGameObjects = []; // clear out the old array
	const node =  document.createElement("span");
	node.className = "gameObject";	
	
	/* let's instantiate our game objects */
	// pull the current level data
	const levelObjects = allGameObjects["level" + levelNum];
	
	// loop through this level's objects ... 
	for (let obj of levelObjects){
		if(obj.type == "player"){
			player.x = obj.x;
			player.y = obj.y;

			player.element = node.cloneNode(true);
			player.element.classList.add("player");
			container.appendChild(player.element);
		}

		if(obj.type == "glass"){
			glass.x = obj.x;
			glass.y = obj.y;
			glass.element = node.cloneNode(true);
			glass.element.classList.add("player");
			container.appendChild(glass.element);
		}

		const clone = Object.assign({}, obj); 		// clone the object
		clone.element = node.cloneNode(true); 		// clone the element
		clone.element.classList.add(obj.className); // add the className so we see the right image
		currentGameObjects.push(clone);				// add to currentGameObjects array  (so it gets moved onto the map)
		container.appendChild(clone.element);		// add to DOM tree (so we can see it!)
	}

	startTimer(7000);
}

// draws the grid in the designated container
function drawGrid(array){
	const numCols = array[0].length;
	const numRows = array.length;
	for (let row=0;row<numRows;row++){
		for (let col=0;col<numCols;col++){
			const tile = array[row][col];
			const element = cells[row][col];
			
			switch(tile) {
    			case worldTile.FLOOR:
        		element.classList.add("floor")
        		break;
        		
        		case worldTile.WALL:
        		element.classList.add("wall");
        		break;
        		
        		case worldTile.GRASS:
        		element.classList.add("grass");
        		break;
        		
        		case worldTile.WATER:
        		element.classList.add("water");
        		break;
        		
        		case worldTile.GROUND:
        		element.classList.add("ground");
        		break;
			}
		}
	}
}

// draws the game objects onto the screen
function drawGameObjects(array){
	// game object
	for (let gameObject of array){
		// draws the player & glass in the maze correctly
		if(gameObject.type == "glass"){
			glass.x = gameObject.x;
			glass.y = gameObject.y;

			gameObject.element.style.left = `${gameObject.x * (cellWidth + cellSpacing)}px`;
			gameObject.element.style.top = `${gameObject.y * (cellWidth + cellSpacing)}px`;
		}
		else if(gameObject.type == "player"){
			player.element.style.left = `${player.x * (cellWidth + cellSpacing)}px`;
			player.element.style.top = `${player.y * (cellWidth + cellSpacing)}px`;
		}
	}
	
}

// loads the next level
function loadNext(levelNum){
	// resetting everything
	clearInterval(timer);
	cells = [];
	container.innerHTML = "";

	// reconfiguring world based on current world level
	// i have a separate function that handles this, but when i tried replacing it, it broke :P 
	// not sure why, but i'm leaving this block here just in case
	currentGameWorld = gameworld["world" + levelNum];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows,numCols);
	drawGrid(currentGameWorld);
	loadLevel(levelNum);
	drawGameObjects(currentGameObjects);
}

// player movement
function movePlayer(e){
	let nextX;
	let nextY;

	switch(e.keyCode){
		case keyboard.RIGHT:
		nextX = player.x + 1;
		nextY = player.y;
		if(checkIsLegalMove(nextX,nextY)) player.moveRight();
		isWater(nextX, nextY);
		didWin(nextX, nextY);
		break;
		
		case keyboard.DOWN:
		nextX = player.x;
		nextY = player.y + 1;
		if(checkIsLegalMove(nextX,nextY)) player.moveDown();
		isWater(nextX, nextY);
		didWin(nextX, nextY);
		break;
		
		case keyboard.LEFT:
		nextX = player.x - 1;
		nextY = player.y;
		if(checkIsLegalMove(nextX,nextY)) player.moveLeft();
		isWater(nextX, nextY);
		didWin(nextX, nextY);
		break;
		
		case keyboard.UP:
		nextX = player.x;
		nextY = player.y - 1;
		if(checkIsLegalMove(nextX,nextY)) player.moveUp();
		isWater(nextX, nextY);
		didWin(nextX, nextY);
		break;
	}
	
	function checkIsLegalMove(nextX,nextY){
		let nextTile = currentGameWorld[nextY][nextX];
		if (nextTile != worldTile.WALL){
			return true;
		}else{
			bumpAudio.play();
			return false;
		}
	}

	// checks if the current tile is water (applies after the player moves)
	function isWater(cX, cY){
		let thisTile = currentGameWorld[cY][cX];
		if(thisTile == worldTile.WATER){
			waterAudio.play();
			clearInterval(timer);
			startTimer(7000);
			console.log("x: " + cX + " y: " + cY);
			cells[cY][cX].classList.remove("water")
			cells[cY][cX].classList.add("floor")
			console.log(cells[cY][cX]);
		}
		else{
			return;
		}
	}

	// checks if the current tile is the glass (applies after the player moves)
	function didWin(cX, cY){
		if(cX == glass.x && cY == glass.y){
			if(currentLevelNumber > 1){
				// clears timer so the game over screen doesn't show
				clearInterval(timer);
				winGame();
			}
			else{
				currentLevelNumber ++;
				loadNext(currentLevelNumber);
			}
		}
	}
}

// IV. EVENTS
function setupEvents(){
	window.onkeydown = (e)=>{
		movePlayer(e);
		drawGameObjects(currentGameObjects);
	};
}

// timer function for health
function startTimer(endtime) {
	let t = endtime;

  	timer = setInterval(() => {
	// every 100 milliseconds, the width changes
	t -= 100;
	// width decreases by the percentage of time left
    hpTimer.style.width = ((t / endtime) * 100) + "%";

    if (t <= 0) {
      clearInterval(timer);
	  console.log("timer up! game over!");
	  loseGame();
    }
  }, 100);
}