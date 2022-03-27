import { SvelteComponentTyped } from "svelte";
import { Readable } from "svelte/store";

//declare module 'svelte-steer/router.svelte' {
	export interface routerProps {
		variableMarker: RegExp,
		routes: RouteDesc[],
		history: Readable<RouteHistory>,
		leavePrompter: LeavePrompter
	}

	export class router extends SvelteComponentTyped<
		routerProps,
		{  },
		{  }
	> {}
//}