import type { SvelteComponent, SvelteComponentTyped } from "svelte";
import { Readable } from "svelte/store";

// Only this file is used and maintained manually
// https://stackoverflow.com/questions/70728607/svelte-and-d-ts-generation-with-rollup

	type Constructor<T> = { new (...args: any[]): T };
//export * from "../@types/router";
	export type Lazy<T> = any; //typeof T | (()=> Lazy<T>) | Promise<Lazy<T>>; TODO: makes an error in produced .d.ts
	/**
	 * Routes as specified by the user
	 */
	export interface Route {
		name?: string;
		path: string;
		component?: Lazy<SvelteComponent>;
		nested?: Route[];
		enter?(route: RouteMatch): boolean | void;
		properties?(props: Record<string, string>, route: RouteMatch): boolean | void;
		leave?(route: RouteMatch): string | void;
		meta?: any;	// custom-use
	}

	export type Segment = {
		name: string;
		variable: boolean;
	}

	/**
	 * Analysed routes specs
	 */
	export interface RouteSpec extends Route {
		segments: Segment[];
		nested?: RouteSpec[];
		parent?: RouteSpec;
		namedSubs?: Record<string, RouteSpec>;
	}

	export interface RouteMatch {
		spec: RouteSpec;
		parent?: RouteMatch;
		nested?: RouteMatch;
		props: Record<string, string>;
	}

	export interface Routing {
		link(path: string | RouteMatch, props?: Record<string, string>): string;
		match(path: string, props?: Record<string, string>): RouteMatch;
		navigate(path: string, props?: Record<string, string>, push?: boolean);
		replace(path: string, props?: Record<string, string>);
		go(delta: number);
	}

	export interface RouteHistory {
		url(segments: string[]): string;
		value: string;
	}
	
	export type LeavePrompter = (prompt: string)=> Promise<boolean>;
//export * from "./utils.d.ts";

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

//export * from "./link";

	export interface linkProps {
		route: string;
		params: Record<string, string>;
	}

	export class link extends SvelteComponentTyped<
		linkProps,
		{  },
		{  }
	> {}

// export * from "./route";

	export interface routeProps {
	}

	export class route extends SvelteComponentTyped<
		routeProps,
		{  },
		{  }
	> {}

//export * from "./router";

	export interface routerProps {
		variableMarker: RegExp,
		routes: Route[],
		history: Readable<RouteHistory>,
		leavePrompter: LeavePrompter
	}

	export class router extends SvelteComponentTyped<
		routerProps,
		{  },
		{  }
	> {}
