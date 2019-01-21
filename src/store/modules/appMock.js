
const state = {
  newAppMock: {},
  isNewAppMockSaved: 0
}

const getters = {
  getAppMock(){
    return state.newAppMock;
  }
}

const actions = {
}

const mutations = {
  changeAppMockStatus(state, s) {
    state.isNewAppMockSaved = s;
  },
  setNewAppMock(state, appMock){
    state.newAppMock = appMock;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
