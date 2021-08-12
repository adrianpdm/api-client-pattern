import axios from 'axios'

function onRequestSuccess(config) {
  return config
}

function onRequestError(e) {
  return Promise.reject(e)
}

function onResponseSuccess(res) {
  return res.data
}

function onResponseError(e) {
  return Promise.reject(e)
}

const client = (function() {
  const __instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
  })

  __instance.interceptors.request.use(
    onRequestSuccess,
    onRequestError,
  )

  __instance.interceptors.response.use(
    onResponseSuccess,
    onResponseError,
  )

  return __instance
})()

export {
  client,
}
export default client
