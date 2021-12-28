{#if component}
	<svelte:component this={component} {...props} {...forwardProps} />
{:else}
	<slot {...forwardProps} />
{/if}
<script type="ts">
	/**
	 * TODOs: 
	 * - lazy loading - add a default "graying behaviour"
	 * - path i18n: "/login"|en, "/connexion"|fr, "/autentificare"|ro, ...
	 * - multi-parts routes : menu, center, toolbox, ....
	 */
	import { createEventDispatcher, getContext, setContext, SvelteComponent } from "svelte";
	import { Readable, writable, Writable } from "svelte/store";
	import { excludeProps, lazy } from "./utils";
	export let route: string = null;
	export let params: Dictionary = null;
	let forwardProps;
$:	forwardProps = excludeProps($$props, 'route', 'params');
	const dispatch = createEventDispatcher();
	const router = <Readable<Routing>>getContext('router');
	const subRouter = $router && writable(Object.create($router));
	setContext('router', subRouter);
$:	if($router) {
		let displayedRoute = route ? $router.match(route, params) : $router.route;
		LoadRoute(displayedRoute);
		if(displayedRoute) $subRouter.route = $router.route.nested;
		dispatch('error', $router.error);
	}
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