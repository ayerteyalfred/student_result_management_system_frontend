import { defineStore } from 'pinia'
import resource from '@/services/resources'
import { useAuthStore } from '../auth'

export const useTeacherDetailsStore = defineStore('teacher_details', {
  state: () => ({
    teacher_details: {}
  }),

  getters: {
    getTeacherDetails(state) {
      return state.teacher_details
    }
  },

  actions: {
    fetchTeacherDetailsAction() {
      const { getTeacherId } = useAuthStore()
      const teacher_id = getTeacherId
      console.log(teacher_id)

      return new Promise((resolve, reject) => {
        new resource(`teachers/${teacher_id}/details`)
          .newget()
          .then((res) => {
            this.teacher_details = res.data.data
            console.log(res.data.data)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    updateTeacher(teacher) {
      const { getTeacherId } = useAuthStore()
      const teacher_id = getTeacherId
      return new Promise((resolve, reject) => {
        new resource('teachers')
          .update(teacher, teacher_id)
          .then((res) => {
            console.log(res.data.data)
            this.teacher_details = res.data.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})
