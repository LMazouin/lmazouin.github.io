const prompt = require('prompt-sync')({sigint: true});

// global variables
const hat = '\x1b[33m\x1b[1m^\x1b[0m';
const hole = 'O';
const fieldCharacter = '\x1b[32m░\x1b[0m';
const pathCharacter = '\x1b[33m\x1b[5m\x1b[1m*\x1b[0m';
const oldPathCharacter = '\x1b[34m*\x1b[0m';
const visitedPathCharacter = '\x1b[31m*\x1b[0m';

const hatPosition = {x: 0, y: 0};
// probability to tune the number of holes in the field
const holeProbability = 20;

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
 * returns a random number
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
			const random = getRandomNumber(1, 100);
			if (random <= holeProbability) {
				row.push(hole);
			} else {
				row.push(fieldCharacter);
			}
		}
		matrix.push(row);
	}
	// put the hat a random location in the field
	const randomX = getRandomNumber(0, width);
	const randomY = getRandomNumber(0, height);
	matrix[randomY][randomX] = hat;
	hatPosition.x = randomX;
	hatPosition.y = randomY;
	// put the the beginning of the path at (0, 0)
	matrix[0][0] = pathCharacter;
	return matrix;
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

const manhattanDistance = (positionA, positionB) => {
	const xA = positionA.x;
	const yA = positionA.y;
	const xB = positionB.x;
	const yB = positionB.y;
	const distanceX = Math.abs(xB - xA);
	const distanceY = Math.abs(yB - yA);
	return distanceX + distanceY;
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
		this._visitedMatrix = createVisitedMatrix(width, height);
		this._previousMove = '';
		this._playerPosition = {x: 0, y: 0};
	}
	/**
   * returns the player's position
   * @return{object}
   */
	get playerPosition() {
		return this._playerPosition;
	}
	/**
   * determines whether it is possible to move or not
   * @param{number} x - x coordinate of the player
   * @param{number} y - y coordinate of the player
   * @return{boolean}
   */
	isWithinBoundaries(x, y) {
		if (x >= this._width || x < 0 || y >= this._height || y < 0) {
			return false;
		}
		return true;
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
		if (!this.isWithinBoundaries(newX, newY)) {
			// console.log('CANNOT MOVE OUT OF THE FIELD !!!');
			return 0;
		}
		if (matrix[newY][newX] === hole) {
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
	canMove(x, y) {
		if (!this.isWithinBoundaries(y, x) || 
    this._matrix[y][x] === hole || 
    this._visitedMatrix[x][y] > 1) {
			return false;
		} else {
			return true;
		}
	}
	isVisitedOnce(x, y) {
		if (this._visitedMatrix[x][y] === 1) {
			return true;
		} else {
			return false;
		}
	}
	autoMove() {
		// check where we can move
		const {x, y} = this._playerPosition;
		const directions = []; 
		// go right?
		if (this.canMove(x+1, y)) {
			directions.push('r');
		}
		// go left?
		if (this.canMove(x-1, y)) {
			directions.push('l');
		}
		// go down?
		if (this.canMove(x, y+1)) {
			directions.push('d');
		}
		// go up?
		if (this.canMove(x, y-1)) {
			directions.push('u');
		}
		if (directions.length === 0) {
			console.log('LOOKS LIKE WE ARE STUCK...');
			return 0;
		}
		let randomDirection = '';	
		const newDirections = [];
		if (directions.length > 1) {
      
			directions.forEach((direction) => {
				const {dx, dy} = playerMovements[direction];
				const newX = x + dx;
				const newY = y + dy;
				if (!this.isVisitedOnce(newX, newY)) {
					newDirections.push(direction);
				} 
			});
			if (newDirections.length === 0) {
				const random = getRandomNumber(0, directions.length);
				randomDirection = directions[random];
			} else {
				const random = getRandomNumber(0, newDirections.length);
				randomDirection = newDirections[random];
			}
		} else {
			randomDirection = directions[0];
		}
		
		this._previousMove = randomDirection; 

		const {dx, dy} = playerMovements[randomDirection];
		const newX = x + dx;
		const newY = y + dy;
		// check if we reached the hat
		if (this._matrix[newY][newX] === hat) {
			return 2;
		}
		this._playerPosition.x = newX;
		this._playerPosition.y = newY;
		this._matrix[y][x] = oldPathCharacter;
		this._matrix[newY][newX] = pathCharacter;
		this._visitedMatrix[x][y]++;
		if (this._visitedMatrix[x][y] === 2) {
			this._matrix[y][x] = visitedPathCharacter;
		}
		return 1;
	}
	autoPlay() {
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

const width = 10;
const height = 15;

const field = new Field(width, height);

console.clear();
field.print();

let status = 1;

while (status === 1) {
	console.log('\n');
	// const direction = prompt('YOUR MOVE! (r:right, l:left, d:down, u:up) ');
	const out = prompt('HIT ENTER! ');
	console.clear();
	// status = field.move(direction);
	status = field.autoMove();
	field.print();

	const {playerPosition} = field;
	const distance = manhattanDistance(playerPosition, hatPosition);
	console.log(`\nDISTANCE TO TARGET : ${distance}\n`);
}
if (status === 0) {
	console.log('GAME OVER');
} else if (status === 2) {
	console.log('SUCCESS');
}
