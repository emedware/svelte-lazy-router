{#if $loading || !$routerRoute}
	<slot name="loading" />
{:else if component}
	<svelte:component this={component} {...props} {...forwardProps} />
{:else}
	<slot {...forwardProps} />
{/if}
<script type="ts">
	//import type { LeavePrompter, RouteMatch, RouteSpec, Routing } from "router";
	import { getContext, setContext, SvelteComponent } from "svelte";
	import { readable, Readable, writable, Writable } from "svelte/store";
import { isAssertClause } from "typescript";
	import { NavigationCancelledError, NavigationType } from "./errors";
	import { excludeProps, lazy } from "./utils";
	export let route: string = null;
	export let params: Record<string, string> = null;
	export let loading: Writable<boolean> = writable(false);	// If none is provided, we are still using it internally
	export let error: Writable<Error> = null;

	const leavePrompter = <LeavePrompter>getContext('leave-prompter'),
		router = <Routing>getContext('router'),
		routerRoute = <Readable<RouteMatch>>getContext('route'),
		routerError = <Readable<Error>>getContext('route-error');
	let setRoute: (route: RouteMatch)=> void,
		props: Record<string, string> = {}, component: SvelteComponent, leavingId: object, leaving: Promise<void>,
		forwardProps, loadedMatch: RouteMatch = null, triedSpec: RouteSpec, triedProps: Record<string, string>;
$:	forwardProps = excludeProps($$props, 'route', 'params');

	// "route" context is not initialized before call to `LoadRoute`
	loading.set(true);
	setContext('route', readable(null, (set)=> { setRoute = set; }));
$:	LoadRoute(
		route ? router.match(route, params) :
		(($routerRoute && $routerRoute.nested) || {
			parent: $routerRoute,
			spec: null,
			props: {}
		}));
$:	if(setRoute) setRoute(loadedMatch);
$:	if(error) error.set($routerError);
	function propDiff(newp: Record<string, string>, oldp: Record<string, string>) {
		return Object.getOwnPropertyNames(newp).some(pn=> newp[pn] !== oldp[pn])
	}
	async function promptLeave(toward: RouteMatch) {
		if(loadedMatch) {
			let leavePrompt = [], prompt: string, matchBrowser: RouteMatch, stillIn = new Set<RouteSpec>();
			// -> LIFO
			// -> Browse by `parents` to have even the component-less
			for(matchBrowser = toward; matchBrowser.nested; matchBrowser = matchBrowser.nested);
			for(; matchBrowser; matchBrowser = matchBrowser.parent) stillIn.add(matchBrowser.spec);
			for(matchBrowser = loadedMatch; matchBrowser.nested; matchBrowser = matchBrowser.nested);
			while(matchBrowser && !stillIn.has(matchBrowser.spec)) {
				if(matchBrowser.spec.leave && (prompt = <string>matchBrowser.spec.leave(matchBrowser)))
					leavePrompt.push(prompt);
				matchBrowser = matchBrowser.parent;
			}
					
			if(leavePrompt.length && !await leavePrompter(leavePrompt.join('\n')))
				throw new NavigationCancelledError(loadedMatch, NavigationType.Leave);
		}
	}
	async function leave(toward: RouteMatch) {
		let callId = leavingId = {}; // unique object created in this call
		if(!leaving) leaving = promptLeave(toward);
		await leaving;	// `leavingId` can change here, "asynchronously"
		leaving = null;
		return leavingId === callId;
	}
	async function LoadRoute(match: RouteMatch) {
		loading.set(true);
		console.assert(match, '`route` must be defined')
		try {
			let newProps = {},
			matchBrowser: RouteMatch = match,
			matches: RouteMatch[] = [];
			do {
				matches.push(matchBrowser);
				for(let pn of Object.getOwnPropertyNames(match.props))
					newProps[pn] = match.props[pn]
				matchBrowser = matchBrowser.parent;
			} while(matchBrowser && !matchBrowser.spec.component)

			const matchChange = !loadedMatch || loadedMatch.spec !== match.spec,
				alreadyTried = triedSpec === match.spec;
			if(matchChange) {
				if(!(await leave(match))) return;
				if(!alreadyTried) {
					triedSpec = match.spec;
					let alreadyIn = new Set<RouteSpec>(),
						loadedAnalysis = loadedMatch;
					if(loadedMatch) do {
						alreadyIn.add(loadedAnalysis?.spec);
						loadedAnalysis = loadedAnalysis.parent;
					} while(loadedAnalysis && !loadedAnalysis.spec.component);
					while((matchBrowser = matches.pop()))
						if(!alreadyIn.has(matchBrowser.spec) && matchBrowser.spec?.enter && matchBrowser.spec.enter(matchBrowser) === false)
							throw new NavigationCancelledError(matchBrowser, NavigationType.Enter);
				}
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
			triedSpec = undefined;	// null => no sub; undefined => not tried
			// Browse all the component-less parents to gather the props
			loadedMatch = match.spec && match;
			if(matchChange)
				component = match.spec && await lazy<SvelteComponent>(match.spec.component, SvelteComponent);
		}
		finally { loading.set(false); }
	};
</script>