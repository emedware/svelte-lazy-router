/*<slot />
<script lang="ts">

</script>
<script context="module" lang="ts">*/
//import { setContext } from "svelte";

//import type { Dictionary, Route, RouteMatch, RouteSpec } from "./@types/router";
let specs: RouteSpec[] = [];
let namedRoutes: Dictionary<RouteSpec> = {};
//setContext(routing, this);
function analyzeRoutes(routes: Route[], parent?: RouteSpec): RouteSpec[] {
	return routes.map(({name, path, component, nested}) => {
		let rv: RouteSpec = {
			name,
			component,
			parent,
			segments: segmented(path)
				.map(segment => ({
					name: segment.replace(':', ''),
					variable: segment.startsWith(':')
				}))
		};
		if(name) namedRoutes[name] = rv;
		if(nested) rv.nested = analyzeRoutes(nested, rv);
		return rv;
	});
}

function getSubRoute(segments: string[], props: Dictionary = {}, parent: RouteMatch = null): RouteMatch {
	let notFound = {},
		rv = specs.reduce((found: RouteMatch, route: RouteSpec) => {
			if(route.segments.length > segments.length
				|| (route.segments.length < segments.length && !route.nested)
				|| route.segments.length < found.spec.segments.length)
				return found;
			let rp = Object.create(props);
			if(!route.segments.every((s, i) =>
				s.variable ? (rp[s.name] = segments[i], true) : segments[i] === s.name
			)) return found;
			let rv: RouteMatch = {
				spec: route,
				parent,
				props: rp
			};
			if(!route.nested) return rv;
			let sub = getSubRoute(segments.slice(route.segments.length), rp, rv);
			if(!sub) return found;
			rv.nested = sub;
			return rv;
		}, {spec:{segments: []}, props: notFound});
	if(rv.props === notFound) throw new Error('route not found: /'+ segments.join('/'));
	return rv;
}

function segmented(path: string): string[] {
	return path
		.replace(/^\/+|\/+$/g, '')
		.split('/')
		.filter(segment => segment);
}

export function setRoutes(routes: Route[]) {
	specs = analyzeRoutes(routes);
}

/**
* Find a route along 2 scenarii
* - a complete path and no props
* - a route name and props
* @param path string: path/name of the route (name if props are specified, path if not)
* @param props Dictionary properties of the route as only a name is provided
*/
export function match(path: string, props?: Dictionary, nested?: RouteMatch): RouteMatch {
	if(path.startsWith('/')) return getSubRoute(segmented(path));
	const spec = namedRoutes[path], builtPath = [];
	console.assert(spec, `Named route "${path}" defined`);
	// TODO Call recursively for `parent`/`nested` if needed
	return {
		spec,
		parent: null,
		nested: null,
		props
	}
}

type RouteLoader = (route: RouteMatch)=> void;
export let rootLoaders: Set<RouteLoader> = new Set<RouteLoader>();
function LoadRoot(route: RouteMatch) {
	for(let routeLoader of rootLoaders)
		routeLoader(route);
}

window.onpopstate = () => (e)=> {
	debugger;
	LoadRoot(match(location.pathname));
	e.preventDefault();
};
export function navigate(path: string, props?: Dictionary, push: boolean = true) {
	let route = match(path, props), toward = link(route);
	if(location.pathname !== toward) {
		window.history[push?'pushState':'replaceState'](null, null, toward);
		LoadRoot(route);
	}
};
export function replace(path: string, props?: Dictionary) {
	navigate(path, props, false);
};
export function link(path: string | RouteMatch, props?: Dictionary): string {
	let route = typeof path === 'string' ? match(<string>path, props) : <RouteMatch>path,
		builtPath: string[] = [];
	for(let segment of route.spec.segments)
		if(segment.variable) {
			console.assert(props && typeof props[segment.name] !== 'undefined', `Route'property ${segment.name} specified`);
			builtPath.push(encodeURIComponent(props[segment.name]));
		} else builtPath.push(segment.name);
	return '/' + builtPath.join('/');
};
export function go(delta: number) {
	window.history.go(delta);
	LoadRoot(match(location.pathname));
};
//</script>