import Layout from '@/layout'

const router = [
  {
    path: '/ranking',
    component: Layout,
    redirect: '/award/list',
    name: 'ranking',
    alwaysShow: true,
    meta: { title: '排行榜', icon: 'ranking' },
    children: [
      {
        path: '/echart',
        name: 'Echart',
        component: () => import('@/views/ranking/echart'),
        meta: { title: '排行图表', icon: 'echarts' }
      },
      {
        path: '/ranklist',
        name: 'Ranklist',
        component: () => import('@/views/ranking/index'),
        meta: { title: '排行列表', icon: 'list' }
      }
    ]
  }

]

export default router
