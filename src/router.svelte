<slot />
<script lang="ts">
	import { setContext } from "svelte";
	import { Readable, Writable, writable } from "svelte/store";
	import h5 from "./history/h5";
	export var routes: Route[];
	export var history: Readable<RouteHistory> = h5;
	let state = writable({
		link, match,
		navigate, replace, go,
		get path() { return $history.value; },
		route: null,
		error: null
	});
	setContext('router', state);
	
	let namedRoutes: Dictionary<RouteSpec>;
	function analyzeRoutes(routes: Route[], parent?: RouteSpec): RouteSpec[] {
		if(!parent) namedRoutes = {};
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
			if(name) {
				console.assert(!namedRoutes[name], `Route name ${name} only used once.`)
				namedRoutes[name] = rv;
			}
			if(nested) rv.nested = analyzeRoutes(nested, rv);
			return rv;
		});
	}

	let specs: RouteSpec[];
	
$:	specs = analyzeRoutes(routes);
$:	try {
		$state.route = match($history.value);
		delete $state.error;
	} catch(x) {
		$state.route = null;
		$state.error = x;
	}

	function segmented(path: string): string[] {
		return path
			.replace(/^\/+|\/+$/g, '')
			.split('/')
			.filter(segment => segment);
	}

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
			spec = namedRoutes[path];
			console.assert(spec, `Named route "${path}" defined`);
		} else spec = <RouteSpec>path;
		const rv = {
			spec,
			parent: null,
			nested,
			props
		};
		if(spec.parent)
			rv.parent = match(spec.parent, props, rv);
		return rv;
	}

	function getSubRoute(specs: RouteSpec[], segments: string[], props: Dictionary = {}, parent: RouteMatch = null): RouteMatch {
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
				let sub = getSubRoute(route.nested, segments.slice(route.segments.length), rp, rv);
				if(!sub) return rv;
				rv.nested = sub;
				return rv;
			}, {spec:{segments: []}, props: notFound});
		return rv.props === notFound ? null : rv;
	}

	function link(path: string | RouteMatch, props?: Dictionary): string {
		let route = typeof path === 'string' ? match(<string>path, props) : <RouteMatch>path,
			builtPath: string[] = [];
		while(route.parent) route = route.parent;	//Take root route
		do {
			for(let segment of route.spec.segments)
				if(segment.variable) {
					console.assert(route.props && typeof route.props[segment.name] !== 'undefined', `Route'property ${segment.name} specified`);
					builtPath.push(encodeURIComponent(route.props[segment.name]));
				} else builtPath.push(segment.name);
		} while(route = route.nested);
		return $history.path(builtPath)
	};
	function navigate(path: string, props?: Dictionary, push: boolean = true) {
		let route = match(path, props), toward = link(route);
		if($history.value !== toward) {
			window.history[push?'pushState':'replaceState'](null, null, toward);
			$history.update();
		}
	};
	function replace(path: string, props?: Dictionary) {
		navigate(path, props, false);
	};
	function go(delta: number) {
		window.history.go(delta);
		$history.update();
	};
</script>