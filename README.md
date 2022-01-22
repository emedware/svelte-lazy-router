# svelte-steer

[![npm](https://img.shields.io/npm/v/svelte-steer.svg)](https://www.npmjs.com/package/svelte-steer)

As there is curently no dedicated nor even suitable router for svelte, and as we needed a powerful and flexible one, we decided to make one and make it a dedicated package.

Just released [2021-12-29], it is still highly to be tested, corrected and receive suggestions/PRs - Beta mode.

## Installation / usage

```sh
npm i -S svelte-steer
```

```typescript
import { Router, Route, Link, link } from "svelte-steer";
const router = <Routing>getContext('router');
----
$:    myLink = router.link('user', {id: 42});
----
$:    myLink = router.link('/user/42');  // Don't laugh - if we are in a nested router, this might become `/en/user/42` or `/de/user/42` depending of the parent router
```

```html
<Router {routes} >
    ...
    <Link route="user" parms={{id: 42}}>  <!-- named route -->
    ----
    <Link route="/user/42">  <!-- url path -->
    ...
    <Route>404</Route>
    ...
</Router>
```

### Main difference with common routers

The `Router` object contains only the state of the routing. On the HTML generation level, it just forwards the content. It manages every routing-related activity/elements (`Route`, `Link`, `getContext('router')`, &c.) that happen inside.

The `Route` element effectively displays the selected route.

## Elements

### `Router`

#### Properties

`variableMarker`
: `/^\:/` : Variables in the path are written `":variable-name"`

`routes`
: Gives the [`Route`](#route-definition)`[]` tree of routes to serve

`history`
: History mode to use. Two modes are defined by default.

- `H5History` uses the Html5 history mode : `http://mysite/my/route/path`
- `HashHistory` uses the hash as history mode : `http://mysite/#my/route/path`

By default, `H5History` is used.

Hint: If you don't use a SPA server, for example serving the app from the file system, the hash history is required. Changing to hash happens like this :

```html
<Router history={HashHistory} ...>
...
</Router>
<script lang="ts">
    import { HashHistory } from "svelte-steer";
    ...
</script>
```
Also, changing the history mode requires nothing else. All the `<Link ...>` and calls to [Routing](#routing) will act accordingly.
### `Route`

#### Slot

The slot is displayed if no route is found. The `error` value can be used to display more information.

#### Properties

A route can be forced (and hence the router state ignored) if this is specified :

- `route`: `RouteMatch`
: Either the path (begins with a '/') or the name of the route to point to
- `params`: `Record<string, string>`
: If a route name is provided, this is the dictionary of the properties to give.

State feedbacks :

- `loading`: `Writable<boolean>`
: Set to true when waiting a lazy-load
- `error`: `Writable<Error>`
: Set (or unset if value is `undefined`) to the the route-related error. In error state, the slot is displayed. The slot is displayed without error when the route is not found.

### Link

#### Properties

`route`
: Either the path (begins with a '/') or the name of the route to point to

`params`
: If a route name is provided, this is the dictionary of the properties to give.

## Annex

### Route determination

When a `(route: string, params: Record<string, string>)` is used, like the attributes of the `<Link>` element or the parameters to the `match` function, either the route begins with a '/' - in which case the `params` part is ignored and the route string is analyzed as a path, either it does not begin with a '/' and is therefore used as a route name.

If two routes have the name "details", one under the route "author" and one under the route "book", the name "details" will raise an ambiguity error. The names `"author/details"` and `"book/details"` (where both "author", "book" and "details were given as route names) are valid and non-ambiguous.

### Contexts

#### `"router"`

Interface to interract with the router - see [Routing](#routing).

#### `"route"`

Give the `Readable<`[`RouteMatch`](#route-match)`>` directly contained in this route.

### Structures

#### Routing

When in a router, the context `"router"` is the following interface :

```ts
interface Routing {
    link(path: string | RouteMatch, props?: Record<string, string>): string;
    match(path: string, props?: Record<string, string>): RouteMatch;
    navigate(path: string, props?: Record<string, string>, push: boolean = true);
    replace(path: string, props?: Record<string, string>);
    go(delta: number);
}
```

Example:

```ts
let router = <Routing>getContext('router');

router.navigate('/new/url');
```

#### Route definition

```ts
interface Route {
    name?: string;
    path: string;
    component?: Lazy<SvelteComponent>;
    nested?: Route[];
    async enter?(route: RouteMatch): Promise<boolean | void>;
    async properties?(props: Record<string, string>, route: RouteMatch): Promise<boolean | void>;
    leave?(route: RouteMatch): string | void;
    meta?: any;
}
```

- `name` is only used to refer to this route by its name. Some function can take the name of a route to refer to it.
- `path` refer to the whole path of the route. Each part begining with a `:` defines a parameter (like every router: `/user/:id`).
- `component` is the component to display (lazy-loaded). Optional: if there are nested routes, not specifying a component is equivalent to specify a component containing only `<Route />` and hence displaying directly the nested route.
- `nested` is an array of nested routes.
- `meta` is not used internally and is meant to be used by the user.

Call-backs :

- `enter` is called when a route is entered. Explicitely returning false cancels the navigation.
- `leave` is called when a route is exited. Returning a string will raise a prompt with that string to ask user's confirmation of leaving.
- `properties` is called when properties are changed or just after `enter` if there are properties. Explicitely returning false cancels the navigation.

#### Route match

```ts
interface RouteMatch {
  spec: RouteSpec;
  parent?: RouteMatch;
  nested?: RouteMatch;
  props: Record<string, string>;
}
```

- `spec` gives all the indication of the generic route (without match). (Note, it inherits from [Routes](#route-definition))
- `parent` and `nested` give both the match of the parent and nested route (if any)
- `props` contains all the parameters given to the route. The prototype of this object are the parameters given to the parent route (chained)

## Nesting

A router routes is defined with an array of `Route` : `<Router {routes}>` - Except when it is a nested router. Nesting can be done in two ways, illustrated here : available routes are `a`, `a/c`, `a/d`.

`index.svelte`

```html
<script>
  import { Router, Route } from "svelte-steer";
  import A from "./a.svelte";
  import C from "./c.svelte";
  import D from "./d.svelte";

  let routes = [{
    path: 'a',
    component: A,
    nested: [{
      path: 'c', component: C
    }, {
      path: 'd', component: D
    }]
  }]
</script>
<Router {routes}><Route/></Router>
```

`a.svelte`

```html
<script>
  import { Route } from "svelte-steer";
</script>
a/ ... <Route />
```

If route `a` does not define a component, the sub-component (`C` or `D`) will be directly used.

## TODOs & participation

Fixes:

- generate a bundled .d.ts
- test & fix w/ SSR

Functionalities:

- lazy loading - add a default behaviour for "Loading..." ? Dim old page? youtube-like "progress" on the screen-top?
- transitions?
- page preservation/destruction mgt
- path i18n: "/login"|en, "/connexion"|fr, "/autentificare"|ro, ...
- multi-parts routes : menu, center, toolbox, ....

Management of "remaining route", either:

- Plan lazy-loaded nested route
- Exception when some part of the path is not used (perhaps optionally?)
- Both
