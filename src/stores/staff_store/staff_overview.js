import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useStaffOverViewStore = defineStore('staff_overview', {
  state: () => ({
    overview: {}
  }),

  getters: {
    getStaffOverview(state) {
      return state.staff_overview
    }
  },

  actions: {
    fetchStaffOverViewAction() {
      return new Promise((resolve, reject) => {
        new resource(`staff-overview`)
          .newget()
          .then((res) => {
            this.staff_overview = res.data
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
