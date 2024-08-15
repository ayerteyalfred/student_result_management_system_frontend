import TeachesLayout from '@/layout/TeachesLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import LogIn from '@/views/auth/LoginPage.vue'

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
          }
        },
        {
          path: '/teacher-class',
          name: 'teacher-class',
          component: TeacherClass,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/student-result',
          name: 'student-result',
          component: ResultInput,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/teacher-details',
          name: 'teacher-details',
          component: TeacherDetails,
          meta: {
            requiresAuth: true
          }
        },

        // Student Dashboard Link
        {
          path: '/student-details',
          name: 'student-details',
          component: StudentDetails,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/my-result',
          name: 'my-result',
          component: MyResult,
          meta: {
            requiresAuth: true
          }
        },

        // Staff Dashboard Links
        {
          path: '/overview-staff',
          name: 'overview-staff',
          component: OverviewStaff,
          meta: {
            requiresAuth: true
          }
        },

        {
          path: '/create-teachers',
          name: 'create-teachers',
          component: CreateTeacher,
          meta: {
            requiresAuth: true
          }
        },

        {
          path: '/create-students',
          name: 'create-students',
          component: CreateStudent,
          meta: {
            requiresAuth: true
          }
        },

        {
          path: '/staff-details',
          name: 'staff-details',
          component: StaffDetails,
          meta: {
            requiresAuth: true
          }
        }
      ]
    }
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
