import axios from 'axios'
import jsCookie from 'js-cookie'

const cookieKey = 'api_client_config'
const flagrClient = (function(){
  const baseURL = process.env.VUE_APP_FLAGR_URL
  if (!baseURL) {
    throw new Error('Flagr URL must be set')
  }
  const __instance = axios.create({
    baseURL,
  })

  return __instance
})()

export async function getConfigFromCache() {
  let config = jsCookie.get(cookieKey)
  try {
    if (typeof config === 'string' && config.length) {
      config = JSON.parse(config)
    }
  } catch (e) {
    config = null
  }
  console.groupCollapsed(
    '%cCache | Flagr',
    'padding: 0.5em; border-radius: 0.5em; background-color: green; color: white',
    'Fetching API Client Config',
  )
  console.log(config)
  console.groupEnd()
  return config
}

export async function getConfigFromRemote() {
  const config = await flagrClient({
    method: 'POST',
    url: '/evaluation',
    data: {
      flagID: 12,
      entityContext: {
        kab_kota: 3273,
      },
    },
  })
  .then((res) => {
    return res?.data?.variantAttachment || null
  })
  .catch(() => null)

  if (config) {
    const expireInMinutes = 30
    const expires = new Date(new Date().getTime() + (expireInMinutes * 60 * 1000));
    jsCookie.set(cookieKey, JSON.stringify(config), {
      expires,
    })
  }

  console.groupCollapsed(
    '%cRemote | Flagr',
    'padding: 0.5em; border-radius: 0.5em; background-color: green; color: white',
    'Fetching API Client Config',
  )
  console.log(config)
  console.groupEnd()

  return config
}