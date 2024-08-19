import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useGetStudentsStore = defineStore('get_students', {
  state: () => ({
    gets_students: []
  }),

  getters: {
    getStudents(state) {
      return state.gets_students
    }
  },

  actions: {
    fetchStudentsAction() {
      return new Promise((resolve, reject) => {
        new resource(`students`)
          .newget()
          .then((res) => {
            this.gets_students = res.data.data
            console.log(res.data)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    createStudents(student) {
      return new Promise((resolve, reject) => {
        new resource('students/')
          .store(student)
          .then((res) => {
            // console.log(res.data.data)
            this.gets_students = [res.data.data, ...this.gets_students]
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    updateStudentsInfo(student_id, student_details) {
      return new Promise((resolve, reject) => {
        new resource('students')
          .update(student_details, student_id)
          .then((res) => {
            const updatedStudent = res.data.data
            this.gets_students = this.gets_students.map((student) => {
              if (student.id == updatedStudent.id) {
                return updatedStudent // Replace the old student object with the updated one
              }
              return student // Return the original Student object if not matching
            })

            console.log(this.gets_students)

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    deleteStudents(id, student_id) {
      return new Promise((resolve, reject) => {
        new resource('users')
          .destroy(id)
          .then((res) => {
            this.gets_students = this.gets_students.filter((student) => student.id !== student_id)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})
