<Router routes={Routes}>
	<Game />
</Router>
<Router routes={Routes} history={HashHistory}>
	<Game />
</Router>
<script lang="ts">
	import { Router, HashHistory } from "svelte-steer";
	import Routes from "./routes";
	import Game from "./game.svelte";
</script>