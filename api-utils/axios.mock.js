import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { isAxios } from './is-axios'

/**
 * 
 * @param {import("axios").AxiosInstance} axiosInstance 
 * @returns {MockAdapter}
 */
export function createMock(axiosInstance) {
  if (!isAxios(axiosInstance)) {
    throw new ReferenceError('mock can only be created for axios instance')
  }

  const cloned = axios.create(axiosInstance.defaults)
  return new MockAdapter(cloned)
}
