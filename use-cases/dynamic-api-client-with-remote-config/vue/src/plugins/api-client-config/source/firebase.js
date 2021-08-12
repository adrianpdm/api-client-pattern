import { getFirebase } from '../services/firebase'

async function getRemoteConfigValue() {
  const firebase = await getFirebase()
  let config = firebase.remoteConfig.getValue('api_client_config').asString()
  if (config && config.length) {
    try {
      config = JSON.parse(config)
    } catch (e) {
      config = null
    }
  }

  return config
}

/**
 * @see "./config.example.json"
 * @returns {object|null} baseURL config
 */
export async function getConfigFromCache () {
  try {
    const firebase = await getFirebase()
    await firebase.remoteConfig.activate()

    const config = await getRemoteConfigValue()
    console.groupCollapsed(
      '%cCache | Firebase',
      'padding: 0.5em; border-radius: 0.5em; background-color: green; color: white',
      'Fetching API Client Config',
    )
    console.log(config)
    console.groupEnd()

    return config
  } catch (e) {
    return null
  }
}

/**
 * @see "./config.example.json"
 * @returns {object|null} baseURL config
 */
export async function getConfigFromRemote () {
  try {
    const firebase = await getFirebase()
    firebase.analytics.setUserProperties({
      kab_kota: '3273',
    })
    firebase.analytics.logEvent('get_api_client_config')
    await firebase.remoteConfig.fetchAndActivate()
    
    const config = await getRemoteConfigValue()
    console.groupCollapsed(
      '%cRemote | Firebase',
      'padding: 0.5em; border-radius: 0.5em; background-color: green; color: white',
      'Fetching API Client Config',
    )
    console.log(config)
    console.groupEnd()

    return config
  } catch (e) {
    return null
  }
}
