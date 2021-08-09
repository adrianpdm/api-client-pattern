import axios from 'axios'
import { baseRequest } from '../api-utils/axios.base-request'

function onRequestSuccess(config) {
  // TODO: define interceptor (if needed)
  return config
}

function onRequestError(e) {
  // TODO: define interceptor (if needed)
  return Promise.reject(e)
}

function onResponseSuccess(response) {
  // TODO: define interceptor (if needed)
  return response
}

function onResponseError(e) {
  // TODO: define interceptor (if needed)
  return Promise.reject(e)
}

export const instance = (function () {
  const _instance = axios.create({
    // TODO: define axios config
  })

  // uncomment this line if interceptors is needed
  // _instance.interceptors.request.use(onRequestSuccess, onRequestError)
  // _instance.interceptors.response.use(onResponseSuccess, onResponseError)

  return _instance
})()

export function request(config) {
  return baseRequest.call(this, config, instance)
}
