import Layout from '@/layout'

const router = [
  {
    path: '/award',
    component: Layout,
    redirect: '/award/list',
    name: 'awardMessage',
    alwaysShow: true,
    meta: { title: '奖励管理', icon: 'award' },
    children: [
      {
        path: '/list',
        name: 'List',
        component: () => import('@/views/award/list'),
        meta: { title: '奖励列表', icon: 'list' }
      },
      {
        path: '/cancel',
        name: 'Cancel',
        component: () => import('@/views/award/cancel'),
        meta: { title: '取消奖励', icon: 'cancel' }
      },
      {
        path: '/testList',
        name: 'TestList',
        component: () => import('@/views/award/testlist'),
        meta: { title: '测试用户', icon: 'testList' }
      },
      {
        path: '/handout',
        name: 'handout',
        component: () => import('@/views/award/handout'),
        meta: { title: '奖励发放', icon: 'testList' }
      },
      {
        path: '/punish',
        name: 'punish',
        component: () => import('@/views/award/punish'),
        meta: { title: '惩罚处理', icon: 'punish' }
      },
      {
        path: '/deblocking',
        name: 'deblocking',
        component: () => import('@/views/award/deblocking'),
        meta: { title: '解封处理', icon: 'deblocking' }
      },
      {
        path: '/officialUser',
        name: 'officialUser',
        component: () => import('@/views/award/officialUser'),
        meta: { title: '官方认定', icon: 'deblocking' }
      },
      {
        path: '/share',
        name: 'share',
        component: () => import('@/views/award/share'),
        meta: { title: '分享展示', icon: 'share' }
      }
    ]
  }

]

export default router
