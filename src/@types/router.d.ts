import { SvelteComponent } from "svelte";
import EventEmitter from "events";

declare global {
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

	interface Routing {
		link(path: string | RouteMatch, props?: Dictionary): string;
		match(path: string, props?: Dictionary, nested?: RouteMatch): RouteMatch;
		navigate(path: string, props?: Dictionary, push: boolean = true);
		replace(path: string, props?: Dictionary);
		go(delta: number);
		readonly route: RouteMatch;
		readonly path: string;
		readonly error?: any;
	}

	interface RouteHistory {
		update(): void;
		path(segments: string[]): string;
		value: string;
	}
}