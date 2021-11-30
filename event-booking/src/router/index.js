import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const AddEvent  = () => import(/* webpackChunkName: "ad7dEvent" */ '../components/eventbook/addEventBook.vue')
const EventBook = () => import(/* webpackChunkName: "ad7dEvent" */ '../components/eventbook/eventBooking.vue')

const routes = [
  {
    path:'/',
    name:'EventBook',
    component : EventBook
  },
  {
    path:'/addEvent',
    name:'AddEvent',
    component: AddEvent,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
