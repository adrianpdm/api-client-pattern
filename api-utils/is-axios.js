/**
 * A simple check whether an object is an instanceof AxiosInstance
 * @param {any} obj - object to test
 * @returns {boolean}
 */
export function isAxios(obj) {
  return !!obj
    && 'defaults' in obj
    && 'interceptors' in obj
}

export default isAxios
