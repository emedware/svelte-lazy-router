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
			if(name) namedRoutes[name] = rv;
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
	function match(path: string, props?: Dictionary, nested?: RouteMatch): RouteMatch {
		if(!path || path.startsWith('/')) return getSubRoute(segmented(path));
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

	function link(path: string | RouteMatch, props?: Dictionary): string {
		let route = typeof path === 'string' ? match(<string>path, props) : <RouteMatch>path,
			builtPath: string[] = [];
		for(let segment of route.spec.segments)
			if(segment.variable) {
				console.assert(route.props && typeof route.props[segment.name] !== 'undefined', `Route'property ${segment.name} specified`);
				builtPath.push(encodeURIComponent(route.props[segment.name]));
			} else builtPath.push(segment.name);
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