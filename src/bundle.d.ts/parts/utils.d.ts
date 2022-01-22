import { SvelteComponentTyped } from 'svelte';

//import type { Lazy, RouteSpec } from "router";

declare function lazy<T>(obj: Lazy<T>, ctor?: Constructor<T>): Promise<T>;

declare function excludeProps(props: any, ...exclude: string[]);

declare function route2string(rs: RouteSpec);

//import type { RouteMatch, RouteSpec } from "router";


/**
 * A path/name was not found in nested routes
 */
declare class RouteNotFoundError extends Error {
	constructor(route: RouteMatch | RouteSpec, path: string);
}

declare enum NavigationType {
	Leave, Properties, Enter
}

/**
 * A navigation callback has cancelled navigation
 */
declare class NavigationCancelledError extends Error {
	constructor(route: RouteMatch, navigationType: NavigationType);
}

/**
 * A name refers to several sub-routes and need disambiguation
 */
declare class AmbiguousNameError extends Error {
	constructor(route: RouteSpec, routeName: string);
}

export { AmbiguousNameError, NavigationCancelledError, NavigationType, RouteNotFoundError, excludeProps, lazy, route2string };
