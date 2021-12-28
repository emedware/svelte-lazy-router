import App from "./index.svelte";
import { setRoutes } from "../src";
import Routes from "./routes";

setRoutes(Routes);
const app = new App({
    target: document.getElementsByTagName('app')[0]
});