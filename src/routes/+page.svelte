<script lang="ts">
	import { type square, createPucks, draw, rows } from '$lib/index';
	import { Puck } from '$lib/puck';

	function isSquareDisabled(square: square, squareIndex: number) {
		if (drawing || shouldDraw()) {
			return true;
		}
		if (square.isEmpty) {
			return true;
		}

		if (activePuck === undefined) return true;

		if (turn) {
			if (squareIndex === 2) {
				return true;
			}
			return !activePuck.canMove(moves, rows, opponentPucks, pucks, square);
		} else {
			if (squareIndex === 0) {
				return true;
			}

			return !activePuck.canMove(moves, rows, pucks, opponentPucks, square);
		}
	}

	function isPuckDisabled(puck: Puck) {
		if ((turn && !puck.isPlayer) || (!turn && puck.isPlayer)) return true;
		return drawing || shouldDraw() || puck.isScored;
	}

	function roll() {
		drawing = true;

		setTimeout(() => {
			dr();
		}, 500);

		function dr() {
			moves = draw();
			drawing = false;
			if (moves === 0) {
				turn = !turn;
			}
		}
	}

	let squareWidth = $state(0);
	let puckSize = $derived(squareWidth * 0.5);

	let turn = $state(true);

	let moves = $state(0);

	let drawing = $state(false);

	let scores = $state({ player: 0, opponent: 0 });

	let activePuck: Puck | undefined = $state();

	const pucks: Puck[] = createPucks().pucks;
	const opponentPucks: Puck[] = createPucks().opponentPucks;

	function setActivePuck(puck: Puck) {
		if ((turn && !puck.isPlayer) || (!turn && puck.isPlayer)) return;
		activePuck = puck;
	}
	function resetActivePuck() {
		activePuck = undefined;
	}

	function shouldDraw() {
		return moves === 0;
	}
</script>

<div class="flex h-full flex-col items-center justify-center gap-4">
	<div class="flex gap-4">
		<div
			style="width: {squareWidth}px"
			class="flex aspect-square flex-col items-center justify-center gap-4 rounded-lg bg-white/20"
		>
			<button
				aria-label="draw"
				style="width: {puckSize}px"
				disabled={!shouldDraw()}
				class="puck {turn ? 'player' : 'opponent'} {drawing ? 'motion-preset-spin' : ''}"
				onclick={() => roll()}
			>
			</button>
			<span>Roll</span>
		</div>
		<div
			style="width: {squareWidth}px"
			class="flex aspect-square flex-col items-center justify-center gap-4 rounded-lg bg-white/20"
		>
			{moves} <span>Moves available</span>
		</div>
	</div>

	<div class="board relative" id="board">
		{#each rows as row}
			<div class="board-row">
				{#each row.squares as square, squareIndex}
					<div
						aria-label="square"
						id={square.refId}
						bind:offsetWidth={squareWidth}
						class:disabled={isSquareDisabled(square, squareIndex)}
						class="square{square.isRosette
							? ' rosette'
							: squareIndex === 1
								? ' battle'
								: square.isEmpty || square.isEnd
									? ' empty'
									: ''}"
					></div>
				{/each}
			</div>
		{/each}

		<div class="absolute flex w-full justify-between">
			<div
				class="relative flex aspect-square flex-col gap-4"
				style="height: {squareWidth}px; margin-left: -{squareWidth + 20}px"
			>
				<span>
					Score {scores.player}
				</span>

				<div class="flex">
					{#each pucks as puck}
						<button
							style="width: {squareWidth / 4}px"
							id={puck.id}
							aria-label={puck.id}
							onmouseenter={() => setActivePuck(puck)}
							onmouseleave={resetActivePuck}
							disabled={isPuckDisabled(puck)}
							class="puck offset"
							onclick={() => {
								resetActivePuck();
								let result = puck.moveBy(moves, rows, opponentPucks, pucks);
								turn = !result[1];
								if (result[0]) moves = 0;
								if (result[2]) scores.player++;
							}}
						></button>
					{/each}
				</div>
			</div>

			<div
				class="relative flex aspect-square flex-col flex-wrap items-end gap-4"
				style="height: {squareWidth}px; margin-right: -{squareWidth + 20}px"
			>
				<span>
					Score {scores.opponent}
				</span>
				<div class="flex flex-row-reverse">
					{#each opponentPucks as puck}
						<button
							style="width: {squareWidth / 4}px"
							id={puck.id}
							aria-label={puck.id}
							onmouseenter={() => setActivePuck(puck)}
							onmouseleave={resetActivePuck}
							disabled={isPuckDisabled(puck)}
							class="opponent puck offset"
							onclick={() => {
								resetActivePuck();
								let result = puck.moveBy(moves, rows, pucks, opponentPucks);
								turn = result[1];
								if (result[0]) moves = 0;
								if (result[2]) scores.opponent++;
							}}
						></button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
