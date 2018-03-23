
const state = {
  newGroup: {},
  isNewGroupSaved: 0
}

const getters = {
  getGroup(){
    return state.newGroup;
  }
}

const actions = {
}

const mutations = {
  changeGroupStatus(state, s) {
    state.isNewGroupSaved = s;
  },
  setNewGroup(state, group){
    state.newGroup = group;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
