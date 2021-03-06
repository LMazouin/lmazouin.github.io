//import PromptSync from 'prompt-sync';
//const prompt = PromptSync({sigint: true});

const timer = ms => new Promise(res => setTimeout(res, ms));

const prompt = require('prompt-sync')({sigint: true});

// global variables
const hat = '\x1b[33m\x1b[1m^\x1b[0m';
const hole = 'O';
const fieldCharacter = '\x1b[32m░\x1b[0m';
const pathCharacter = '\x1b[33m\x1b[5m\x1b[1m*\x1b[0m';
const oldPathCharacter = '\x1b[33m*\x1b[0m';
const tracedPathCharacter = '\x1b[34m*\x1b[0m';
const burntPathCharacter = '\x1b[31m*\x1b[0m';

// hole density
const holeProbability = 0.4;

const playerMovements = {
	r: {dx: 1, dy: 0},
	l: {dx: -1, dy: 0},
	d: {dx: 0, dy: 1},
	u: {dx: 0, dy: -1},
};

const oppositeDirections = {
	r: 'l',
	l: 'r',
	d: 'u',
	u: 'd',
};

const performedMoves = [];

/**
 * returns an integer random number
 * @param{number} min
 * @param{number} max
 * @return{number}
 */
const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

/**
 * returns a randomly generated field matrix based on a given height and width
 * @param{number} width
 * @param{number} height
 * @return{array} matrix
 */
const createFieldMatrix = (width, height) => {
	const matrix = [];
	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			const random = Math.random();
			if (random <= holeProbability) {
				row.push(hole);
			} else {
				row.push(fieldCharacter);
			}
		}
		matrix.push(row);
	}
	return matrix;
};

const manhattanDistance = (positionA, positionB) => {
	const xA = positionA.x;
	const yA = positionA.y;
	const xB = positionB.x;
	const yB = positionB.y;
	const distanceX = Math.abs(xB - xA);
	const distanceY = Math.abs(yB - yA);
	return distanceX + distanceY;
};


const createVisitedMatrix = (width, height) => {
	const matrix = [];
	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			row.push(0);
		}
		matrix.push(row);
	}
	return matrix;
};

const createDistanceMatrix = (width, height) => {
	const matrix = [];
	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			row.push(-1);
		}
		matrix.push(row);
	}
	return matrix;

};

/**
 * represents a field
 */
