import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useManageStudentStore = defineStore('manage-student', {
  state: () => ({
    student_list: {},
    student_result_teacher: {},
    subjects: {},
    exams: {}
  }),

  getters: {
    getStudentList(state) {
      return state.student_list
    },
    getStudentResultTeacher(state) {
      return state.student_result_teacher
    },
    getSubjects(state) {
      return state.subjects
    },
    getExams(state) {
      return state.exams
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

    fetchSubjectsAction() {
      return new Promise((resolve, reject) => {
        new resource(`subjects`)
          .newget()
          .then((res) => {
            this.subjects = res.data.data
            console.log(res.data.data)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    fetchExamsAction() {
      return new Promise((resolve, reject) => {
        new resource(`exams`)
          .newget()
          .then((res) => {
            this.exams = res.data.data
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
    },

    updateStudentResult(results_id, result_mark) {
      return new Promise((resolve, reject) => {
        new resource('results')
          .update(result_mark, results_id)
          .then((res) => {
            // console.log(res.data.data)
            // this.student_details = res.data.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteStudentResult(id) {
      return new Promise((resolve, reject) => {
        new resource('results')
          .destroy(id)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})
