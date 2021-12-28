import { readable } from "svelte/store";

let globalSet: (value: RouteHistory)=> void = null;

function history(): RouteHistory { return {
	update() { globalSet(history()); },
	path(segments: string[]): string {
		return '/' + segments.join('/') + location.hash;
	},
	value: location.pathname
}; }
export default readable(history(), set=> {
	globalSet = set;
	window.onpopstate = (e)=> {
		set(history());
		e.preventDefault();
	};
});
