
const state = {
  newApi: {},
  isNewApiSaved: 0
}

const getters = {
  getApi(){
    return state.newApi;
  }
}

const actions = {

}

const mutations = {
  changeApiStatus(state, s) {
    state.isNewApiSaved = s;
  },
  setNewApi(state, api){
    state.newApi = api;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
