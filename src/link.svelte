<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import { excludeProps } from "./utils";
	export let route: string;
	export let params: Dictionary = null;
	const router = <Writable<Routing>>getContext('router');
	let href;
$:	href = $router.link(route, params);
	function follow(e) {
		$router.navigate(route, params);
	}
</script>
<a {...excludeProps($$props, 'route', 'params')}
	{href} on:click|preventDefault={follow}><slot /></a>