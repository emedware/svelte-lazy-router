import { SvelteComponent } from "svelte";

declare global {
	type Dictionary<T = any> = {[key: string]: T};

	type Lazy<T> = typeof T | (()=> Lazy<T>) | Promise<Lazy<T>>;

	/**
	 * Routes as specified by the user
	 */
	interface Route {
		name?: string;
		path: string;
		component?: Lazy<SvelteComponent>;
		nested?: Route[]
	}

	type Segment = {
		name: string;
		variable: boolean;
	}

	/**
	 * Analysed routes specs
	 */
	interface RouteSpec {
		name?: string;
		segments: Segment[];
		component?: Lazy<SvelteComponent>;
		nested?: Lazy<RouteSpec[]>;
		parent?: RouteSpec;
	}

	interface RouteMatch {
		spec: RouteSpec;
		parent?: RouteMatch;
		nested?: RouteMatch;
		props: Dictionary<any>;
	}
}