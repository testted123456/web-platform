/**
 * Created by keepup on 2018/4/22.
 */
// 权限 状态管理

const state = {
  dbgroup:{
    del:false,
    edit:false
  }
}

const getters = {
}

const actions = {
}

const mutations = {
  changeDBgroup(state, s) {
    for (var key in s){
      var value = s[key]
      state.dbgroup[key] = value;
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
