<script lang="ts">
	import {link} from "./router.svelte"
	export let route: string;
	export let props: Dictionary?;
	let className = '';
	export {className as class}
	
	let href;
$:	href = link(route, props);
</script>
<a {href} class={className}><slot /></a>