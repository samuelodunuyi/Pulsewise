import { createRouter, createWebHistory } from 'vue-router'
import { useCookies } from "vue3-cookies";
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

const { cookies } = useCookies()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === from.name) {
    return next()
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const jwt = cookies.get("jwt")
    // Change back to !== null later
    if (jwt == null) {
      next({ path: "/" })
    }
    else {
      next()
    }
  }
  else {
    next()
  }
})


export default router
