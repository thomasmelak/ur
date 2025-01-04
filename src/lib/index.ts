// place files you want to import through the `$lib` alias in this folder.
export type square = {
	isEmpty: boolean;
	isRosette: boolean;
	isEnd: boolean;
	id: number;
};

export type row = {
	squares: square[];
};

export function isRosette(rowIndex: number, squareIndex: number) {
	switch (rowIndex) {
		case 4:
			return squareIndex === 1;
		case 1:
			return squareIndex !== 1;
		case 7:
			return squareIndex !== 1;

		default:
			return false;
	}
}

function createId(rowIndex: number, squareIndex: number) {
	// Player columns
	if (squareIndex === 0 || squareIndex === 2) {
		if (rowIndex > 2) {
			return 11 + (7 - rowIndex);
		} else {
			return 2 - rowIndex;
		}
	} else {
		// Center Columns
		return rowIndex + 3;
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
						isEmpty: rowIndex === 2 && squareIndex !== 1,
						isRosette: isRosette(rowIndex, squareIndex),
						id: createId(rowIndex, squareIndex),
						isEnd: rowIndex === 3 && squareIndex != 1
					};
				})
				.toArray()
		};
	})
	.toArray();
