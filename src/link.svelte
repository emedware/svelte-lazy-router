<script lang="ts">
	//import type { Routing } from "router";
	import { getContext } from "svelte";
	import { excludeProps } from "./utils";
	export let route: string;
	export let params: Record<string, string> = null;
	const router = <Routing>getContext('router');
	console.assert(router, 'Link element in a `Router`');
	let href;
$:	href = router.link(route, params);
	function follow() {
		router.navigate(route, params);
	}
</script>
<a {...excludeProps($$props, 'route', 'params')}
	{href} on:click|preventDefault={follow}><slot /></a>