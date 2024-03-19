import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/layout'

Vue.use(Router)

const router = new Router({
  mode: 'history', //去掉#号
  routes: [{
      path: '/',
      name: 'login',
      component: () => import('./views/login')
    },
    {
      path: '/Home',
      name: 'Home',
      component: Layout,
      children: [{ // 账号管理
          path: 'auth/auth-user',
          name: 'auth-user',
          component: () => import(`./components/auth/auth-user`)
        },{ // 角色管理
          path: 'auth/auth-role',
          name: 'auth-role',
          component: () => import(`./components/auth/auth-role`)
        },{ // 修改密码
          path: 'user/edit-password',
          name: 'edit-password',
          component: () => import(`./components/user/edit-password`)
        },{ // 查看个人信息
          path: 'user/user-info',
          name: 'user-info',
          component: () => import(`./components/user/user-info`)
        },
        { // 首页
          path: 'home-page/home-page',
          name: 'home-page',
          component: () => import(`./components/home-page/home-page`)
        }// ========================== start ======================
      ]
    }
  ]
})
//路由拦截
router.beforeEach((to, from, next) => {
  // console.log("youxiangshijain:",expireTime);
  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
    if (localStorage.getItem("expireTime")-(new Date()).getTime()>0) {// 判断当前的token是否存在
      next()
    } else {// 没登录则跳转到登录界面
      alert("您当前的会话已超时，请重新登录！");
      // this.$warning({
			// 	title: '错误提示',
			// 	content: '您当前的会话已超时，请重新登录！',
			// 	okText: '确认',
			// });
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})
export default router
