import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useSchoolYearStore = defineStore('school_year', {
  state: () => ({
    school_year: {}
  }),

  getters: {
    getSchoolYears(state) {
      return state.school_year
    }
  },

  actions: {
    fetchSchoolYearsAction() {
      return new Promise((resolve, reject) => {
        new resource(`school-years`)
          .newget()
          .then((res) => {
            this.school_year = res.data.data
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
