<script lang="ts">
	import { link, navigate } from "./routing";
	//import type { Dictionary } from "./@types/router";

	export let route: string;
	export let parms: Dictionary = null;
	let className = null;
	export { className as class }
	
	let href;
$:	href = link(route, parms);
	function follow(e) {
		navigate(href);
		e.preventDefault();
	}
</script>
<a {href} class={className} on:click={follow}><slot /></a>