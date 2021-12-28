{#if component}
	<svelte:component this={component} {...props} {...forwardProps} />
{:else}
	<slot {...forwardProps} />
{/if}
<script type="ts">
	/**
	 * TODOs: 
	 * - loading screen configuration (option for little loading bar under the title like youtube - forgot the name) + 404 = slot ?
	 * 	. slot is now used as 404. context.routing.error is set to an exception if any
	 * 	. context.routing.loading is set to true when lazy loading - TODO: add a default "graying behaviour"
	 * - allow an `url` property to be specified, to override parent' sub-url or window.location if root (!important)
	 * - path i18n: "/login"|en, "/connexion"|fr, "/autentificare"|ro, ...
	 * - multi-parts routes : menu, center, toolbox, ....
	 */
	import { createEventDispatcher, getContext, setContext, SvelteComponent } from "svelte";
	import type { Writable } from "svelte/store";
	import { excludeProps, lazy } from "./utils";
	let forwardProps;
$:	forwardProps = excludeProps($$props, 'loading', 'error');
	const dispatch = createEventDispatcher();
	const router = <Writable<Routing>>getContext('router');
	setContext('route', this);
$:	LoadRoute($router.route);
$:	dispatch('error', $router.error);
	let props = {};
	let component;
	async function LoadRoute(match: RouteMatch) {
		if(!match)
			component = null;
		else {
			dispatch('loading', true);
			try {
				component = await lazy<SvelteComponent>(match.spec.component, SvelteComponent);
			} finally {
				dispatch('loading', false);
			}
			props = match.props;
		}
	};
</script>