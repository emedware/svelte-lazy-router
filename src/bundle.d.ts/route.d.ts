import { SvelteComponentTyped } from "svelte";

//declare module 'svelte-steer/router.svelte' {
	interface routeProps {
	}

	declare class route extends SvelteComponentTyped<
		routeProps,
		{  },
		{  }
	> {}
//}