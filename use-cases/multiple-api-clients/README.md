# Use Case
There are multiple API clients within our app, each pointing onto different endpoint.
Say, there are 3 API clients we'd like to use.
```
https://first.endpoint
https://second.endpoint
https://third.endpoint
```

___
## 1st Solution
Use `request.call`, while providing which axios instance to use for each API Client.
```javascript
// somewhere.js
const firstClient = {
  baseURL: 'https://first.endpoint'
}
const secondClient = {
  baseURL: 'https://second.endpoint'
}
const thirdClient = {
  baseURL: 'https://third.endpoint'
}

// some-other-place.js
import { getSomething, getAnotherThing } from '@/api'

getSomething.call(firstClient);
getAnotherThing.call(secondClient, 'param_1', 'param_2')
```

### Pros
- Similar request path can be defined once. For example, `GET` request to both `https://first.endpoint/details` and `https://second.endpoint/details` can use a `getDetails()` defined within `api` folder.

### Cons
- `request.call` must be invoked for each request.

___
## 2nd Solution
For above use case, exposing `request()` within `api-client/index.js` actually make things complicated as demo'ed within 1st solution, in which `request.call` must invoked at all times.

So instead, we should make a wrapper for `request()` method, to determine which default client to fallback onto.

```diff
# api-client/index.js
- export function request (config) {
-   return baseRequest.call(this, config, instance)
- }

+ export function firstApiClient () {
+   return baseRequest.call(this, config, firstClientInstance)
+ }

+ export function secondApiClient () {
+   return baseRequest.call(this, config, secondClientInstance)
+ }

+ export function thirdApiClient () {
+   return baseRequest.call(this, config, thirdClientInstance)
+ }

```