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
import('babel-polyfill')

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

let env = 'prod'

var customIp = '192.168.7.172';
var mockIp = '192.168.7.172';
// var testCaseIp = '192.168.1.122';
var testCaseIp = '192.168.1.172';
var apiIp = '192.168.1.172';

if(env === 'prod'){
  customIp = '192.168.1.121';
  mockIp = '192.168.1.120';
  testCaseIp = '192.168.1.122';
  apiIp = '192.168.1.121';
}

// if(env === 'dev') {

  Vue.prototype.wsServer = testCaseIp+':9200';
  Vue.prototype.testCaseServer = testCaseIp+':9200';
  Vue.prototype.apiServer = apiIp + ':9100';

  Vue.prototype.testCaseAxios = axios.create({
    baseURL: 'http://'+ customIp +':9700/platform-testcase/'
  });

  Vue.prototype.apiAxios = axios.create({
    baseURL: 'http://'+ customIp + ':9700/platform-interface/',
    withCredentials: true
  });

  Vue.prototype.groupAxios = axios.create({
    baseURL: 'http://' + customIp + ':9700/platform-testgroup/',
    withCredentials: true
  });

  Vue.prototype.usrAxios = axios.create({
    baseURL: 'http://'+ customIp + ':9700/platform-user/'
  });

  Vue.prototype.mockAxios = axios.create({
    baseURL: 'http://'+ mockIp +':9600/mock/'
  });

  Vue.prototype.toolAxios = axios.create({
    baseURL: 'http://'+ customIp +':9700/platform-testcase/'
  });

Vue.prototype.appMockAxios = axios.create({
  baseURL: 'http://'+ customIp +':9700/platform-appmock/',
  withCredentials: true
});

  Vue.prototype.requireAxios = axios.create({
    baseURL: 'http://'+ customIp +':8089/'
  });
// }else{
//   var customIp2 = '192.168.1.121';
//
//   Vue.prototype.wsServer = '192.168.1.122:9200';
//
//   Vue.prototype.testCaseAxios = axios.create({
//     baseURL: 'http://'+ customIp2 +':8080/case/'
//   });
//
//   Vue.prototype.apiAxios = axios.create({
//     baseURL: 'http://'+ customIp2 +':8080/inter/'
//   });
//
//   Vue.prototype.groupAxios = axios.create({
//     baseURL: 'http://'+ customIp2 +':8080/group/'
//   });
//
//   Vue.prototype.usrAxios = axios.create({
//     baseURL: 'http://'+ customIp2 +':8080'
//   });
//
//   Vue.prototype.mockAxios = axios.create({
//     baseURL: 'http://'+ customIp2 + ':8080/mock/'
//   });
// }

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
  // console.log('main.js')
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





