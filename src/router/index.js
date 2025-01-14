import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // default to story view
      redirect: { name: 'story' },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/story',
      name: 'story',
      component: () => import('../views/StoryView.vue'),
    },
    {
      path: '/dictation',
      name: 'dictation',
      component: () => import('../views/DictationView.vue'),
    },
  ],
})

export default router
