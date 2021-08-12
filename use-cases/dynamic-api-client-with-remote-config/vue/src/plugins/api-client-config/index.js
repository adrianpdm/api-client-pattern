import storeModule from './store'

/**
 * @typedef {import("axios").AxiosInstance} AxiosInstance
 */

/**
 * @typedef {import('vuex/types/index').Store} VuexStore
 */

/**
 * @typedef ApiClientConfigVuePluginOptions
 * @property {AxiosInstance} axiosInstance
 * @property {VuexStore} store
 * @property {string} storeModuleName - Vuex module name
 */

/**
 * 
 * @param {any} Vue - vue app instance
 * @param {ApiClientConfigVuePluginOptions} options
 */
async function install (Vue, options = {}) {
  const {
    axiosInstance,
    store,
    storeModuleName: name = 'apiClientConfig',
  } = options

  if (!axiosInstance || !store) {
    return
  }

  if (!store.hasModule(name)) {
    store.registerModule(name, storeModule)
    
    const onRequestSuccess = async (config) => {
      const baseURL = await store.dispatch(
        `${name}/getBaseURLByEndpoint`,
        {
          endpoint: config.url,
        })

      if (baseURL) {
        config.baseURL = baseURL
      }

      return config
    }
    axiosInstance.interceptors.request.use(onRequestSuccess, null)
  }
}

export const ApiClientConfigPlugin = {
  install,
}

export default ApiClientConfigPlugin
