import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Users from '@/components/users/Users.vue'
import Rights from '@/components/rights/Rights.vue'
import Roles from '@/components/rights/Roles.vue'
import Categories from '@/components/products/Categories.vue'
import Goods from '@/components/products/Goods.vue'
import GoodsAdd from '@/components/products/Goods-add.vue'
import Params from '@/components/products/Params.vue'
import Orders from '@/components/orders/Orders.vue'
import Report from '@/components/statistics/Report.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      /* //当地址为/的时候重定向到login页面 */
      path: '/',
      redirect: '/login'
    },
    {
      /* //login路由 */
      path: '/login',
      component: Login
    },
    {
      /* //home路由 */
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        },
        // rights路由
        {
          path: '/rights',
          component: Rights
        },
        // Roles
        {
          path: '/roles',
          component: Roles
        },
        // categories
        {
          path: '/categories',
          component: Categories
        },
        // Goods
        {
          path: '/goods',
          component: Goods
        },
        // Goods_add
        {
          path: '/goods-add',
          component: GoodsAdd
        },
        // Params
        {
          path: '/params',
          component: Params
        },
        //  orders
        {
          path: '/orders',
          component: Orders
        },
        //  orders
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

// 创建路由守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('myToken')
  // 当去往login地址的时候不需要token
  // 当有token的时候就可以去其他页面
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
