import { SvelteComponentTyped } from "svelte";

declare module 'svelte-steer' {
	import type { RouteMatch, RouteSpec } from "router";
	/**
	 * A path/name was not found in nested routes
	 */
	class RouteNotFoundError extends Error {
	    route: RouteMatch | RouteSpec;
	    path: string;
	    name: string;
	    constructor(route: RouteMatch | RouteSpec, path: string);
	}
	enum NavigationType {
	    Leave = 0,
	    Properties = 1,
	    Enter = 2
	}
	/**
	 * A navigation callback has cancelled navigation
	 */
	class NavigationCancelledError extends Error {
	    route: RouteMatch;
	    navigationType: NavigationType;
	    name: string;
	    constructor(route: RouteMatch, navigationType: NavigationType);
	}
	/**
	 * A name refers to several sub-routes and need disambiguation
	 */
	class AmbiguousNameError extends Error {
	    route: RouteSpec;
	    routeName: string;
	    name: string;
	    constructor(route: RouteSpec, routeName: string);
	}
}

declare module 'svelte-steer/utils.ts' {
	import type { RouteSpec } from "router";
	import type { Constructor, Lazy } from "utils";
	export function lazy<T>(obj: Lazy<T>, ctor?: Constructor<T>): Promise<T>;
	export function excludeProps(props: any, ...exclude: string[]): any;
	export function route2string(rs: RouteSpec): string;
}

declare module 'svelte-steer\history/index.ts' {
	export { default as H5History } from "./h5";
	export { default as HashHistory } from "./hash";
	export default function updateLocation(): void;
}

declare module 'svelte-steer\history/h5.ts' {
	export function update(): void;
	const _default: import("svelte/store").Readable<RouteHistory>;
	export default _default;
}

declare module 'svelte-steer\history/hash.ts' {
	export function update(): void;
	const _default: import("svelte/store").Readable<RouteHistory>;
	export default _default;
}

declare module 'svelte-steer/router.svelte' {
	interface routerProps {
	}

	class router extends SvelteComponentTyped<
		routerProps,
		{  },
		{  }
	> {}

	export default router;
}

declare module 'svelte-steer/link.svelte' {
	import { Dictionary } from "utils";

	interface linkProps {
		route: string;
		params: Dictionary;
	}

	class link extends SvelteComponentTyped<
		linkProps,
		{  },
		{  }
	> {}

	export default link;
}

