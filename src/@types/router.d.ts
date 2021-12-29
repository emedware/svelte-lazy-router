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
		nested?: Route[];
		enter?(route: RouteMatch): Promise<boolean | void>;
		properties?(props: Dictionary, route: RouteMatch): Promise<boolean | void>;
		leave?(route: RouteMatch): string | void;
		meta?: any;	// custom-use
	}

	type Segment = {
		name: string;
		variable: boolean;
	}

	/**
	 * Analysed routes specs
	 */
	interface RouteSpec extends Route {
		segments: Segment[];
		nested?: RouteSpec[];
		parent?: RouteSpec;
		namedSubs?: Dictionary<RouteSpec>;
	}

	interface RouteMatch {
		spec: RouteSpec;
		parent?: RouteMatch;
		nested?: RouteMatch;
		props: Dictionary<any>;
	}

	interface Routing {
		link(path: string | RouteMatch, props?: Dictionary): string;
		match(path: string, props?: Dictionary): RouteMatch;
		navigate(path: string, props?: Dictionary, push: boolean = true);
		replace(path: string, props?: Dictionary);
		go(delta: number);
	}

	interface RouteHistory {
		url(segments: string[]): string;
		value: string;
	}
}