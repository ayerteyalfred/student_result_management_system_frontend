import { defineStore } from 'pinia'
import resource from '@/services/resources'
import { useAuthStore } from '../auth'

export const useStudentDetailsStore = defineStore('student_details', {
  state: () => ({
    student_details: {}
  }),

  getters: {
    getStudentDetails(state) {
      return state.student_details
    }
  },

  actions: {
    fetchStudentDetailsAction() {
      const { getUser } = useAuthStore()
      const user_id = getUser.id

      return new Promise((resolve, reject) => {
        new resource(`students/${user_id}/details`)
          .newget()
          .then((res) => {
            this.student_details = res.data.data.student
            // console.log(res.data.data.student)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
