{#if $loading || !$routerRoute}
	<slot name="loading" />
{:else if component}
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
	 * - Either:
	 * 	* Plan lazy-loaded nested route
	 * 	* Exception when some part of the path is not used
	 * 	* Both
	 */
	import { getContext, setContext, SvelteComponent } from "svelte";
	import { readable, Readable, writable, Writable } from "svelte/store";
	import { NavigationCancelledError, NavigationType } from "./errors";
	import { excludeProps, lazy } from "./utils";
	export let route: string = null;
	export let params: Dictionary = null;
	export let loading: Writable<boolean> = writable(false);	// If none is provided, we are still using it internally
	export let error: Writable<Error> = null;

	const leavePrompter = <LeavePrompter>getContext('leave-prompter'),
		router = <Routing>getContext('router'),
		routerRoute = <Readable<RouteMatch>>getContext('route'),
		routerError = <Readable<Error>>getContext('route-error');
	let setRoute: (route: RouteMatch)=> void,
		props: Dictionary = {}, component: SvelteComponent,
		forwardProps, loadedMatch: RouteMatch = null, triedSpec: RouteSpec, triedProps: Dictionary;
$:	forwardProps = excludeProps($$props, 'route', 'params');

	// "route" context is not initialized before call to `LoadRoute`
	//loading.set(true);
	setContext('route', readable(null, (set)=> { setRoute = set; }));
$:	LoadRoute(route ? router.match(route, params) : $routerRoute && $routerRoute.nested);
$:	if(setRoute) setRoute(loadedMatch);
$:	if(error) error.set($routerError);
	function propDiff(newp: Dictionary, oldp: Dictionary) {
		return Object.getOwnPropertyNames(newp).some(pn=> newp[pn] !== oldp[pn])
	}
	async function leave() {
		if(loadedMatch) {
			let leavePrompt = [], prompts: ((route: RouteMatch)=> string)[] = [], prompt;
			// -> LIFO
			for(let matchBrowser = loadedMatch; matchBrowser; matchBrowser = matchBrowser.nested)
				if(matchBrowser.spec.leave) prompts.push(()=> matchBrowser.spec.leave(matchBrowser));
			while(prompt = prompts.pop())
				if(prompt = prompt())
					leavePrompt.push(prompt);
			if(leavePrompt.length && !await leavePrompter(leavePrompt.join('\n')))
				throw new NavigationCancelledError(loadedMatch, NavigationType.Leave);
		}
	}
	async function LoadRoute(match: RouteMatch) {
		loading.set(true);
		try {
			if(!match) {
				component = null;
				await leave();
				loadedMatch = null;
			} else {
				let newProps = {};
				let matchBrowser: RouteMatch = match;
				do {
					for(let pn of Object.getOwnPropertyNames(match.props))
						newProps[pn] = match.props[pn]
					matchBrowser = matchBrowser.parent;
				} while(matchBrowser && !matchBrowser.spec.component)
				
				const matchChange = !loadedMatch || loadedMatch.spec !== match.spec,
					alreadyTried = triedSpec === match.spec;
				if(!alreadyTried && matchChange) {
					triedSpec = match.spec;
					await leave();
					if(match.spec.enter && match.spec.enter(match) === false)
						throw new NavigationCancelledError(match, NavigationType.Enter);
					triedProps = props = {};
				}
				if(alreadyTried && !propDiff(newProps, triedProps)) return;
				if(propDiff(newProps, props)) {
					triedProps = newProps;
					let propChg = Object.create(props);
					for(let pn in newProps) if(newProps[pn]!== props[pn]) propChg[pn] = newProps[pn];
					if(match.spec.properties && match.spec.properties(propChg, match) === false)
						throw new NavigationCancelledError(match, NavigationType.Properties);
					props = newProps;
				}

				triedProps = null;
				triedSpec = null;
				// Browse all the component-less parents to gather the props
				loadedMatch = match;
				if(matchChange)
					component = await lazy<SvelteComponent>(match.spec.component, SvelteComponent);
			}
		}
		finally { loading.set(false); }
	};
</script>