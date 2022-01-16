<nav>
	<Link route="one">r1</Link>
	<Link route="one/alpha">r1a</Link>
	<Link route="/1/b">r1b</Link>
	<Link route="/2">r2</Link>
	<Link route="three/alpha">r3a</Link>
	<Link route="/3/b">r3b</Link>
	<Link route="prmd" params={{id: 42}}>p42</Link>
	<Link route="lzOne" params={{id: 42}}>lz1</Link>
	<Link route="lzOne/alpha" params={{id: 52}}>r1a</Link>
	<Link route="/lz1/62/b">r1b</Link>
</nav>
<div>
	You are here --&gt; <Route>404</Route> &lt;--
</div>
<script lang="ts">
	import { Link, Route } from "svelte-steer";
</script>