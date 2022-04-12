import request from '@/utils/request'
import { baseurl } from '@/settings'
// const baseurl = 'http://192.168.2.122:19100'

// 封锁列表
export function getComplaintList(data) {
  return request({
    url: '/api/pwapi/manage/complaint/list',
    baseURL: baseurl,
    method: 'post',
    data
  })
}

export function rejectApply(data) {
  return request({
    url: '/api/pwapi/manage/complaint/done',
    baseURL: baseurl,
    method: 'post',
    data
  })
}

export function userBlock(data) {
  return request({
    url: '/api/pwapi/user/block',
    baseURL: baseurl,
    method: 'post',
    data
  })
}

export function userUnblock(data) {
  return request({
    url: '/api/pwapi/user/unblock',
    baseURL: baseurl,
    method: 'post',
    data
  })
}

export function getInfoList(params) {
  return request({
    url: '/api/pwapi/manage/user/info',
    baseURL: baseurl,
    method: 'get',
    params
  })
}

export function getRelationList(params) {
  return request({
    url: '/api/pwapi/manage/user/relation',
    baseURL: baseurl,
    method: 'get',
    params
  })
}

export function getManag(data) {
  return request({
    url: '/api/pwapi/manage/backsage_manag/index',
    baseURL: baseurl,
    method: 'post',
    data
  })
}

export function getBlockCount(data) {
  return request({
    url: '/api/pwapi/manage/block/times',
    baseURL: baseurl,
    method: 'post',
    data
  })
}

