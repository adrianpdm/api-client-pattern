import { request } from '../api-client/main.client'

export function getSomething () {
  return request.call(this, {
    url: '/something'
  })
}

export function getAnotherThing (param1, param2) {
  return request.call(this, {
    url: '/another-thing',
    params: {
      param1,
      param2
    }
  })
}
