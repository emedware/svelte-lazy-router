{#if component}
	<svelte:component this={component} {...props}/>
{:else}
	<slot />
{/if}
<script type="ts">
	/**
	 * TODOs: 
	 * - loading screen configuration (option for little loading bar under the title like youtube - forgot the name) 
	 * - default 404 + configuration
	 * - https://svelte.dev/tutorial/context-api : current-route should be a context
	 * - vs-code does not find types from /@types
	 * - allow an `url` property to be specified, to override parent' sub-url or window.location if root (!important)
	 */
	import {onMount} from "svelte";
	export let routes: Route? = null;
	onMount(() => {
		if(routes) {
			specs = getRouteSegments(routes);
			LoadRoute(location.pathname);
		}
	});
	let specs: RouteSpec[] = [];
	let namedRoutes: Dictionary<RouteSpec> = {};
	let props = {};
	let component;
	function segmented(path: string): string[] {
		return path
			.replace(/^\/+|\/+$/g, '')
			.split('/')
			.filter(segment => segment);
	}
	async function lazy<T>(obj: Lazy<T>): Promise<T> {
		while(obj instanceof Function || obj instanceof Promise)
			// TODO: SvelteComponent IS a function - check if calling it does the job of implementing it or if we should be more precise than ` instanceof Function`
			if(obj instanceof Function) obj = (<()=> Lazy<T>>obj)();
			else obj = await <Promise<Lazy<T>>>obj;
		return Promise.resolve(<T>obj);
	}
	function LoadRoute(path) {
		const current = getRoute(path);
		// TODOs:
		// - lazy load
		// - use route-props as component-props
		component = current.component;
		props = getProps(path, current.segments);
	};
	function getRouteSegments(routes, parent?: RouteSpec): RouteSpec[] {
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
			if(nested) rv.nested = getRouteSegments(nested, rv);
			return rv;
		});
	}
	function getRoute(path: string): RouteMatch {
		return getRouteSegments(segmented(path));
	}
	function getSubRoute(segments: Segment[], props: Dictionary = {}, parent: RouteMatch = null): RouteMatch {
		let notFound = {},
			rv = specs.reduce((found: RouteMatch, route: RouteSpec) => {
				if(route.segments.length > segments.length
					|| (route.segments.length < segments.length && !route.nested)
					|| route.segments.length < found.spec.segments.length)
					return found;
				let rp = Object.create(props);
				if(!route.segments.every((s, i) =>
					segments[i].variable ? (rp[segments[i].name] = s, true) : segments[i].name === s
				)) return found;
				let rv: RouteMatch = {
					spec: route,
					parent,
					props: rp
				};
				if(!route.nested) return rv;
				// TODO: nested should not be loaded here -> lazy loading
				let sub = getSubRoute(segments.slice(routes.segments.length), rp, rv);
				if(!sub) return found;
				rv.nested = sub;
				return rv;
			}, {spec:{segments: []}, props: notFound});
		if(rv.props === notFound) throw new Error('route not found: '+ segments.join('/'));
		return rv;
	}
	function getProps(path, routeSegments) {
		let props = {};
		segmented(path).map((s, i) =>
			routeSegments[i].variable &&
			(props[routeSegments[i].name] = s)
		);
		return props;
	};
	/**
	 * Find a route along 2 scenarii
	 * - a complete path and no props
	 * - a route name and props
	 * @param path string: path/name of the route (name if props are specified, path if not)
	 * @param props Dictionary properties of the route as only a name is provided
	 */
	function match(path: string, props?: Dictionary) {
		// TODO: write it and call it in `navigate`, `replace` and `link` - btw, write `link`
		// TODO: use context
	}
	export function navigate(path: string, props?: Dictionary) {
		window.history.pushState(null, null, path);
		LoadRoute(path);
	};
	export function replace(path: string, props?: Dictionary) {
		window.history.replaceState(null, null, path);
		LoadRoute(path);
	};
	export function go(delta: number) {
		window.history.go(delta);
		setTimeout(()=> LoadRoute(location.pathname));
	};
	window.onpopstate = () => LoadRoute(location.pathname);
</script>