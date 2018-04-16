
const state = {
  newFlowCase: {},
  isNewFlowCaseSaved: 0
}

const getters = {
  getFlowCase(){
    return state.newFlowCase;
  }
}

const actions = {
}

const mutations = {
  changeFlowCaseStatus(state, s) {
    state.isNewFlowCaseSaved = s;
  },
  setNewFlowCase(state, flowCase){
    state.newFlowCase = flowCase;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
