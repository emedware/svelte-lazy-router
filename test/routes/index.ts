import { route2string } from "../../src";
import C1 from "./1.svelte";
import C2 from "./2.svelte";
import Alpha from "./alpha.svelte";
import Beta from "./beta.svelte";
import Landing from "./landing.svelte";
import Prmd from "./prmd.svelte";

async function enter(route: RouteMatch) { console.log('Enter ', route2string(route.spec)); }
function leave(route: RouteMatch) { console.log('Leave ', route2string(route.spec)); }
async function properties(props: Dictionary, route: RouteMatch) { console.log('Props ', route2string(route.spec), ' : ', JSON.stringify(props)); }

const nested = [{
	enter, leave, properties,
	name: 'alpha',
	path: 'a',
	component: Alpha
}, {
	enter, leave, properties,
	name: 'beta',
	path: 'b',
	component: Beta
}];
export {nested};

export default [{
	enter, leave, properties,
	name: 'one',
	path: '1',
	component: C1,
	nested
}, {
	enter, leave, properties,
	name: 'two',
	path: '2',
	component: C2
}, {
	enter, leave, properties,
	name: 'three',
	path: '3',
	nested
}, {
	enter, leave, properties,
	name: 'prmd',
	path: 'prmd/:id',
	component: Prmd
}, {
	enter, leave, properties,
	name: 'lzOne',
	path: 'lz1/:id',
	component: async ()=> (await import("./lazy1.svelte")).default,
	nested
}, {
	enter, leave, properties,
	name: 'landing',
	path: '/',
	component: Landing
}];