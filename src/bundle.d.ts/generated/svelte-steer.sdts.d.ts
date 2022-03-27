import { SvelteComponentTyped } from "svelte";

declare module 'svelte-steer/errors.ts' {
	import type { RouteMatch, RouteSpec } from "router";
	/**
	 * A path/name was not found in nested routes
	 */
	export class RouteNotFoundError extends Error {
	    route: RouteMatch | RouteSpec;
	    path: string;
	    name: string;
	    constructor(route: RouteMatch | RouteSpec, path: string);
	}
	export enum NavigationType {
	    Leave = 0,
	    Properties = 1,
	    Enter = 2
	}
	/**
	 * A navigation callback has cancelled navigation
	 */
	export class NavigationCancelledError extends Error {
	    route: RouteMatch;
	    navigationType: NavigationType;
	    name: string;
	    constructor(route: RouteMatch, navigationType: NavigationType);
	}
	/**
	 * A name refers to several sub-routes and need disambiguation
	 */
	export class AmbiguousNameError extends Error {
	    route: RouteSpec;
	    routeName: string;
	    name: string;
	    constructor(route: RouteSpec, routeName: string);
	}
}

declare module 'svelte-steer/rollup.config.js';

declare module 'svelte-steer/utils.ts' {
	import type { RouteSpec } from "router";
	import type { Constructor, Lazy } from "utils";
	export function lazy<T>(obj: Lazy<T>, ctor?: Constructor<T>): Promise<T>;
	export function excludeProps(props: any, ...exclude: string[]): any;
	export function route2string(rs: RouteSpec): string;
}

