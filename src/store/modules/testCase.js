
const state = {
  newTestCase: {},
  isNewTestCaseSaved: 0
}

const getters = {
  getTestCase(){
    return state.newTestCase;
  }
}

const actions = {
}

const mutations = {
  changeTestCaseStatus(state, s) {
    state.isNewTestCaseSaved = s;
  },
  setNewTestCase(state, testCase){
    state.newTestCase = testCase;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
