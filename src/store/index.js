import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/api.js'
import testCase from './modules/testCase.js'
import group from './modules/group.js'
import flowCase from './modules/flowCase.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api, testCase, group ,flowCase
  }
})
