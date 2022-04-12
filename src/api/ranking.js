import request from '@/utils/request'

const thisBaseURL = 'http://192.168.2.141:19100'

// 反馈列表
export function getRankList(params) {
  return request({
    // url: '/api/pwapi/manage/backend/data/list',
    baseURL: thisBaseURL + '/api/pwapi/manage/backend/data/list',
    method: 'get',
    params
  })
}

export function sendMessage(data) {
  return request({
    // url: '/api/pwapi/manage/backend/feedback/base',
    baseURL: thisBaseURL + '/api/pwapi/manage/backend/feedback/base',
    method: 'post',
    data
  })
}
