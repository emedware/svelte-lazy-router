import { SvelteComponentTyped } from "svelte";

declare module 'svelte-steer/link.svelte' {
	interface linkProps {
		route: string;
		params: Dictionary;
	}

	class link extends SvelteComponentTyped<
		linkProps,
		{  },
		{  }
	> {}
}