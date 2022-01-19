<slot />
<script lang="ts">
	//import type { Route, RouteHistory, RouteMatch, RouteSpec } from "router";
	//import type { Dictionary, LeavePrompter } from "utils";

	import { getContext, setContext } from "svelte";
	import { readable, Readable } from "svelte/store";
	import { AmbiguousNameError, RouteNotFoundError } from "./errors";
	import updateLocation, { H5History } from "./history";
	export var variableMarker: RegExp = /^\:/;
	export var routes: Route[];
	export var history: Readable<RouteHistory> = H5History;
	export var leavePrompter: LeavePrompter = null;
	
	// Useless for now - if embeded router, take parent's leave-prompter if none specified
	if(leavePrompter) setContext('leave-prompter', leavePrompter);
	else leavePrompter = <LeavePrompter>getContext('leave-prompter');
	// If none specified in the props nor the context, use JS default `confirm` box
	if(!leavePrompter) setContext('leave-prompter', leavePrompter = async (prompt: string)=> confirm(prompt));

	const rootSpec: RouteSpec = {path: '', segments: []};
	let analyzedRoutes: Route[],
		namedRoutes: Dictionary<RouteSpec>,
		specs: RouteSpec[];
	setContext('router', {
		link, match,
		navigate, replace, go
	});
	// Part of the path that was not used when matching a route
	let setRoute: (route: RouteMatch)=> void, setError: (error: any)=> void, setRouteSub: (routeSub: string)=> void,
		routeSub: string = null,
		displayedRoute: RouteMatch, displayedError: Error, displayedHistory: string;
	function analyze(routes: Route[]) {
		if(routes !== analyzedRoutes) {
			rootSpec.nested = specs = analyzeRoutes(routes);
			analyzedRoutes = routes;
			displayedHistory = null;
		}
	}
	analyze(routes);
$:	analyze(routes);
	function computeRoute(path: string) {
		if(displayedHistory != path) {
			displayedHistory = path;
			try {
				displayedRoute = {props: {}, spec: rootSpec, nested: match($history.value)};
				displayedError = null;
			} catch(x) {
				displayedRoute = {props: {}, spec: rootSpec};
				displayedError = x;
			}
		}
	}
	computeRoute($history.value);
	setContext('route-error', readable(displayedError, (set)=> { setError = set; }));
	setContext('route', readable(displayedRoute, (set)=> { setRoute = set; }));
	setContext('route-sub', readable(routeSub, (set)=> { setRouteSub = set; }));
$:	computeRoute($history.value);
$:	if(setRoute) setRoute(displayedRoute);
$:	if(setRouteSub) setRouteSub(routeSub);
$:	if(setError) setError(displayedError);
	function setName<T>(dst: Dictionary<T>, name: string, value: T, ambiguous: T) {
		dst[name] = dst.hasOwnProperty(name) ? ambiguous : value;
	}
	function analyzeRoutes(routes: Route[], parent?: RouteSpec): RouteSpec[] {
		if(!parent) namedRoutes = {};
		return routes.map(route => {
			let rv: RouteSpec = Object.assign(Object.create(route), {
				parent,
				segments: segmented(route.path)
					.map(segment => ({
						name: segment.replace(variableMarker, ''),
						variable: variableMarker.test(segment)
					}))
			});
			if(route.name) {
				setName(namedRoutes, route.name, rv, ambiguousName);
				for(let rs = parent; rs; rs = rs.parent)
					setName(rs.namedSubs, route.name, rv, ambiguousName);
			}
			if(route.nested) {
				rv.namedSubs = {};
				rv.nested = analyzeRoutes(route.nested, rv);
			}
			return rv;
		});
	}

	function segmented(path: string): string[] {
		return path
			.replace(/^\/+|\/+$/g, '')
			.split('/')
			.filter(segment => segment);
	}

	// TODO window onBeforeClose

	/**
	* Find a route along 2 scenarii
	* - a complete path and no props
	* - a route name and props
	* @param path string: path/name of the route (name if props are specified, path if not)
	* @param props Dictionary properties of the route as only a name is provided
	*/
	function match(path: string | RouteSpec, props?: Dictionary, nested?: RouteMatch): RouteMatch {
		let spec: RouteSpec;
		if('string'=== typeof path) {
			if(!path || (<string>path).startsWith('/')) return getSubRoute(specs, segmented(path));
			let names = path.split('/'), lastSpec: RouteSpec, lastName: string;
			for(spec = namedRoutes[lastName = names.shift()]; 
				names.length && spec && spec !== ambiguousName;
				spec = spec.namedSubs[lastName = names.shift()]
			)	lastSpec = spec;
			if(spec === ambiguousName) throw new AmbiguousNameError(lastSpec, lastName);
			if(!spec) throw new RouteNotFoundError(lastSpec, lastName);
		} else spec = <RouteSpec>path;
		const rv = {
			spec,
			parent: null,
			nested,
			props
		};
		if(spec.parent)
		// TODO separate props in objects & prototypes
			rv.parent = match(spec.parent, props, rv);
		return rv;
	}

	function getSubRoute(specs: RouteSpec[], segments: string[], props: Dictionary = {}, parent?: RouteMatch): RouteMatch {
		for(let route of specs) {
			let rp = Object.create(props);
			if(route.segments.length > segments.length ||
				!route.segments.every(
					(s, i)=> s.variable ? (rp[s.name] = segments[i], true) : segments[i] === s.name
				)
			) continue;
			let rv: RouteMatch = {
				spec: route,
				parent,
				props: rp
			};
			let remaining = segments.slice(route.segments.length);
			routeSub = remaining.join('/');
			if(!route.nested || !remaining.length) return rv;
			const sub = getSubRoute(route.nested, remaining, rp, rv);
			rv.nested = sub;
			return rv.spec.component ? rv : rv.nested;
		}
		throw new RouteNotFoundError(parent, '/' + segments.join('/'));
	}

	function link(path: string | RouteMatch, props?: Dictionary): string {
		let route = typeof path === 'string' ? match(<string>path, props) : <RouteMatch>path,
			builtPath: string[] = [];
		while(route.parent) route = route.parent;	//Take root route
		do for(let segment of route.spec.segments)
			if(segment.variable) {
				console.assert(route.props && typeof route.props[segment.name] !== 'undefined', `Route property ${segment.name} specified`);
				builtPath.push(encodeURIComponent(route.props[segment.name]));
			} else builtPath.push(segment.name);
		while(route = route.nested);
		return $history.url(builtPath)
	};
	function navigate(path: string, props?: Dictionary, push: boolean = true) {
		let route = match(path, props);
		if(route) {
			let toward = link(route);
			if($history.value !== toward) {
				window.history[push?'pushState':'replaceState'](null, null, toward);
				updateLocation();
			}
		}
	};
	function replace(path: string, props?: Dictionary) {
		navigate(path, props, false);
	};
	function go(delta: number) {
		window.history.go(delta);
	};
</script>
<script lang="ts" context="module">
	const ambiguousName: RouteSpec = {segments: [], path: '?ambiguous'};
</script>