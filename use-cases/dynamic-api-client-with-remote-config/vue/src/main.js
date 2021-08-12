import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ApiClientConfigPlugin } from './plugins/api-client-config'
import { client } from './api-client/main.client'

Vue.config.productionTip = false
Vue.use(ApiClientConfigPlugin, {
  axiosInstance: client,
  store,
  storeModuleName: 'apiClientConfig',
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
