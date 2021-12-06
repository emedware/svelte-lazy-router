# svelte-lazy-router

As there is curently no dedicated nor even suitable router for svelte, and needing a powerful and flexible one, we decided to make one and make it a dedicated package.

## Installation / usage

```sh
npm i -S svelte-lazy-router
```

```typescript
import { Router, Link, link } from "svelte-lazy-router";

...

myLink = link('thatRoute', {id: 42});
```

```html
<Router />
----
<Router {routes} />
----
<Link route="thatRoute" parms={{id: 42}}>
```

## Structures

### Lazy

A lazy something (aka `Lazy<T>`) is either a something (a `T`), a callback (returning a `Lazy<T>`) or a promise (of `Lazy<T>`).
It can be a callback returning a promise of a callback of - freedom! At the end of the chain, though, some `T` will be retrieved.

### Route definition

```ts
interface Route {
  name?: string;
  path: string;
  component?: Lazy<SvelteComponent>;
  nested?: Lazy<Route[]>
}
```

- `name` is only used to refer to this route by its name. Some function can take the name of a route to refer to it.
- `path` refer to the whole path of the route. Each part begining with a `:` defines a parameter (like every router: `/user/:id`)
- `component` is the component to display (lazy-loaded). Optional: if there are nested routes, not specifying a component is
 equivalent to specify a component containing only `<Router />` and hence displaying directly the nested route.
- `nested` is an array (lazy-loaded) of nested routes.

### Route match

```ts
interface RouteMatch {
  spec: RouteSpec;
  parent?: RouteMatch;
  nested?: RouteMatch;
  props: Dictionary<any>;
}
```

- `spec` gives all the indication of the generic route (without match)
- `parent` and `nested` give both the match of the parent and nested route (if any)
- `props` contains all the parameters given to the route. The prototype of this object are the parameters given to the parent route (chained)
