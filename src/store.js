import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// TODO
// Some api to get data, use webpack.config alias to discriminate server and client
const fetchItem = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve({ foo: 'bar' }), 200)
})

// Just a demo, full usage see Vuex
export function createStore() {
  return new Vuex.Store({
    state: {
      item: {}
    },
    actions: {
      test ({ commit }) {
        return fetchItem().then(item => commit('setItem', { item }))
      }
    },
    mutations: {
      setItem (state, { item }) {
        state.item = item
      }
    }
  })
}
