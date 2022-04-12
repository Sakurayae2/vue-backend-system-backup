import Layout from '@/layout'

const router = [
  {
    path: '/roomManagement',
    component: Layout,
    redirect: '/room/feedback',
    name: 'roomManagement',
    alwaysShow: true,
    meta: { title: '房间管理', icon: 'room' },
    children: [
      {
        path: '/screenshot',
        name: 'screenshot',
        component: () => import('@/views/room/screenshot'),
        meta: { title: '房间截图', icon: 'list' }
      },

      {
        path: '/reviewVideo',
        name: 'reviewVideo',
        component: () => import('@/views/room/reveiwVideo'),
        meta: { title: '舞曲审核', icon: 'list' }
      },

      {
        path: '/reviewPerson',
        name: 'reviewPerson',
        // alwaysShow: true,
        component: () => import('@/components/RouterView'),
        meta: { title: '师徒人脸', icon: 'list' },
        children: [
          {
            path: '/avator',
            name: 'avator',
            component: () => import('@/views/room/reviewPerson/avator'),
            meta: { title: 'avator', icon: 'list' },
            hidden: true
          },
          {
            path: '/review',
            name: 'review',
            component: () => import('@/views/room/reviewPerson/review'),
            meta: { title: '师徒人脸', icon: 'list' }
          }
        ]
      },

      {
        path: '/banner',
        name: 'banner',
        component: () => import('@/views/room/banner'),
        meta: { title: 'banner', icon: 'list' }
      }

    ]
  }
]

export default router
