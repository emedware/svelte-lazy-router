//import type { RouteHistory } from "router";
import { readable } from "svelte/store";

let globalSet: (value: RouteHistory)=> void = null;

export function update() { if(globalSet) globalSet(history()); }
function history(): RouteHistory { return {
	url(segments: string[]): string {
		return location.origin + location.pathname + '#' + segments.join('/');
	},
	value: '/' + location.hash.substring(1)
}; }
export default readable(history(), set=> {
	globalSet = set;
	window.onhashchange = (e)=> {
		set(history());
		e.preventDefault();
	};
});