class Field {
	/**
   * @param{number} width - horiziontal size of the field
   * @param{number} height - vertical size of the field
   */
	constructor(width, height) {
		// **********************************
		// coordinate system for the field
		// x = col index
		// y = row index
		//  y\x 0 1 2
		//  0   * ░ O
		//  1   ░ O ░
		//  2   ░ ^ ░
		// **********************************
		this._width = width;
		this._height = height;
		this._matrix = createFieldMatrix(width, height);
		this._distanceMatrix = createDistanceMatrix(width, height);
		this._playerPosition = {x: 0, y: 0};
		this._hatPosition = {x: 0, y: 0};
		this._distance = 0;
	}
	/**
   * returns the player's position
   * @return{object}
   */
	get playerPosition() {
		return this._playerPosition;
	}
	/**
   * returns the position of the hat
   */
	get hatPosition() {
		return this._hatPosition;
	}
	/**
   * creates list of cells with a certain distance
   */
	createMatchingCells(distance) {
		const matchingCells = [];
		for (let i = 0; i < this._height; i++) {
			for (let j = 0; j < this._width; j++) {
				if (this._distanceMatrix[i][j] === distance) {
					const cell = {x: j, y: i};
					matchingCells.push(cell);
				} else {
					continue;
				}
			} 
		}
		return matchingCells;
	}
	/**
   * initializes game
   */
	init() {
		this._matrix.forEach((row) => {
			row.map((col) => {
				if (col === pathCharacter || col === oldPathCharacter ||
              col === hat) {
					return fieldCharacter;
				}
			});
		});
		let validPlayerPosition = false;
		while (!validPlayerPosition) {
			const randomX = getRandomNumber(0, this._width); 
			const randomY = getRandomNumber(0, this._height);
			if (!this.detectHole(randomX, randomY)) {
				validPlayerPosition = true;
				this._matrix[randomY][randomX] = pathCharacter;
				this._playerPosition.x = randomX;
				this._playerPosition.y = randomY;
			}
		}
		let validHatPosition = false;
		while (!validHatPosition) {
			const randomX = getRandomNumber(0, this._width); 
			const randomY = getRandomNumber(0, this._height);
			if (!this.detectHole(randomX, randomY) && 
      this._matrix[randomY][randomX] !== pathCharacter) {
				validHatPosition = true;
				this._matrix[randomY][randomX] = hat;
				this._distanceMatrix[randomY][randomX] = 0;
				this._hatPosition.x = randomX;
				this._hatPosition.y = randomY;
			}
		}
	}
	/**
   * checks whether the adjacent cells they are holes or the starting point
   */
	checkAdjacentCells(x, y, currentDistance) {
		const adjacentCells = [ 
			{x: x+1, y: y}, 
			{x: x-1, y: y},
			{x: x, y: y+1},
			{x: x, y: y-1},
		];
		//console.table(adjacentCells);
		let updatedCells = 0;
		for (const cell of adjacentCells) {
			const {x, y} = cell;
			if (!this.isWithinBoundaries(x, y)) {
				continue;
			} else if (this._matrix[y][x] === pathCharacter) {
				return pathCharacter;
			} else if (this._matrix[y][x] === fieldCharacter || 
      this._distanceMatrix[y][x] > currentDistance + 1) {
				this._distanceMatrix[y][x] = currentDistance + 1;
				this._matrix[y][x] = burntPathCharacter;
			}
			updatedCells++;
		}
		return updatedCells;
	}
	/**
   * backtraces the path from the initial pplayer position to the hat
   */
	backtracePath(x, y, currentDistance) {
		const adjacentCells = [ 
			{x: x+1, y: y}, 
			{x: x-1, y: y},
			{x: x, y: y+1},
			{x: x, y: y-1},
		];
		for (const cell of adjacentCells) {
			const {x, y} = cell;
			if (!this.isWithinBoundaries(x, y)) {
				continue;
			} else if (this._distanceMatrix[y][x] === currentDistance) {
				this._matrix[y][x] = tracedPathCharacter; 
				return cell;
			}
		}
    
	}
	/**
   * determines whether the player is within the boundaries or not
   * @param{number} x - x coordinate of the player
   * @param{number} y - y coordinate of the player
   * @return{boolean}
   */
	isWithinBoundaries(x, y) {
		if (x >= this._width || x < 0 || y >= this._height || y < 0) {
			return false;
		} else {
			return true;  
		}
	}
	/**
   * determines whether there is a hole or not
   * @param{number} x - x coordinate of the player
   * @param{number} y - y coordinate of the player
   * @return{boolean}
   */
	detectHole(x, y) {
		return (this._matrix[y][x] === hole) ? true : false;
	}
	/**
   * determines whether the player can move or not
   * @param{number} x - x coordinate of the player
   * @param{number} y - y coordinate of the player
   * @return{boolean}
   */
	canMove(x, y) {
		if (!this.isWithinBoundaries(x, y) || this.detectHole(x, y)){
			return false;
		} else {
			return true;
		}
	}
	/**
   * moves the player to the right
   * @param{string} direction - right (r), left (l), down (d), up (u)
   * @return{number}
   */
	move(direction) {
		// needs the current position of the player
		// determine whether it is possible to move
		// determine whether there is a hole or the hat
		const matrix = this._matrix;
		const {x, y} = this._playerPosition;
		const {dx, dy} = playerMovements[direction];
		const newX = x + dx;
		const newY = y + dy;
		if (!this.canMove(newX, newY)) {
			// console.log('YOU FELL INTO A HOLE !!!');
			return 0;
		}
		if (matrix[newY][newX] === hat) {
			// console.log('YOU FOUND THE YOUR HAT !!!');
			return 2;
		}
		this._playerPosition.x = newX;
		this._playerPosition.y = newY;
		this._matrix[y][x] = oldPathCharacter;
		this._matrix[newY][newX] = pathCharacter;
		return 1;
	}
	/**
   * AI player function that finds the hat automatically
   */
	isVisitedOnce(x, y) {
		if (this._visitedMatrix[x][y] === 1) {
			return true;
		} else {
			return false;
		}
	}
	autoMove() {
	}
	autoPlay() {
	}
	async grassfireAlgorithm() {

		
		// console.log(this._distance);
		// console.table(matchingCells);

		let playerFound = false;
		let noPath = false;
	
		while (!playerFound && !noPath) {

			const matchingCells = this.createMatchingCells(this._distance);
			let modifiedCells = 0;
			for (const cell of matchingCells) {
				const {x, y} = cell;
				const adjacentCells = this.checkAdjacentCells(x, y, this._distance);
				
				// console.clear();
				// this.print();
				
				if (adjacentCells === pathCharacter) {
					playerFound = true;
					break;
				} else {
					modifiedCells += adjacentCells;
				}
			}

			if (modifiedCells === 0) {
				noPath = true;
				this.print();
				return 0;
			} else if (!playerFound) {
				this._distance++;
			}
		}
		if (playerFound) {
			let x = this._playerPosition.x;
			let y = this._playerPosition.y;
			while (this._distance > 0) {
				const nextCell = this.backtracePath(x, y, this._distance);
				x = nextCell.x;
				y = nextCell.y;
				this._distance--;
				
				await timer(500);
				console.clear();
				this.print();

			}
			return 2;
		}
	}
	/**
   * prints a string representation of the field
   */
	print() {
		let str = '\n';
		this._matrix.forEach((row) => {
			str += '\t';
			row.forEach((col) => {
				str += `${col} `;
			});
			str += '\n';
		});
		console.log(str);
		
	}
}


// minimal example
const matrix = [
	['*', '░', 'O'],
	['░', 'O', '░'],
	['░', '^', '░'],
];

const width = 50;
const height = 40;

const field = new Field(width, height);

// console.clear();
field.init();
field.print();

let status = 1;

field.grassfireAlgorithm();

//while (status === 1) {
//	console.log('\n');
//	// const direction = prompt('YOUR MOVE! (r:right, l:left, d:down, u:up) ');
//	const out = prompt('HIT ENTER! ');
//	// console.clear();
//	//status = field.move(direction);
//	field.grassfireAlgorithm();
//	// field.print();

//	const {playerPosition, hatPosition} = field;
//	const distance = manhattanDistance(playerPosition, hatPosition);
//	console.log(`\nDISTANCE TO TARGET : ${distance}\n`);
//}
//if (status === 0) {
//	console.log('GAME OVER');
//} else if (status === 2) {
//	console.log('SUCCESS');
//}
