import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { navItems } from '@/config/navigation'
import { APP_NAME } from '@/config/brand'

const pages = {
  dashboard: () => import('@/pages/DashboardPage.vue'),
  appointments: () => import('@/pages/AppointmentsPage.vue'),
  patients: () => import('@/pages/PatientsPage.vue'),
  doctors: () => import('@/pages/DoctorsPage.vue'),
  reports: () => import('@/pages/ReportsPage.vue'),
  departments: () => import('@/pages/DepartmentsPage.vue'),
  schedules: () => import('@/pages/SchedulesPage.vue'),
  payments: () => import('@/pages/PaymentsPage.vue'),
  beds: () => import('@/pages/BedsPage.vue')
}
const Placeholder = () => import('@/pages/PlaceholderPage.vue')

// App routes are generated from the sidebar config so the two never drift apart.
const appRoutes = [
  ...navItems.map((item) => ({
    path: item.to.slice(1),
    component: pages[item.page] ?? Placeholder,
    meta: { title: item.title, icon: item.icon, description: item.description }
  })),
  { path: 'patients/:id', component: () => import('@/pages/PatientDetailPage.vue'), meta: { title: 'Patient record' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: AppLayout, children: appRoutes },
    { path: '/login', component: () => import('@/pages/LoginPage.vue'), meta: { title: 'Sign in' } },
    { path: '/signup', component: () => import('@/pages/SignupPage.vue'), meta: { title: 'Create account' } },
    { path: '/home', redirect: '/' },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${APP_NAME}` : APP_NAME
})

export default router
