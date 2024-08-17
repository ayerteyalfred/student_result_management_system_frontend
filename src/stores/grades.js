import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useGetGradeStore = defineStore('grades', {
  state: () => ({
    grades: []
  }),

  getters: {
    getGrades(state) {
      return state.grades
    }
  },

  actions: {
    fetchGradeAction() {
      return new Promise((resolve, reject) => {
        new resource(`grades`)
          .newget()
          .then((res) => {
            this.grades = res.data.data
            console.log(res.data.data)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
