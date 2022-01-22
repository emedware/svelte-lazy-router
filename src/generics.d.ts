
//declare module "svelte-steer" {
//declare global {
	type Record<string, T = any> = {[key: string]: T};
	type Constructor<T> = { new (...args: any[]): T };
	type Lazy<T> = typeof T | (()=> Lazy<T>) | Promise<Lazy<T>>;
//}
