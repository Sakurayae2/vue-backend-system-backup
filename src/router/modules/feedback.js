import Layout from '@/layout'

const router = [
  {
    path: '/feedbackManagement',
    component: Layout,
    redirect: '/feedback/feedback',
    name: 'feedbackManagement',
    alwaysShow: true,
    meta: { title: '反馈管理', icon: 'feedback' },
    children: [
      {
        path: '/feedback',
        name: 'feedbackList',
        component: () => import('@/views/feedback/feedback'),
        meta: { title: '反馈列表', icon: 'list' }
      }
    ]
  }
]

export default router
