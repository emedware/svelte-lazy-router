import EventEmitter from "events";

class HashHistory extends EventEmitter implements RouteHistory {
	path(segments: string[]): string {
		return location.origin + location.pathname + '#/' + segments.join('/');
	}
	get value() { return location.hash.substring(1); }
}
const hashHistory: RouteHistory = new HashHistory();
export default hashHistory;
window.onhashchange = ()=> hashHistory.emit('change');
