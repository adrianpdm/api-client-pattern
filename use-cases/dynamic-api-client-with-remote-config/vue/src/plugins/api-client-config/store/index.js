import {
  getConfigFromCache as fromCache,
  getConfigFromRemote as fromRemote,
} from '../source/firebase'

function shouldFetch(lastFetchMillis, minIntervalMillis = 30000) {
  return Date.now() - lastFetchMillis >= minIntervalMillis
}

function isObject(obj) {
  return !!obj && typeof obj === 'object'
}

const state = () => ({
  config: null,
  lastFetched: 0,
})

const getters = {
  //
}

const mutations = {
  setConfig(state, config) {
    state.config = JSON.parse(JSON.stringify(config))
    state.lastFetched = Date.now()
  },
}

const actions = {
  async getConfig({ state, commit }) {
    let config = await fromCache()
    const doFetch = shouldFetch(state.lastFetched)
    if (!config || doFetch) {
      const config = await fromRemote().catch(() => null)
      if (config) {
        commit('setConfig', config)
      }
    }

    return state.config
  },
  async getBaseURLByEndpoint({ dispatch }, { endpoint }) {
    let result
    const { base_url: baseURL } = await dispatch('getConfig')
    if (isObject(baseURL)) {
      for (const [key, value] of Object.entries(baseURL)) {
        if (`${key}`.startsWith(`${endpoint}`)) {
          result = value
          break
        }
      }
    }
    return result
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
