import C1 from "./1.svelte";
import C2 from "./2.svelte";
import Landing from "./landing.svelte";
import Prmd from "./prmd.svelte";

export default [{
	name: 'one',
	path: '/1',
	component: C1
}, {
	name: 'two',
	path: '/2',
	component: C2
}, {
	name: 'prmd',
	path: '/prmd/:id',
	component: Prmd
}, {
	name: 'landing',
	path: '/',
	component: Landing
}];