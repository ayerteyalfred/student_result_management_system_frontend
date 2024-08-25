import TeachesLayout from '@/layout/TeachesLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import LogIn from '@/views/auth/LoginPage.vue'
import PageNotFound from '@/views/PageNotFound.vue'

// Teacher Dashboard Pages
import OverviewTeacher from '@/views/dashboard_teacher/OverviewTeacher.vue'
import TeacherClass from '@/views/dashboard_teacher/TeacherClass.vue'
import ResultInput from '@/views/dashboard_teacher/ResultInput.vue'
import TeacherDetails from '@/views/dashboard_teacher/TeacherDetails.vue'

// Student Dashboard Page
import StudentDetails from '@/views/dashboard_student/StudentDetails.vue'
import MyResult from '@/views/dashboard_student/MyResult.vue'

// Staff Dashboard Page
import OverviewStaff from '@/views/dashboard_staff/OverviewStaff.vue'
import StaffDetails from '@/views/dashboard_staff/StaffDetails.vue'
import CreateTeacher from '@/views/dashboard_staff/CreateTeacher.vue'
import CreateStudent from '@/views/dashboard_staff/CreateStudent.vue'

import crypto from '@/services/crypto'

const encryptedUser = localStorage.getItem('userInfo')
const user = encryptedUser ? JSON.parse(crypto.decryptData(encryptedUser, crypto.secretKey())) : {}

const default_redirect = ref()
if (user?.user_type == 'teacher') {
  default_redirect.value = 'overview-teacher'
} else if (user?.user_type == 'student') {
  default_redirect.value = 'student-details'
} else if (user?.user_type == 'staff') {
  default_redirect.value = 'overview-staff'
} else {
  default_redirect.value = 'login'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LogIn,
      meta: {
        requiresAuth: false
      }
    },

    // Teacher Dashboard
    {
      path: '/',
      name: 'index-teacher',
      component: TeachesLayout,
      redirect: default_redirect.value,
      children: [
        {
          path: '/overview-teacher',
          name: 'overview-teacher',
          component: OverviewTeacher,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'staff') {
              next('/overview-staff')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },
        {
          path: '/teacher-class',
          name: 'teacher-class',
          component: TeacherClass,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'staff') {
              next('/overview-staff')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },
        {
          path: '/student-result',
          name: 'student-result',
          component: ResultInput,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'staff') {
              next('/overview-staff')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },
        {
          path: '/teacher-details',
          name: 'teacher-details',
          component: TeacherDetails,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'staff') {
              next('/overview-staff')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },

        // Student Dashboard Link
        {
          path: '/student-details',
          name: 'student-details',
          component: StudentDetails,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'teacher') {
              next('/overview-teacher')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'staff') {
              next('/overview-staff')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },
        {
          path: '/my-result',
          name: 'my-result',
          component: MyResult,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'teacher') {
              next('/overview-teacher')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'staff') {
              next('/overview-staff')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },

        // Staff Dashboard Links
        {
          path: '/overview-staff',
          name: 'overview-staff',
          component: OverviewStaff,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'teacher') {
              next('/overview-teacher')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },

        {
          path: '/create-teachers',
          name: 'create-teachers',
          component: CreateTeacher,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'teacher') {
              next('/overview-teacher')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },

        {
          path: '/create-students',
          name: 'create-students',
          component: CreateStudent,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'teacher') {
              next('/overview-teacher')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        },

        {
          path: '/staff-details',
          name: 'staff-details',
          component: StaffDetails,
          meta: {
            requiresAuth: true
          },
          beforeEnter: (to, from, next) => {
            if (user?.user_type == 'teacher') {
              next('/overview-teacher')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else if (user?.user_type == 'student') {
              next('/student-details')
              Swal.fire(
                'Unauthourized Access!',
                `Please you have not been authourized to have access to this page.
                          Kindly contact your administrator.`,
                'warning'
              )
            } else {
              next()
            }
          }
        }
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const authToken = localStorage.getItem('Token')
  const token = authToken ? crypto.decryptData(authToken, crypto.secretKey()) : ''

  if (requiresAuth && !token) {
    next({ name: 'login' })
  } else if (!requiresAuth && token) {
    next()
  } else {
    next()
  }
})

export default router
