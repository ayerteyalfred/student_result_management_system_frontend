import { defineStore } from 'pinia'
import resource from '@/services/resources'
import { useAuthStore } from '../auth'

export const useStaffDetailsStore = defineStore('staff_details', {
  state: () => ({
    staff_details: {}
  }),

  getters: {
    getStaffDetails(state) {
      return state.staff_details
    }
  },

  actions: {
    fetchStaffDetailsAction() {
      const { getStaffId } = useAuthStore()
      const staff_id = getStaffId
      console.log(staff_id)

      return new Promise((resolve, reject) => {
        new resource(`staff/${staff_id}/details`)
          .newget()
          .then((res) => {
            this.staff_details = res.data.data
            // console.log(res.data.data.staff)

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    updateStaff(staff) {
      const { getStaffId } = useAuthStore()
      const staff_id = getStaffId
      return new Promise((resolve, reject) => {
        new resource('staff')
          .update(staff, staff_id)
          .then((res) => {
            // console.log(res.data.data)
            this.staff_details = res.data.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
})
