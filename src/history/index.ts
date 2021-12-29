export { default as H5History } from "./h5";
export { default as HashHistory } from "./hash";
import { update as updateH5 } from "./h5";
import { update as updateHash } from "./hash";

export default function updateLocation() {
	updateH5();
	updateHash();
}