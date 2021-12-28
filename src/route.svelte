{#if component}
	<svelte:component this={component} {...props}/>
{:else}
	<slot />
{/if}
<script type="ts">
	/**
	 * TODOs: 
	 * - loading screen configuration (option for little loading bar under the title like youtube - forgot the name) + 404 = slot ?
	 * - https://svelte.dev/tutorial/context-api : current-route should be a context
	 * - allow an `url` property to be specified, to override parent' sub-url or window.location if root (!important)
	 * - path i18n: "/login"|en, "/connexion"|fr, "/autentificare"|ro, ...
	 * - multi-parts routes : menu, center, toolbox, ....
	 */
	import { getContext, setContext, SvelteComponent } from "svelte";
	import type { Writable } from "svelte/store";
	import { lazy } from "./utils";

	export let loading: boolean = false;
	const router = <Writable<Routing>>getContext('router');
	setContext('route', this);
$:	LoadRoute($router.route);
	let props = {};
	let component;
	async function LoadRoute(match: RouteMatch) {
		if(!match)
			component = null;
		else {
			loading = true;
			try {
				component = await lazy<SvelteComponent>(match.spec.component, SvelteComponent);
			} finally {
				loading = false;
			}
			props = match.props;
		}
	};
</script>