import EventEmitter from "events";

class H5History extends EventEmitter implements RouteHistory {
	path(segments: string[]): string {
		return '/' + segments.join('/') + location.hash;
	}
	get value() { return location.pathname; }
}
const h5History: RouteHistory = new H5History();
export default h5History;

window.onpopstate = (e)=> {
	h5History.emit('change');
	e.preventDefault();
};