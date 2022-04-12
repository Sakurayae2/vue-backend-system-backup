import Layout from '@/layout'

const router = [
  {
    path: '/userManagement',
    component: Layout,
    redirect: '/user/user',
    name: 'userMessage',
    alwaysShow: true,
    meta: { title: '用户管理', icon: 'userManagement' },
    children: [
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '用户资料', icon: 'user-info' }
      },
      {
        path: '/block',
        name: 'Block',
        component: () => import('@/views/user/block'),
        meta: { title: '封锁列表', icon: 'deblocking' }
      }
    ]
  },

  {
    path: '/permissionManagement',
    component: Layout,
    redirect: '/permission/role',
    name: 'permissionManagement',
    meta: { title: '权限管理', icon: 'permissionManagement' },
    children: [
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/permission/user'),
        meta: { title: '用户列表', icon: 'user' }
      },
      {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/permission/role'),
        meta: { title: '角色列表', icon: 'peoples' }
      },
      {
        path: '/permission',
        name: 'Permission',
        component: () => import('@/views/permission/permission'),
        meta: { title: '权限列表', icon: 'lock' }
      },
      {
        path: '/menu',
        name: 'Menu',
        component: () => import('@/views/permission/menu'),
        meta: { title: '菜单列表', icon: 'tree' }
      }
    ]
  }
]

export default router
