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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LogIn,
      meta: {
        requiresAuth: false
      }
    },

    // Teacher Dashboard
    {
      path: '/index-teacher',
      name: 'index-teacher',
      component: TeachesLayout,
      redireact: '/overview-teacher',
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
        }
      ]
    }
  ]
})

export default router
