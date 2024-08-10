import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useOverViewStore = defineStore('overview', {
  state: () => ({
    overview: {}
  }),

  getters: {
    getOverview(state) {
      return state.overview
    }
  },

  actions: {
    fetchOverViewAction() {
      return new Promise((resolve, reject) => {
        new resource(`teacher/overview`)
          .newget()
          .then((res) => {
            this.overview = res.data
            console.log(res.data)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
