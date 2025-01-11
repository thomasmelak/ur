// place files you want to import through the `$lib` alias in this folder.
//
import { Puck } from './puck';
export type square = {
	isEmpty: boolean;
	isRosette: boolean;
	isEnd: boolean;
	refId: string;
	id: number;
};

export type row = {
	squares: square[];
};

export function draw() {
	// return 0;
	const max = 0.5;
	const min = 0.0;
	const digits = 1;
	const rand = parseFloat(
		Math.random().toLocaleString([], {
			style: 'decimal',
			roundingMode: 'ceil',
			maximumFractionDigits: digits
		})
	);

	const clamp = Math.min(Math.max(rand, min), max);

	const range = max - min;

	let multiplier;

	if (rand === max || rand === min) {
		// number exactly on range;
		multiplier = rand.toFixed(digits);
	} else if (clamp === max) {
		// number is too large;
		multiplier =
			rand - clamp > range
				? ((rand % range) + min).toFixed(digits)
				: (min + rand - clamp).toFixed(digits);
	} else if (clamp === min) {
		// number is too small;
		multiplier =
			rand > range ? ((rand % range) + min).toFixed(digits) : (clamp + rand).toFixed(digits);
	} else {
		// number within range
		multiplier = clamp.toFixed(digits);
	}

	multiplier = parseFloat(multiplier);

	if (multiplier === 0.5) {
		return 0;
	}

	return multiplier * 10;
}

export function isRosette(rowIndex: number, squareIndex: number) {
	switch (rowIndex) {
		case 0:
			return squareIndex !== 1;
		case 3:
			return squareIndex === 1;
		case 6:
			return squareIndex !== 1;

		default:
			return false;
	}
}

function createId(rowIndex: number, squareIndex: number) {
	// Player columns
	if (squareIndex === 0 || squareIndex === 2) {
		if (rowIndex > 4) {
			return 11 + (9 - rowIndex);
		} else {
			return 4 - rowIndex;
		}
	} else {
		// Center Columns
		return rowIndex + 5;
	}
}

export const rows = Array(8)
	.keys()
	.map((rowIndex): row => {
		return {
			squares: Array(3)
				.keys()
				.map((squareIndex): square => {
					return {
						isEmpty: rowIndex === 4 && squareIndex !== 1,
						isRosette: isRosette(rowIndex, squareIndex),
						id: createId(rowIndex, squareIndex),
						isEnd: rowIndex === 5 && squareIndex != 1,
						refId: 's' + (rowIndex + squareIndex + rowIndex * 2)
					};
				})
				.toArray()
		};
	})
	.toArray();

const pucks = () =>
	Array(6)
		.keys()
		.map((index) => {
			const puck = new Puck({ id: 'p' + index, isPlayer: true });
			return puck;
		})
		.toArray();

const opponentPucks = () =>
	Array(6)
		.keys()
		.map((index) => {
			const puck = new Puck({ id: 'o' + index, isPlayer: false });

			return puck;
		})
		.toArray();

export const createPucks = () => {
	return {
		pucks: pucks(),
		opponentPucks: opponentPucks()
	};
};
