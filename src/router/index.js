import TeachesLayout from '@/layout/TeachesLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LogIn from '@/views/auth/LoginPage.vue'

// Teacher Dashboard Pages
import OverviewPage from '@/views/dashboard_teacher/OverviewPage.vue'
import TeacherClass from '@/views/dashboard_teacher/TeacherClass.vue'
import StudentResult from '@/views/dashboard_teacher/StudentResult.vue'
import StudentAttendance from '@/views/dashboard_teacher/StudentAttendance.vue'
import SubjectsPage from '@/views/dashboard_teacher/SubjectsPage.vue'
import IssuesPage from '@/views/dashboard_teacher/IssuesPage.vue'

// Student Dashboard Page
import StudentDetails from '@/views/dashboard_student/StudentDetails.vue'
import MyResult from '@/views/dashboard_student/MyResult.vue'

import crypto from '@/services/crypto'

const encryptedUser = localStorage.getItem('userInfo')
const user = encryptedUser ? JSON.parse(crypto.decryptData(encryptedUser, crypto.secretKey())) : {}

let default_redirect = ''
if (user.user_type == 'teacher') {
  default_redirect = 'overview-teacher'
} else {
  default_redirect = 'student-details'
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
      redirect: default_redirect,
      children: [
        {
          path: '/overview-teacher',
          name: 'overview-teacher',
          component: OverviewPage,
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
          component: StudentResult,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/attendance',
          name: 'attendance',
          component: StudentAttendance,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/subjects',
          name: 'subjects',
          component: SubjectsPage,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/issues',
          name: 'issues',
          component: IssuesPage,
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
