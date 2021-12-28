export async function lazy<T>(obj: Lazy<T>, ctor?: Constructor<T>): Promise<T> {
	while(obj instanceof Promise ||
		(obj instanceof Function &&
		 !(obj.prototype instanceof ctor))
	)
		if(obj instanceof Promise) obj = await <Promise<Lazy<T>>>obj;
		else obj = (<()=> Lazy<T>>obj)();
	return Promise.resolve(<T>obj);
}