import { SvelteComponent } from "svelte";

type Dictionary<T = any> = {[key: string]: T};

type Lazy<T> = T | (()=> Lazy<T>) | Promise<Lazy<T>>;

interface Route {
	name?: string;
	path: string;
	component?: Lazy<SvelteComponent>;
	nested?: Lazy<Route[]>
}

type Segment = {
	name: string;
	variable: boolean;
}
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