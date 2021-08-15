import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
const Login = () => import('../components/Login.vue')
// import Home from '../components/Home'
const Home = () => import('../components/Home.vue')
// import Welcome from '../components/Welcome'
const Welcome = () => import('../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
const Users = () => import('../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import( '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import('../components/power/Roles.vue')
// import Cate from '../components/goods/Cate.vue'
const Cate = () => import( '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import('../components/goods/Params.vue')
// import GoodsList from '../components/goods/List.vue'
const GoodsList = () => import('../components/goods/List.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import('../components/goods/Add.vue')
// import Order from '../components/order/Order.vue'
const Order = () =>  import('../components/order/Order.vue')
// import Report from '../components/report/Report.vue'
const Report = () =>  import('../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径,from代表从哪个路径来,next表示放行
  // 两种方式  1.next()  2.next('/login')
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
