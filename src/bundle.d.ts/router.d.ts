import { SvelteComponentTyped } from "svelte";
import { Readable } from "svelte/store";

//declare module 'svelte-steer/router.svelte' {
	interface routerProps {
		variableMarker: RegExp,
		routes: Route[],
		history: Readable<RouteHistory>,
		leavePrompter: LeavePrompter
	}

	declare class router extends SvelteComponentTyped<
		routerProps,
		{  },
		{  }
	> {}
//}