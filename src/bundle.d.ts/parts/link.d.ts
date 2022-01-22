import { SvelteComponentTyped } from "svelte";

//declare module 'svelte-steer/link.svelte' {
	export interface linkProps {
		route: string;
		params: Record<string, string>;
	}

	export class link extends SvelteComponentTyped<
		linkProps,
		{  },
		{  }
	> {}
//}