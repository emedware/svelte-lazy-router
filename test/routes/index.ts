import C1 from "./1.svelte";
import C2 from "./2.svelte";
import Alpha from "./alpha.svelte";
import Beta from "./beta.svelte";
import Landing from "./landing.svelte";
import Prmd from "./prmd.svelte";

const nested = [{
	name: 'alpha',
	path: 'a',
	component: Alpha
}, {
	name: 'beta',
	path: 'b',
	component: Beta
}]
export {nested};

export default [{
	name: 'one',
	path: '1',
	component: C1,
	nested
}, {
	name: 'two',
	path: '2',
	component: C2
}, {
	name: 'prmd',
	path: 'prmd/:id',
	component: Prmd
}, {
	name: 'lzOne',
	path: 'lz1/:id',
	component: async ()=> (await import("./lazy1.svelte")).default
}, {
	name: 'landing',
	path: '/',
	component: Landing
}];