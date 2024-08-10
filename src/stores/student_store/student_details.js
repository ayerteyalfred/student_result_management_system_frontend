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
      const { getStudentId } = useAuthStore()
      const student_id = getStudentId

      return new Promise((resolve, reject) => {
        new resource(`students/${student_id}/details`)
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
    },

    updateStudent(student) {
      const { getStudentId } = useAuthStore()
      const student_id = getStudentId
      return new Promise((resolve, reject) => {
        new resource('students')
          .update(student, student_id)
          .then((res) => {
            // console.log(res.data.data)
            this.student_details = res.data.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})
