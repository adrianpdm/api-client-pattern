![](./coverage-badges/badge-branches.svg)  ![](./coverage-badges/badge-functions.svg)  ![](./coverage-badges/badge-lines.svg)  ![](./coverage-badges/badge-statements.svg)

# API Client Configuration Pattern

There are a number of use cases regarding API client within front-end application. Some of them includes:
1) **Single API client** (static)

    Shouldn't be a problem with this one. Configuration can be statically defined upfront.

2) **Single API client** (dynamic)
    
    API client config might be dynamically set at runtime. For example, a difference in baseURL based on remote config.

3) **Multiple API client** (static)

    Same with (1), but with multiple clients, each pointing onto different endpoint.

4) **Multiple API client** (dynamic)

    Same with (3), but dynamically configured at runtime.

5) **Unit test**

    Each API client, either static or dynamic, must be easily mocked.

API client configuration pattern demonstrated within this project is meant to solve above problems.

---
## Folder structures
```
.
├── api
|   ├── auth.js
|   ├── ...
|   ├── news.js
|   └── user.js
├── api-client
|   ├── main.client.js
|   ├── ...
|   ├── some-auth-service.client.js
|   └── some-third-party.client.js
├── api-utils
└── tests
```

| Folder        | Description   |
| -             | -             |
| api           | This is where all the abstracted request placed. Can be grouped by feature. |
| api-client    | This is where we define API clients needed for the app. |
| api-utils     | Some utilities regarding axios instance |
| tests         | Unit test suites | 
---
## The benefits of this pattern

### Each request can be overridden per request basis

Say, the backend service is progressively migrating onto a different framework, and the migrated endpoints is accessible within `/v2/` route.

```javascript
import { getUserById, getUsers } from '/api/user.js'

const customConfig = {
    baseURL: `https://some.endpoint/v2`
}
// this points onto /v2/
getUserById.call(customConfig, '290191')
    .then((res) => {
        // handle response
    })
    .catch((err) => {
        // handle error
    })

// this points onto the default baseURL
getUsers(1, 10)
    .then((res) => {
        // handle response
    })
    .catch((err) => {
        // handle error
    })
```

### Keeping asynchronous data flow, even when the backend service is not ready yet
Sometimes during development, the backend service is not ready yet. In such condition, we can either choose to:
- create a fixture, which then be **statically imported**
    
    While this is convenient, a static import is a totally different data flow than a network request, due to the asynchronicity.
    ```javascript
    // fixture/user-data.js
    export default {
        name: 'Adrian',
        birthday: '1991-01-29'
    }

    // somewhere in your app
    import userDataFixture from '/fixture/user-data'
    
    // fixture is accessed statically
    let user = userDataFixture
    ```

- or, consume such fixture **within a simulated/mocked network request**

    Using this method, we can still use the abstracted request method, but bound onto the mock adapter.
    ```javascript
    import userDataFixture from '/fixture/user-data'

    mock.onAny().replyOnce(200, userDataFixture)
    
    let user
    getUserById.call(mock, '290191')
        .then((res) => {
            // fixture is handled as if it was a network request
            user = res.data
        })
        .catch((err) => {
            // handle error
        })
    ```

    Somewhere in the future, when the backend service is ready, we can simply remove the bound context.
    ```diff
    -   import userDataFixture from '/fixture/user-data'

    -   mock.onAny().replyOnce(200, userDataFixture)
        
        let user
    -   getUserById.call(mock, '290191')
    +   getUserById('290191')
            .then((res) => {
                user = res.data
            })
            .catch((err) => {
                // handle error
            })
    ```

### Each abstracted request can be unit-tested

We can unit test each request by importing the corresponding method.
```javascript
import MockAdapter from 'axios-mock-adapter'
import { instance } from '/api-client/main.client'
import { getUserById } from '/api/user.js'