declare module 'svelte-steer' {
	export { default as Route } from "./route.svelte";
	export { default as Router } from "./router.svelte";
	export { default as Link } from "./link.svelte";
	export { H5History, HashHistory } from "./history";
	export { NavigationCancelledError, RouteNotFoundError } from "./errors";
	export { route2string } from "./utils";
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

declare module 'svelte-steer/errors.ts' {
	import type { RouteMatch, RouteSpec } from "router";
	/**
	 * A path/name was not found in nested routes
	 */
	export class RouteNotFoundError extends Error {
	    route: RouteMatch | RouteSpec;
	    path: string;
	    name: string;
	    constructor(route: RouteMatch | RouteSpec, path: string);
	}
	export enum NavigationType {
	    Leave = 0,
	    Properties = 1,
	    Enter = 2
	}
	/**
	 * A navigation callback has cancelled navigation
	 */
	export class NavigationCancelledError extends Error {
	    route: RouteMatch;
	    navigationType: NavigationType;
	    name: string;
	    constructor(route: RouteMatch, navigationType: NavigationType);
	}
	/**
	 * A name refers to several sub-routes and need disambiguation
	 */
	export class AmbiguousNameError extends Error {
	    route: RouteSpec;
	    routeName: string;
	    name: string;
	    constructor(route: RouteSpec, routeName: string);
	}
}

declare module 'svelte-steer' {
	export { default as Route } from "./route.svelte";
	export { default as Router } from "./router.svelte";
	export { default as Link } from "./link.svelte";
	export { H5History, HashHistory } from "./history";
	export { NavigationCancelledError, RouteNotFoundError } from "./errors";
	export { route2string } from "./utils";
}

declare module 'svelte-steer/rollup.config.js';

declare module 'svelte-steer/utils.ts' {
	import type { RouteSpec } from "router";
	import type { Constructor, Lazy } from "utils";
	export function lazy<T>(obj: Lazy<T>, ctor?: Constructor<T>): Promise<T>;
	export function excludeProps(props: any, ...exclude: string[]): any;
	export function route2string(rs: RouteSpec): string;
}

declare module 'svelte-steer\@types/router.ts' {
	import type { SvelteComponent } from "svelte";
	import type { Dictionary, Lazy } from "./utils";
	/**
	 * Routes as specified by the user
	 */
	export interface RouteDesc {
	    name?: string;
	    path: string;
	    component?: Lazy<SvelteComponent>;
	    nested?: RouteDesc[];
	    enter?(route: RouteMatch): boolean | void;
	    properties?(props: Dictionary, route: RouteMatch): boolean | void;
	    leave?(route: RouteMatch): string | void;
	    meta?: any;
	}
	export type Segment = {
	    name: string;
	    variable: boolean;
	};
	/**
	 * Analysed routes specs
	 */
	export interface RouteSpec extends RouteDesc {
	    segments: Segment[];
	    nested?: RouteSpec[];
	    parent?: RouteSpec;
	    namedSubs?: Dictionary<RouteSpec>;
	}
	export interface RouteMatch {
	    spec: RouteSpec;
	    parent?: RouteMatch;
	    nested?: RouteMatch;
	    props: Dictionary<any>;
	}
	export interface Routing {
	    link(path: string | RouteMatch, props?: Dictionary): string;
	    match(path: string, props?: Dictionary): RouteMatch;
	    navigate(path: string, props?: Dictionary, push?: boolean): any;
	    replace(path: string, props?: Dictionary): any;
	    go(delta: number): any;
	}
	export interface RouteHistory {
	    url(segments: string[]): string;
	    value: string;
	}
}

declare module 'svelte-steer\@types/utils.ts' {
	export type Dictionary<T = any> = {
	    [key: string]: T;
	};
	export type Constructor<T> = {
	    new (...args: any[]): T;
	};
	export type Lazy<T> = any;
	export type LeavePrompter = (prompt: string) => Promise<boolean>;
}

declare module 'svelte-steer\@types/utils.ts' {
	export type Dictionary<T = any> = {
	    [key: string]: T;
	};
	export type Constructor<T> = {
	    new (...args: any[]): T;
	};
	export type Lazy<T> = any;
	export type LeavePrompter = (prompt: string) => Promise<boolean>;
}

declare module 'svelte-steer\history/h5.ts' {
	export function update(): void;
	const _default: import("svelte/store").Readable<RouteHistory>;
	export default _default;
}

declare module 'svelte-steer\history/index.ts' {
	export { default as H5History } from "./h5";
	export { default as HashHistory } from "./hash";
	export default function updateLocation(): void;
}

declare module 'svelte-steer\history/hash.ts' {
	export function update(): void;
	const _default: import("svelte/store").Readable<RouteHistory>;
	export default _default;
}

declare module 'svelte-steer\@types/router.ts' {
	import type { SvelteComponent } from "svelte";
	import type { Dictionary, Lazy } from "./utils";
	/**
	 * Routes as specified by the user
	 */
	export interface RouteDesc {
	    name?: string;
	    path: string;
	    component?: Lazy<SvelteComponent>;
	    nested?: RouteDesc[];
	    enter?(route: RouteMatch): boolean | void;
	    properties?(props: Dictionary, route: RouteMatch): boolean | void;
	    leave?(route: RouteMatch): string | void;
	    meta?: any;
	}
	export type Segment = {
	    name: string;
	    variable: boolean;
	};
	/**
	 * Analysed routes specs
	 */
	export interface RouteSpec extends RouteDesc {
	    segments: Segment[];
	    nested?: RouteSpec[];
	    parent?: RouteSpec;
	    namedSubs?: Dictionary<RouteSpec>;
	}
	export interface RouteMatch {
	    spec: RouteSpec;
	    parent?: RouteMatch;
	    nested?: RouteMatch;
	    props: Dictionary<any>;
	}
	export interface Routing {
	    link(path: string | RouteMatch, props?: Dictionary): string;
	    match(path: string, props?: Dictionary): RouteMatch;
	    navigate(path: string, props?: Dictionary, push?: boolean): any;
	    replace(path: string, props?: Dictionary): any;
	    go(delta: number): any;
	}
	export interface RouteHistory {
	    url(segments: string[]): string;
	    value: string;
	}
}

declare module 'svelte-steer' {
	export { default as Route } from "./route.svelte";
	export { default as Router } from "./router.svelte";
	export { default as Link } from "./link.svelte";
	export { H5History, HashHistory } from "./history";
	export { NavigationCancelledError, RouteNotFoundError } from "./errors";
	export { route2string } from "./utils";
}

declare module 'svelte-steer/utils.ts' {
	import type { RouteSpec } from "router";
	import type { Constructor, Lazy } from "utils";
	export function lazy<T>(obj: Lazy<T>, ctor?: Constructor<T>): Promise<T>;
	export function excludeProps(props: any, ...exclude: string[]): any;
	export function route2string(rs: RouteSpec): string;
}

declare module 'svelte-steer\@types/router.ts' {
	import type { SvelteComponent } from "svelte";
	import type { Dictionary, Lazy } from "./utils";
	/**
	 * Routes as specified by the user
	 */
	export interface RouteDesc {
	    name?: string;
	    path: string;
	    component?: Lazy<SvelteComponent>;
	    nested?: RouteDesc[];
	    enter?(route: RouteMatch): boolean | void;
	    properties?(props: Dictionary, route: RouteMatch): boolean | void;
	    leave?(route: RouteMatch): string | void;
	    meta?: any;
	}
	export type Segment = {
	    name: string;
	    variable: boolean;
	};
	/**
	 * Analysed routes specs
	 */
	export interface RouteSpec extends RouteDesc {
	    segments: Segment[];
	    nested?: RouteSpec[];
	    parent?: RouteSpec;
	    namedSubs?: Dictionary<RouteSpec>;
	}
	export interface RouteMatch {
	    spec: RouteSpec;
	    parent?: RouteMatch;
	    nested?: RouteMatch;
	    props: Dictionary<any>;
	}
	export interface Routing {
	    link(path: string | RouteMatch, props?: Dictionary): string;
	    match(path: string, props?: Dictionary): RouteMatch;
	    navigate(path: string, props?: Dictionary, push?: boolean): any;
	    replace(path: string, props?: Dictionary): any;
	    go(delta: number): any;
	}
	export interface RouteHistory {
	    url(segments: string[]): string;
	    value: string;
	}
}

declare module 'svelte-steer\@types/utils.ts' {
	export type Dictionary<T = any> = {
	    [key: string]: T;
	};
	export type Constructor<T> = {
	    new (...args: any[]): T;
	};
	export type Lazy<T> = any;
	export type LeavePrompter = (prompt: string) => Promise<boolean>;
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

declare module 'svelte-steer\history/index.ts' {
	export { default as H5History } from "./h5";
	export { default as HashHistory } from "./hash";
	export default function updateLocation(): void;
}

declare module 'svelte-steer/errors.ts' {
	import type { RouteMatch, RouteSpec } from "router";
	/**
	 * A path/name was not found in nested routes
	 */
	export class RouteNotFoundError extends Error {
	    route: RouteMatch | RouteSpec;
	    path: string;
	    name: string;
	    constructor(route: RouteMatch | RouteSpec, path: string);
	}
	export enum NavigationType {
	    Leave = 0,
	    Properties = 1,
	    Enter = 2
	}
	/**
	 * A navigation callback has cancelled navigation
	 */
	export class NavigationCancelledError extends Error {
	    route: RouteMatch;
	    navigationType: NavigationType;
	    name: string;
	    constructor(route: RouteMatch, navigationType: NavigationType);
	}
	/**
	 * A name refers to several sub-routes and need disambiguation
	 */
	export class AmbiguousNameError extends Error {
	    route: RouteSpec;
	    routeName: string;
	    name: string;
	    constructor(route: RouteSpec, routeName: string);
	}
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
	import { Dictionary } from "utils";
	import { Dictionary } from "utils";

	interface linkProps {
		route: string;
		params: Dictionary;
		route: string;
		params: Dictionary;
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

declare module 'svelte-steer/rollup.config.js';

declare module 'svelte-steer/link.svelte' {
	import { Dictionary } from "utils";
	import { Dictionary } from "utils";
	import { Dictionary } from "utils";

	interface linkProps {
		route: string;
		params: Dictionary;
		route: string;
		params: Dictionary;
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

