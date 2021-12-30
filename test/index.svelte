<Router routes={Routes}>
	<Game />
</Router>
<Router routes={Routes} history={HashHistory}>
	<Game />
</Router>
<script lang="ts">
	import { Link, Router, Route, HashHistory } from "../src/index";
	import Routes from "./routes";
	import Game from "./game.svelte";
</script>