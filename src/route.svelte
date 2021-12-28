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
	import { getContext, setContext } from "svelte";
	import type { Writable } from "svelte/store";
	const router = <Writable<Routing>>getContext('router');
	setContext('route', this);
$:	LoadRoute($router.route);
	/*onMount(() => {
		if(route)
			LoadRoute(typeof route === 'string' ? match(route) : route);
		else if(!parent) {
			
			LoadRoute(match(location.pathname));
			rootLoaders.add(LoadRoute);
		} // TODO else
	});
	onDestroy(()=> {
		if(!route && !parent) rootLoaders.delete(LoadRoute);
	});*/
	let props = {};
	let component;
	async function lazy<T>(obj: Lazy<T>): Promise<T> {
		while(obj instanceof Function || obj instanceof Promise)
			// TODO: SvelteComponent IS a function - check if calling it does the job of implementing it or if we should be more precise than ` instanceof Function`
			if(obj instanceof Function) obj = (<()=> Lazy<T>>obj)();
			else obj = await <Promise<Lazy<T>>>obj;
		return Promise.resolve(<T>obj);
	}
	function LoadRoute(match: RouteMatch) {
		// TODOs:
		// - lazy load
		component = match.spec.component;
		props = match.props;
	};
</script>