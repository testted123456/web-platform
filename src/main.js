import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'
import store from './store'
import Cookie from '@/assets/js/qc-cookie'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)

Vue.prototype.cookieManager = Cookie
Vue.prototype.ApiCopyId = 0;
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


