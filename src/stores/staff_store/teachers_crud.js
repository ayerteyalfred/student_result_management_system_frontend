import { defineStore } from 'pinia'
import resource from '@/services/resources'

export const useGetTeachersStore = defineStore('get_teachers', {
  state: () => ({
    gets_teachers: []
  }),

  getters: {
    getTeachers(state) {
      return state.gets_teachers
    }
  },

  actions: {
    fetchTeachersAction() {
      return new Promise((resolve, reject) => {
        new resource(`teachers`)
          .newget()
          .then((res) => {
            this.gets_teachers = res.data.data
            console.log(res.data)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    createTeacher(teacher) {
      return new Promise((resolve, reject) => {
        new resource('teachers/')
          .store(teacher)
          .then((res) => {
            // console.log(res.data.data)
            this.gets_teachers = [res.data.data, ...this.gets_teachers]
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    updateTeacherInfo(teacher_id, teacher_details) {
      return new Promise((resolve, reject) => {
        new resource('teachers')
          .update(teacher_details, teacher_id)
          .then((res) => {
            const updatedTeacher = res.data.data
            this.gets_teachers = this.gets_teachers.map((teacher) => {
              if (teacher.id == updatedTeacher.id) {
                return updatedTeacher // Replace the old teacher object with the updated one
              }
              return teacher // Return the original teacher object if not matching
            })

            console.log(this.gets_teachers)

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    deleteTeacher(id) {
      return new Promise((resolve, reject) => {
        new resource('teachers/')
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
