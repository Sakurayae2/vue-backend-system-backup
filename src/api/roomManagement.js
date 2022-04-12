import request from '@/utils/request'
// import { baseurl } from '@/settings'
// const baseurl = 'http://192.168.2.141:19100'

// 房间截图
export function getRoomImg(params) {
  return request({
    url: '/api/pwapi/manage/backend/userpic',
    // baseURL: baseurl,
    method: 'get',
    params
  })
}

