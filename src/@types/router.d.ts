import type { SvelteComponent } from "svelte";

//declare module "svelte-steer" {
//declare global {
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
//}