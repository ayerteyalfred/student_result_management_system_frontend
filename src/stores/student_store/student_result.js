import { defineStore } from 'pinia'
import resource from '@/services/resources'
import { useAuthStore } from '../auth'

export const useStudentResultStore = defineStore('student_result', {
  state: () => ({
    student_result: {}
  }),

  getters: {
    getStudentResult(state) {
      return state.student_result
    }
  },

  actions: {
    fetchStudentResultAction(params) {
      const { getStudentId } = useAuthStore()
      const student_id = getStudentId

      return new Promise((resolve, reject) => {
        new resource(`students/${student_id}/results/${params}`)
          .newget()
          .then((res) => {
            this.student_result = res.data
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
