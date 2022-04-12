import request from '@/utils/request'

// 获取列表数据
export function getTable(params) {
  return request({
    url: '/api/pwapi/manage/user/compare/rank',
    method: 'get',
    params
  })
}

// 审核新旧人
export function getReview(params) {
  return request({
    url: 'api/pwapi/manage/update/twouser/comparescore',
    method: 'get',
    params
  })
}

// 获取人脸图片
export function getFace(params) {
  return request({
    url: '/api/pwapi/manage/user/images',
    method: 'get',
    params
  })
}

