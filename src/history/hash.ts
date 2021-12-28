import { readable } from "svelte/store";

let globalSet: (value: RouteHistory)=> void = null;

function history(): RouteHistory { return {
	update() { globalSet(history()); },
	path(segments: string[]): string {
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
