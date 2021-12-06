<script lang="ts">
	import {link} from "./router.svelte"
	export let route: string;
	export let parms: Dictionary?;
	let className = '';
	export {className as class}
	
	let href;
$:	href = link(route, parms);
</script>
<a {href} class={className}><slot /></a>