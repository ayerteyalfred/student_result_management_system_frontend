import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useManageStudentStore = defineStore('manage-student', {
  state: () => ({
    student_list: {},
    student_result_teacher: {}
  }),

  getters: {
    getStudentList(state) {
      return state.student_list
    },
    getStudentResultTeacher(state) {
      return state.student_result_teacher
    }
  },

  actions: {
    fetchStudentListAction() {
      return new Promise((resolve, reject) => {
        new resource(`teacher/manage-students/?student_list=true`)
          .newget()
          .then((res) => {
            this.student_list = res.data
            console.log(res.data)

            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    fetchStudentResultTeacherAction(params) {
      return new Promise((resolve, reject) => {
        new resource(`students/${params}`)
          .newget()
          .then((res) => {
            this.student_result_teacher = res.data.data
            console.log(res.data.data)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    inputStudentResult(student) {
      return new Promise((resolve, reject) => {
        new resource('results/')
          .store(student)
          .then((res) => {
            // console.log(res.data.data)
            //   this.student_details = res.data.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})
