import { defineStore } from 'pinia'
// import { useLocalStorage } from '@vueuse/core';
import resource from '@/services/resources'
import crypto from '@/services/crypto'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    token: '',
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
    }
  },

  actions: {
    loginUserAction(data) {
      return new Promise((resolve, reject) => {
        new resource('auth/login/')
          .store(data)
          .then((res) => {
            const encryptedUser = crypto.encryptData(JSON.stringify(res.user), crypto.secretKey())
            localStorage.setItem('userInfo', encryptedUser)
            this.user = res.data.user

            const encryptedToken = crypto.encryptData(res.token, crypto.secretKey())
            localStorage.setItem('Token', encryptedToken)
            this.token = encryptedToken

            resolve(res.data.user)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    signoutAction() {
      return new Promise((resolve, reject) => {
        new resource('logout')
          .list({})
          .then((res) => {
            this.user = {}
            this.token = ''
            this.permissions = []

            localStorage.removeItem('userInfo')
            localStorage.removeItem('Token')
            localStorage.removeItem('Permissions')
            clearTimeout(this.sessionTimer)
            this.sessionTimer = null

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    refreshToken() {
      return new Promise((resolve, reject) => {
        new resource('refresh')
          .list()
          .then((res) => {
            // Update the token with the refreshed token
            const encryptedToken = crypto.encryptData(res.data.access_token, crypto.secretKey())
            localStorage.setItem('Token', encryptedToken)
            this.token = encryptedToken
            // Restart session timer
            // console.log("Restarted");
            this.startSessionTimer()
            resolve()
          })
          .catch((error) => {
            helper
              .sessionExpiredPrompt('Session Expired', {
                allowOutsideClick: false // Disable closing on outside click
              })
              .then((result) => {
                if (result.isConfirmed) {
                  localStorage.removeItem('userInfo')
                  localStorage.removeItem('Token')
                  localStorage.removeItem('Permissions')
                  this.router.push({ name: 'login' }).then(() => {
                    this.router.go()
                  })
                }
              })
            console.error('Failed to refresh token:', error)
            reject()
          })
      })
    }
  }
})
