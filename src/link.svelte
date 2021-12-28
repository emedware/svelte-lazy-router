<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	export let route: string;
	export let params: Dictionary = null;
	let className = null;
	export { className as class }
	const router = <Writable<Routing>>getContext('router');
	let href;
$:	href = $router.link(route, params);
	function follow(e) {
		$router.navigate(href);
		e.preventDefault();
	}
</script>
<a {href} class={className} on:click={follow}><slot /></a>