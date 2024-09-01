import { defineStore } from 'pinia'
// import { useLocalStorage } from '@vueuse/core';
import resource from '@/services/resources'
import crypto from '@/services/crypto'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    token: '',
    student_id: '',
    teacher_id: '',
    staff_id: '',
    router: useRouter()
  }),

  getters: {
    getUser() {
      const encryptedUser = localStorage.getItem('userInfo')
      return encryptedUser ? JSON.parse(crypto.decryptData(encryptedUser, crypto.secretKey())) : {}
    },

    getToken() {
      const token = localStorage.getItem('Token')
      const authToken = token ? crypto.decryptData(token, crypto.secretKey()) : ''
      return authToken
    },

    getStudentId() {
      const encryptedStudent = localStorage.getItem('student_id')
      const decryptStudent = encryptedStudent
        ? crypto.decryptData(encryptedStudent, crypto.secretKey())
        : ''
      return decryptStudent
    },

    getTeacherId() {
      const encryptedTeacher = localStorage.getItem('teacher_id')
      const decryptTeacher = encryptedTeacher
        ? crypto.decryptData(encryptedTeacher, crypto.secretKey())
        : ''
      return decryptTeacher
    },

    getStaffId() {
      const encryptedStaff = localStorage.getItem('staff_id')
      const decryptStaff = encryptedStaff
        ? crypto.decryptData(encryptedStaff, crypto.secretKey())
        : ''
      return decryptStaff
    }
  },

  actions: {
    loginUserAction(data) {
      return new Promise((resolve, reject) => {
        new resource('auth/login/')
          .store(data)
          .then((res) => {
            const encryptedUser = crypto.encryptData(
              JSON.stringify(res.data.user),
              crypto.secretKey()
            )
            localStorage.setItem('userInfo', encryptedUser)
            this.user = res.data.user

            const encryptedStudent_id = crypto.encryptData(
              JSON.stringify(res.data.student_id),
              crypto.secretKey()
            )
            localStorage.setItem('student_id', encryptedStudent_id)
            this.student_id = res.data?.student_id

            const encryptedTeacher_id = crypto.encryptData(
              JSON.stringify(res.data?.teacher_id),
              crypto.secretKey()
            )
            localStorage.setItem('teacher_id', encryptedTeacher_id)
            this.teacher_id = res.data?.teacher_id

            const encryptedStaff_id = crypto.encryptData(
              JSON.stringify(res.data?.staff_id),
              crypto.secretKey()
            )
            localStorage.setItem('staff_id', encryptedStaff_id)
            this.teacher_id = res.data?.staff_id

            const encryptedToken = crypto.encryptData(res.data.token, crypto.secretKey())
            localStorage.setItem('Token', encryptedToken)
            this.token = encryptedToken

            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    signoutAction() {
      return new Promise((resolve, reject) => {
        new resource('auth/logout/')
          .store()
          .then((res) => {
            this.user = {}
            this.token = ''

            localStorage.removeItem('userInfo')
            localStorage.removeItem('Token')

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