describe('API: user', () => {
    test('getUserById: correctly returns user data', (done) => {
        const userId = '290191'
        const mock = new MockAdapter(instance)
            .onAny()
            .replyOnce(201, { /* user data fixture */ })

        getUserById.call(mock, userId)
            .then((res) => {
                expect(res.data).toEqual(
                    expect.objectContaining({
                        /* expected object */
                    })
                )
                done()
            })
            .catch(done)
    })
})
```

### Isolating our unit test environment from external service
Mock server can be easily setup nowadays, some might use Postman/JsonServer for that. That said, unit test should only focus on how corresponding logic works locally. As for the actual network request, it should have been tested within the **integration test** environment.

---

## How to use this pattern

### Create API client
1) Create the client instance in `/api-client` folder. For example, `main.client.js`.

    ```javascript
    // main.client.js
    import axios from 'axios'

    export const instance = (function () {
        const _instance = axios.create({
            /* define config */
        })

        /* define any other thing here, e.g interceptors */

        return _instance
    })()
    ```

2) Import `baseRequest` from `/api-utils/axios.base-request`
    ```diff
      # main.client.js
      import axios from 'axios'
    + import { baseRequest } from '/api-utils/axios.base-request'
    ```

3) Create a wrapper for `baseRequest`, supplying the previously created instance as argument. Exported function name be can anything. See also: [Function#call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call). 

    ```diff
      # main.client.js
    + export function request(config) {
    +  return baseRequest.call(this, config, instance)
    +}
    ```

4) Final code should at least look like this.

    ```javascript
    import axios from 'axios'
    import { baseRequest } from '../api-utils/axios.base-request'

    export const instance = (function () {
        const _instance = axios.create({
            // ...
        })

        return _instance
    })()

    export function request(config) {
        return baseRequest.call(this, config, instance)
    }
    ```

    > Any other client can be defined using the same pattern under different filename, e.g `secondary.client.js`, `some-service.client.js`.

### Create an abstraction for each request
Instead of calling `axios` method directly, e.g `axios#get`, `axios#post`, create an abstraction of each request. This can be placed within `/api` folder, and can also be grouped by feature.

```raw
.
├── api
│   ├── article.js
│   ├── ...
│   ├── news.js
│   └── user.js
``` 

For example, in `user.js`
```javascript
import { request } from '/api-client/main.client'

export function getUserById(id) {
    return request.call(this, {
        url: `/user/${id}`
    })
}

export function getUsers(page = 1, limit = 10) {
    return request.call(this, {
        url: `/users`,
        params: {
            page,
            limit
        }
    })
}
```
> `Function#call` is a must, so each abstracted request can be easily overriden by supplying `this` context.

### How to perform network request
Simply import methods defined in `/api/<feature>.js` folder.
```javascript
import { getUserById } from '/api/user.js'

getUserById('290191')
    .then((res) => {
        // handle response
    })
    .catch((err) => {
        // handle error
    })
```

### How to override network request config
This is used for API client with dynamic configuration, as mentioned in the (2) and (4) use cases.

For example, we want to use version 2's baseURL, instead of the default version 1's.
```javascript
import { getUserById } from '/api/user.js'

const customConfig = {
    baseURL: 'https://some.endpoint/v2'
}
getUserById.call(customConfig, '290191')
    .then((res) => {
        // handle response
    })
    .catch((err) => {
        // handle error
    })
```

`customConfig` can of course be fetched asynchronously, from cache, or anywhere else.

```javascript
import { getUserById } from '/api/user.js'

async function () {
    const baseURL = await getAPIBaseUrl()
    // const baseURL = myCookieParser.parse('api_base_url')
    // const baseURL = window.sessionStorage.get('api_base_url')
    // const baseURL = window.localStorage.get('api_base_url')
    
    const customConfig = { baseURL }
    getUserById.call(customConfig, '290191')
        .then((res) => {
            // handle response
        })
        .catch((err) => {
            // handle error
        })
}
```

### How to use a whole different API client
This might be the case when a totally different config is needed for the API client, e.g different interceptors, authorization header, etc.
```javascript
import axios from 'axios'
import { getUserById } from '/api/user.js'

const customClient = axios.create({
    // define config
})

getUserById.call(customClient, '290191')
    .then((res) => {
        // handle response
    })
    .catch((err) => {
        // handle error
    })
```
> Such customized client can be defined per request basis, or defined on a higher level which then be imported into above file.

### How to mock (using axios-mock-adapter)
Simply bind the abstracted request to the mock adapter instance using `Function#call`.
```javascript
import MockAdapter from 'axios-mock-adapter'
import { instance } from '/api-client/main.client'
import { getUserById } from '/api/user.js'
import fixtureData from '/path/to/fixture'

const mock = new MockAdapter(instance)
mock.onAny('/something').replyOnce(200, fixtureData)
getUserById.call(mock, '290191')
    .then((res) => {
        // handle response
    })
    .catch((err) => {
        // handle error
    })
```

You can also supply an empty axios instance for the mock adapter. Just be aware that it might not behave the same as pre-configured axios instance, especially when such instance include interceptors etc.
```diff
    import MockAdapter from 'axios-mock-adapter'
-   import { instance } from '@/api-client/main.client'
+   import axios from 'axios'
    import { getUserById } from '/api/user.js'

    const mock = new MockAdapter(axios.create({}))
    mock.onAny().replyOnce(200, fixtureData)

    getUserById.call(mock, '290191')
        .then((res) => {
            // handle response
        })
        .catch((err) => {
            // handle error
        })
```

---

## Credits

This pattern is heavily inspired by and is an improvement upon the pattern used in [@jabardigitalservice](https://github.com/jabardigitalservice).
