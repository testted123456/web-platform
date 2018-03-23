import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import '../theme/index.css'
import VueResource from 'vue-resource'
import store from './store'
import Cookie from '@/assets/js/qc-cookie'
import aceManager from '@/assets/js/hd-ace'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)

Vue.prototype.cookieManager = Cookie
Vue.prototype.ApiCopyId = 0;
Vue.prototype.ApiCopyData = {};
Vue.prototype.apiServer = 'http://192.168.32.49:8082/inter/';
Vue.prototype.testCaseServer = 'http://192.168.32.49:8083/case/';
Vue.prototype.address = 'http://localhost:8080/#/';
Vue.prototype.aceManager = aceManager
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");

}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


