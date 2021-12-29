import { readable } from "svelte/store";

let globalSet: (value: RouteHistory)=> void = null;

export function update() { if(globalSet) globalSet(history()); }
function history(): RouteHistory { return {
	url(segments: string[]): string {
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
