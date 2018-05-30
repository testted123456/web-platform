
const state = {
  newMock: {},
  isNewMockSaved: 0
}

const getters = {
  getMock(){
    return state.newMock;
  }
}

const actions = {
}

const mutations = {
  changeMockStatus(state, s) {
    state.isNewMockSaved = s;
  },
  setNewMock(state, mock){
    state.newMock = mock;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
