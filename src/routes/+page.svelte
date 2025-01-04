<script lang="ts">
	import { onMount } from 'svelte';
	import { type square, rows } from '$lib/index';

	function isDisabled(square: square, squareIndex: number) {
		if (square.isEmpty) {
			return true;
		}

		// opponent is on rosette
		// if (
		// 	square.isRosette &&
		// 	(square.id === player.player.activeId || square.id === player.opponent.activeId)
		// ) {
		// 	return true;
		// }

		if (turn) {
			if (squareIndex === 2) {
				return true;
			}
			return square.id <= player.player.activeId || square.id > player.player.activeId + moves;
		} else {
			if (squareIndex === 0) {
				return true;
			}
			return (
				(square.id <= player.opponent.activeId && square.id !== -1) ||
				square.id > player.opponent.activeId + moves
			);
		}
	}
	function move(square: square, e: MouseEvent, squareIndex: number) {
		const element = e.target as HTMLHtmlElement;

		const puckTop = element.offsetTop + (element.offsetWidth - puckSize) / 2;
		const puckLeft = element.offsetLeft + (element.offsetWidth - puckSize) / 2;

		// Player 1 move
		if (turn) {
			player.player.activeId = square.id;
			player.player.puckRef!.style.width = `${puckSize}px`;
			player.player.puckRef!.style.transform = `translate(${puckLeft}px, ${puckTop}px)`;
			if (square.id === player.opponent.activeId && squareIndex === 1) {
				player.opponent.activeId = 0;
				resetPuck(!turn);
			}
		} else {
			player.opponent.activeId = square.id;
			player.opponent.puckRef!.style.width = `${puckSize}px`;
			player.opponent.puckRef!.style.transform = `translate(${puckLeft}px, ${puckTop}px)`;

			if (square.id === player.player.activeId && squareIndex === 1) {
				player.player.activeId = 0;
				resetPuck(!turn);
			}
		}

		if (square.isEnd) {
			turn ? (player.player.activeId = 0) : (player.opponent.activeId = 0);
			resetPuck(turn);
		}

		// if (

		// ) {
		// 	return true;
		// }

		if (!square.isRosette) {
			turn = !turn;
		}
	}

	function resetPuck(turn?: boolean) {
		let element = player.player.startRef!;
		const puckSize = element.offsetWidth * 0.5;
		let puckTop = element.offsetTop + (element.offsetWidth - puckSize) / 2;
		let puckLeft = element.offsetLeft + (element.offsetWidth - puckSize) / 2;

		if (turn === undefined) {
			// Reset board.
			// Place player puck
			player.player.puckRef!.style.width = `${puckSize}px`;
			player.player.puckRef!.style.transform = `translate(${puckLeft}px, ${puckTop}px)`;

			// Place opponent puck
			element = player.opponent.startRef!;
			puckTop = element.offsetTop + (element.offsetWidth - puckSize) / 2;
			puckLeft = element.offsetLeft + (element.offsetWidth - puckSize) / 2;
			player.opponent.puckRef!.style.width = `${puckSize}px`;
			player.opponent.puckRef!.style.transform = `translate(${puckLeft}px, ${puckTop}px)`;
		} else if (turn) {
			// Reset for player 1
			player.player.puckRef!.style.width = `${puckSize}px`;
			player.player.puckRef!.style.transform = `translate(${puckLeft}px, ${puckTop}px)`;
		} else {
			// Reset for player 2
			element = player.opponent.startRef!;
			puckTop = element.offsetTop + (element.offsetWidth - puckSize) / 2;
			puckLeft = element.offsetLeft + (element.offsetWidth - puckSize) / 2;
			player.opponent.puckRef!.style.width = `${puckSize}px`;
			player.opponent.puckRef!.style.transform = `translate(${puckLeft}px, ${puckTop}px)`;
		}
	}

	let squareWidth = $state(0);
	let puckSize = $derived(squareWidth * 0.5);

	let player: {
		player: { puckRef?: HTMLElement; startRef?: HTMLElement; activeId: number };
		opponent: { puckRef?: HTMLElement; startRef?: HTMLElement; activeId: number };
	} = $state({
		player: { activeId: 0 },
		opponent: { activeId: 0 }
	});

	let turn = $state(true);

	let moves = 2;

	onMount(resetPuck);
</script>

<div class="flex h-full flex-col items-center justify-center gap-4">
	<div
		style="width: {squareWidth}px"
		class="flex aspect-square items-center justify-center rounded-lg bg-white/20"
	>
		<span style="width: {puckSize}px" class="puck{turn ? '' : ' opponent'}"></span>
	</div>

	<div class="board relative">
		{#each rows as row, rowIndex}
			<div class="board-row">
				{#each row.squares as square, squareIndex}
					{#if square.isEmpty}
						{#if squareIndex === 0}
							<div bind:this={player.player.startRef} class="square empty"></div>
						{:else}
							<div bind:this={player.opponent.startRef} class="square empty"></div>
						{/if}
					{:else}
						<button
							aria-label="square"
							bind:offsetWidth={squareWidth}
							disabled={isDisabled(square, squareIndex)}
							onclick={(e) => move(square, e, squareIndex)}
							class="square{squareIndex === 0
								? ' player'
								: squareIndex === 2
									? ' opponent'
									: ''}{square.isRosette
								? ' rosette'
								: square.isEmpty
									? ' empty'
									: square.isEnd
										? ' end'
										: ''}"
						>
						</button>
					{/if}
				{/each}
			</div>
		{/each}
		<span bind:this={player.player.puckRef} class="puck absolute{turn ? '' : ' disabled'}"></span>
		<span
			bind:this={player.opponent.puckRef}
			class="puck absolute opponent{turn ? ' disabled' : ''}"
		></span>
	</div>
</div>
