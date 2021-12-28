<Router routes={Routes}>
	<nav>
		<Link route="one">r1</Link>
		<Link route="alpha">r1a</Link>
		<Link route="/1/b">r1b</Link>
		<Link route="/2">r2</Link>
		<Link route="prmd" params={{id: 42}}>p42</Link>
		<Link route="lzOne" params={{id: 42}}>lz1</Link>
	</nav>
	<div>
		You are here --&gt; <Route>404</Route> &lt;--
	</div>
</Router>
<script lang="ts">
	import { Link, Router, Route } from "../src/index";
	import Routes from "./routes";
</script>