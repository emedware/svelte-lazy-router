import { route2string } from "./utils";

/**
 * A path/name was not found in nested routes
 */
export class RouteNotFoundError extends Error {
	name: string = "route-not-found";
	constructor(public route: RouteMatch | RouteSpec, public path: string) {
		super(`Route not found: ${path} in ${route2string((<RouteMatch>route).spec || <RouteSpec>route)}`);
	}
}

export enum NavigationType {
	Leave, Properties, Enter
}

/**
 * A `enter` or `leave` callback has cancelled navigation
 */
export class NavigationCancelledError extends Error {
	name: string = "navigation-cancelled";
	constructor(public route: RouteMatch, public navigationType: NavigationType) {
		super(`Navigation cancelled in ${route2string(route.spec)}`);
	}
}

/**
 * A name refers to several sub-routes and need disambiguation
 */
export class AmbiguousNameError extends Error {
	name: string = "ambiguous-name";
	constructor(public route: RouteSpec, public routeName: string) {
		super(`Ambiguous name: ${routeName} in ${route2string(route)}`);
	}
}