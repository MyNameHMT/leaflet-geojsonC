import Home from '../views/Home.vue'
import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router