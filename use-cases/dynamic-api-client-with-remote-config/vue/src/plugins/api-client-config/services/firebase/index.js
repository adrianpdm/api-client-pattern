/**
 * @typedef {import('@firebase/app-types').FirebaseApp} FirebaseApp
 */

/**
 * @typedef {import('@firebase/analytics-types').FirebaseAnalytics} Analytics
 */

/**
 * @typedef {import('@firebase/remote-config-types').RemoteConfig} RemoteConfig
 */

/**
 * @typedef Firebase
 * @property {FirebaseApp} app
 * @property {Analytics} analytics
 * @property {RemoteConfig} remoteConfig
 */

/**
 * @type {Firebase}
 */
let firebaseApp = null

/**
 * Lazy initiation of firebase to prevent bloated bundle size
 * @returns {Promise<Firebase>}
 */
export async function getFirebase () {
  if (!firebaseApp) {
    let config = process.env.VUE_APP_FIREBASE_CONFIG
    if (!config) {
      return null
    }
    
    const { default: firebase } = await import('firebase/app')
    await import('firebase/analytics')
    await import('firebase/remote-config')
    
    if (!firebase.apps.length) {
      config = JSON.parse(config)
      const app = firebase.initializeApp(config)
      const remoteConfig = firebase.remoteConfig()
      const analytics = firebase.analytics()
      analytics.setAnalyticsCollectionEnabled(true)
      remoteConfig.settings.minimumFetchIntervalMillis = 0
  
      firebaseApp = {
        app,
        analytics,
        remoteConfig,
      }
    }
  }

  return firebaseApp
}
