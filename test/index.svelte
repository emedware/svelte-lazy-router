<Router routes={Routes}>
	<nav>
		<Link route="one">r1</Link>
		<Link route="two">r2</Link>
	</nav>
	<div>
		You are here --&gt; <Route>404</Route> &lt;--
	</div>
</Router>
<script lang="ts">
	import { Link, Router, Route } from "../src/index";
	//import { Link, Router } from "svelte-lazy-router";
	import Routes from "./routes";
</script>