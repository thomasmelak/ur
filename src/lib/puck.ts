import { type row, type square } from './index';

export class Puck {
	id: string;
	initialWidth?: number;
	squareRef?: string;
	isPlayer: boolean;
	isScored: boolean = false;

	constructor(options: ipuck) {
		(this.id = options.id), (this.isPlayer = options.isPlayer);
	}

	score() {
		const thisPuck = document.getElementById(this.id)!;
		thisPuck.classList.add('scored');
		thisPuck.style.width = `${this.initialWidth}px`;
		this.isScored = true;
	}

	reset() {
		const thisPuck = document.getElementById(this.id)!;
		thisPuck.style.transform = ``;
		thisPuck.style.width = `${this.initialWidth}px`;

		thisPuck.classList.remove('absolute');

		this.squareRef = undefined;
	}

	findIdToGoTo(moves: number, rows: row[]) {
		const boardState = rows.flatMap((row) => {
			return row.squares;
		});
		if (this.squareRef !== undefined) {
			// moves are this puck's position onboard + requestedMoves
			return boardState.find((square) => square.refId === this.squareRef)!.id + moves;
		} else {
			// Moves are requrested moves;
			return moves;
		}
	}

	canMove(moves: number, rows: row[], otherPucks: Puck[], ownPucks: Puck[], targetSquare: square) {
		const boardState = rows.flatMap((row) => {
			return row.squares;
		});
		const rosetteSquares = boardState.filter((square) => square.isRosette);

		const idToGoTo = this.findIdToGoTo(moves, rows);

		const isTargetRefRosette =
			rosetteSquares.find((square) => square.refId === targetSquare.refId) !== undefined;

		const isTargetInRange = targetSquare.id === idToGoTo;

		const otherPuck = otherPucks.find((puck) => puck.squareRef === targetSquare.refId);
		const ownPuck = ownPucks.find((puck) => puck.squareRef === targetSquare.refId);

		// Target is occupied by own puck;
		if (ownPuck) {
			return false;
		}

		// Target is occupied by opponent puck;
		if (otherPuck && isTargetRefRosette) {
			return false;
		}

		// Target square is allowed for number of moves.
		return isTargetInRange;
	}

	moveBy(moves: number, rows: row[], otherPucks: Puck[], ownPucks: Puck[]) {
		// Atttempts to move and returns [success, returnTurn, score ]
		const thisPuck = document.getElementById(this.id)!;
		const boardState = rows.flatMap((row) => {
			return row.squares;
		});

		const board = document.getElementById('board')!;
		const idToGoTo = this.findIdToGoTo(moves, rows);

		if (this.squareRef === undefined) {
			this.initialWidth = thisPuck.offsetWidth;
		}

		const targetSquare = this.isPlayer
			? boardState.find((square) => {
					return square.id === idToGoTo;
				})
			: boardState.findLast((square) => {
					return square.id === idToGoTo;
				});

		if (targetSquare === undefined) return [false, false, false];

		const otherPuck = otherPucks.find((puck) => puck.squareRef === targetSquare.refId);

		if (!this.canMove(moves, rows, otherPucks, ownPucks, targetSquare))
			return [false, false, false];

		if (otherPuck) {
			otherPuck.reset();
		}

		const targetElement = document.getElementById(targetSquare.refId)!;
		const puckSize = targetElement!.offsetWidth / 2;

		const puckTop = targetElement.offsetTop + (targetElement.offsetWidth - puckSize) / 2;
		const puckLeft = this.isPlayer
			? targetElement.offsetLeft +
				targetElement.offsetWidth +
				20 +
				(targetElement.offsetWidth - puckSize) / 2
			: targetElement.offsetLeft -
				board.offsetWidth -
				20 +
				(targetElement.offsetWidth - puckSize) / 2;

		thisPuck.style.transform = `translate(${puckLeft}px, ${puckTop}px)`;
		thisPuck.style.width = `${puckSize}px`;
		thisPuck.classList.add('absolute');

		// Set this pucks' squareRef to target square refid.
		this.squareRef = targetSquare.refId;

		if (targetSquare.isEnd) {
			this.score();
		}

		// Returns true if turn has to be changed.
		return [true, !targetSquare.isRosette, targetSquare.isEnd];
	}
}

export interface ipuck {
	id: string;
	isPlayer: boolean;
}
