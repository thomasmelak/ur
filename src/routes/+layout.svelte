<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	let { children } = $props();

	const routes = [
		{ href: '', label: 'Home' },
		{ href: 'about', label: 'About' },
		{ href: 'play', label: 'Play' }
	];

	let page: HTMLElement;
</script>

<main
	bind:this={page}
	class="flex h-screen w-screen justify-center overflow-clip bg-gradient-to-b from-blue-700 to-blue-200 dark:to-blue-900"
>
	<div class="grid h-full w-full items-center justify-center gap-4 xl:max-w-screen-xl">
		<nav class="card sticky top-0 z-10 hidden gap-4">
			{#each routes as route}
				<a href="/{route.href}">{route.label}</a>
			{/each}
		</nav>
		<section class="card h-screen w-screen">
			<!-- {route}; -->

			{@render children()}
		</section>
		<button
			class="absolute right-5 top-5 p-4"
			onclick={() => {
				page?.requestFullscreen();
			}}><span class="material-symbols-outlined"> open_in_full </span></button
		>

		<footer class="card hidden">This is the footer</footer>
	</div>
</main>
