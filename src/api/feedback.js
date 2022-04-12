import request from '@/utils/request'

import { baseurl } from '@/settings'
// const baseurl = 'http://192.168.2.141:19100'

// 反馈列表
export function getReadList(params) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/base',
    method: 'get',
    params
  })
}

export function sendMessage(data) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/base',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function getChatHistory(params) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/modify',
    method: 'get',
    params
  })
}

export function chatReaded(data) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/modify',
    method: 'post',
    data
  })
}

export function searchReadList(params) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/search',
    method: 'get',
    params
  })
}

export function starState(data) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/search',
    method: 'post',
    data
  })
}

export function reply(params) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/reply',
    method: 'get',
    params
  })
}

export function addReply(data) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/reply',
    method: 'post',
    data
  })
}

export function deleteReply(data) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/reply',
    method: 'post',
    data
  })
}

export function auto(params) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/auto',
    method: 'get',
    params
  })
}

export function amendAtuo(data) {
  return request({
    baseURL: baseurl,
    url: '/api/pwapi/manage/backend/feedback/auto',
    method: 'post',
    data
  })
}
