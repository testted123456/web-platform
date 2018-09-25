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
import drag from "@/assets/js/drag"
import emailManager from '@/assets/js/emailName'


axios.defaults.withCredentials=true;
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.prototype.drag = drag
Vue.prototype.axios = axios
Vue.prototype.cookieManager = Cookie
Vue.prototype.ApiCopyId = 0;
Vue.prototype.ApiCopyData = {};

Vue.prototype.apisInfoCheckaddress = 'http://192.168.33.72:8080/#/';
Vue.prototype.aceManager = aceManager
Vue.prototype.emailManager = emailManager

String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

let env = 'dev'

if(env === 'prod') {
  var customIp = '127.0.0.1';

  Vue.prototype.wsServer = customIp+':9200';
  Vue.prototype.apiServer = 'http://' +  customIp + ':9090/inter/';
  Vue.prototype.testCaseServer = 'http://' + customIp + ':9200/case/';
  Vue.prototype.groupServer = 'http://' + customIp + ':9300/group/';

  Vue.prototype.testCaseAxios = axios.create({
    baseURL: 'http://'+ customIp +':9200/case/'
  });

  Vue.prototype.apiAxios = axios.create({
    baseURL: 'http://'+ customIp + ':9100/inter/',
    withCredentials: true
  });

  Vue.prototype.groupAxios = axios.create({
    baseURL: 'http://' + customIp + ':9300/group/',
    withCredentials: true
  });

  Vue.prototype.usrAxios = axios.create({
    baseURL: 'http://'+ customIp + ':9090'
  });

  Vue.prototype.mockAxios = axios.create({
    baseURL: 'http://'+ customIp +':9500/mock/'
  });

  Vue.prototype.toolAxios = axios.create({
    baseURL: 'http://'+ customIp +':8083/case/'
  });

  Vue.prototype.requireAxios = axios.create({
    baseURL: 'http://'+ customIp +':8089/'
  });
}else{
  var customIp2 = '192.168.1.121';

  Vue.prototype.wsServer = '192.168.1.122:9200';
  Vue.prototype.apiServer = 'http://'+ customIp2 +':8080/inter/';
  Vue.prototype.testCaseServer = 'http://'+ customIp2 +':8080/case/';
  Vue.prototype.groupServer = 'http://'+ customIp2 +':8080/group/';

  Vue.prototype.testCaseAxios = axios.create({
    baseURL: 'http://'+ customIp2 +':8080/case/'
  });

  Vue.prototype.apiAxios = axios.create({
    baseURL: 'http://'+ customIp2 +':8080/inter/'
  });

  Vue.prototype.groupAxios = axios.create({
    baseURL: 'http://'+ customIp2 +':8080/group/'
  });

  Vue.prototype.usrAxios = axios.create({
    baseURL: 'http://'+ customIp2 +':8080'
  });

  Vue.prototype.mockAxios = axios.create({
    baseURL: 'http://'+ customIp2 + ':8080/mock/'
  });
}

Vue.prototype.apiAxios.interceptors.response.use(data => {
    return data
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        router.replace({
          path: '/',
        })
        break;
      case 403:
        router.replace({
          path: '/'
        })
        break;
    }
  }
  console.log('main.js')
  return Promise.reject("请重新登陆！");
  return;
})


Vue.prototype.groupAxios.interceptors.response.use(data => {
  return data
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        router.replace({
          path: '/',
        })
        break;
      case 403:
        router.replace({
          path: '/'
        })
        break;
    }
  }
  return error
})

Vue.prototype.usrAxios.interceptors.response.use(data => {
  return data
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        router.replace({
          path: '/',
        })
        break;
      case 403:
        router.replace({
          path: '/'
        })
        break;
    }
  }
  return Promise.reject(error)
})


Vue.prototype.testCaseAxios.interceptors.response.use(data => {
  return data
}, (error) => {

  if (error.response) {
    switch (error.response.status) {
      case 401:
        router.replace({
          path: '/',
          // query: {redirect: router.currentRoute.fullPath}
        })
            break;
      case 403:
        router.replace({
          path: '/'
        })
            break;
    }
  }
  return Promise.reject(error)

})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})





