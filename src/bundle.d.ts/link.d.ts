import { SvelteComponentTyped } from "svelte";

declare module 'svelte-steer/link.svelte' {
	interface linkProps {
		route: string;
		params: Dictionary;
	}

	declare class link extends SvelteComponentTyped<
		linkProps,
		{  },
		{  }
	> {}
}