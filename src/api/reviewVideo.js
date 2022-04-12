import request from '@/utils/request'

// import { baseurl } from '@/settings'
// const baseurl = 'http://192.168.2.163:19100'

// 搜索
export function SearchVideo(params) {
  return request({
    url: '/api/pwapi/manage/user/dance/detail',
    method: 'get',
    params
  })
}

// 选择列表
export function Choose(params) {
  return request({
    url: '/api/pwapi/manage/user/dance/details',
    // baseURL: baseurl,
    method: 'get',
    params
  })
}

// 操作
export function Option(params) {
  return request({
    url: '/api/pwapi/manage/user/dance/status',
    method: 'get',
    params
  })
}

// 标签
export function getTag(params) {
  return request({
    url: '/api/pwapi/manage/user/dance/tag',
    method: 'get',
    params
  })
}
