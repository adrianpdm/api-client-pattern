import MockAdapter from 'axios-mock-adapter'
import _merge from 'lodash.merge'
import { isAxios } from './is-axios'
/**
 * @param {import('axios').AxiosRequestConfig} config
 * @param {import('axios').AxiosInstance} defaultInstance 
 * @returns {import('axios').AxiosPromise}
 */
export function baseRequest(config, defaultInstance) {
  if (this instanceof MockAdapter) {
    return this.axiosInstance(config)
  }

  if (isAxios(this)) {
    return this(config)
  }

  if (isAxios(defaultInstance)) {
    let _config = this && typeof this === 'object'
      ? _merge(config, this)
      : config
    return defaultInstance(_config)
  }

  return Promise.reject(new ReferenceError('Default API client instance must be provided'))
}
