import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import '../theme/index.css'
import VueResource from 'vue-resource'
import store from './store'
import Cookie from '@/assets/js/qc-cookie'
import aceManager from '@/assets/js/hd-ace'
import axios from 'axios'


Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)

Vue.prototype.axios = axios
Vue.prototype.cookieManager = Cookie
Vue.prototype.ApiCopyId = 0;
Vue.prototype.ApiCopyData = {};
Vue.prototype.apiServer = 'http://192.168.32.128:8082/inter/';
Vue.prototype.testCaseServer = 'http://192.168.32.128:8083/case/';
Vue.prototype.wsServer = '192.168.32.128:8083';
Vue.prototype.groupServer = 'http://192.168.32.150:8082/group/';
Vue.prototype.address = 'http://192.168.32.100:8083/#/';
Vue.prototype.aceManager = aceManager
String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");

}

Vue.prototype.testCaseAxios = axios.create({
  baseURL: 'http://192.168.32.100:8083/case/'
});

Vue.prototype.apiAxios = axios.create({
  baseURL: 'http://192.168.32.100:8082/inter/'
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


