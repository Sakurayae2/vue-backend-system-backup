import request from '@/utils/request'

// import { baseurl } from '@/settings'
// const baseurl = 'http://192.168.2.141:19100'
// const baseurl = 'http://localhost:9000/API'

// 奖励列表
export function getAward(params) {
  return request({
    url: '/api/pwapi/active/anysing/backend',
    method: 'get',
    params
  })
}

export function editAward(data) {
  return request({
    url: '/api/pwapi/active/anysing/backend',
    method: 'post',
    data
  })
}

export function getCancel(params) {
  return request({
    url: '/api/pwapi/active/backend/cancelaward',
    method: 'get',
    params
  })
}

// 取消奖励
export function cancelAwa(data) {
  return request({
    url: '/api/pwapi/active/backend/cancelaward',
    method: 'post',
    data
  })
}

// 发送私信
export function sendLetter(data) {
  return request({
    url: '/api/pwapi/active/backend?pid=1',
    method: 'post',
    data
  })
}

// 测试用户
export function getTest(params) {
  return request({
    url: '/api/pwapi/active/backend/dancetest',
    method: 'get',
    params
  })
}

export function addTest(data) {
  return request({
    url: '/api/pwapi/active/backend/dancetest',
    method: 'post',
    data
  })
}

export function deleteTest(data) {
  return request({
    url: '/api/pwapi/active/backend/dance/errormember',
    method: 'post',
    data
  })
}

export function handout(data) {
  return request({
    url: '/api/pwapi/manage/backend/awardsend',
    method: 'post',
    data
  })
}

// 惩罚处理
export function getPunish(params) {
  return request({
    url: '/api/pwapi/manage/backend/singpunish',
    // baseURL: 'http://192.168.2.141:19100/api/pwapi/manage/backend/singpunish',
    method: 'get',
    params
  })
}

export function addPunish(data) {
  return request({
    url: '/api/pwapi/manage/backend/singpunish',
    // baseURL: 'http://192.168.2.141:19100/api/pwapi/manage/backend/singpunish',
    method: 'post',
    data
  })
}

export function removePunish(data) {
  return request({
    url: '/api/pwapi/manage/backend/delpunish',
    // baseURL: 'http://192.168.2.141:19100/api/pwapi/manage/backend/delpunish',
    method: 'post',
    data
  })
}

// 申请解封
export function getDeblockingList(data) {
  return request({
    url: '/api/pwapi/manage/complaint/list',
    // baseURL: 'http://192.168.2.135:19100/api/pwapi/manage/complaint/list',
    method: 'post',
    data
  })
}

export function doneDeblocking(data) {
  return request({
    url: '/api/pwapi/manage/complaint/done',
    // baseURL: 'http://192.168.2.135:19100/api/pwapi/manage/complaint/done',
    method: 'post',
    data
  })
}

export function unblock(data) {
  return request({
    url: '/api/pwapi/user/unblock',
    // baseURL: 'http://192.168.2.135:19100/api/pwapi/user/unblock',
    method: 'post',
    data
  })
}

// 官方认定用户
export function getOfficialUser(params) {
  return request({
    url: '/api/pwapi/active/sing/goodsingerlist',
    // baseURL: 'http://192.168.2.141:19100/api/pwapi/active/sing/goodsingerlist',
    method: 'get',
    params
  })
}

export function addOfficialUser(data) {
  return request({
    url: '/api/pwapi/active/sing/goodsingerlist',
    // baseURL: 'http://192.168.2.141:19100/api/pwapi/active/sing/goodsingerlist',
    method: 'post',
    data
  })
}

export function removeOfficialUser(data) {
  return request({
    url: '/api/pwapi/active/sing/goodsinger',
    // baseURL: 'http://192.168.2.141:19100/api/pwapi/active/sing/goodsinger',
    method: 'post',
    data
  })
}

// 分享后台
export function getShare(params) {
  return request({
    url: '/api/pwapi/manage/backend/share/experimentdata',
    // baseURL: baseurl,
    method: 'get',
    params
  })
}

export function getShareLink(params) {
  return request({
    url: '/api/pwapi/manage/backend/share/experiment',
    // baseURL: baseurl,
    method: 'get',
    params
  })
}

export function createShare(data) {
  return request({
    url: '/api/pwapi/manage/backend/share/experiment',
    // baseURL: baseurl,
    method: 'post',
    data
  })
}

export function editOrDeleteShare(data) {
  return request({
    url: '/api/pwapi/manage/backend/share/experimentinfo',
    // baseURL: baseurl,
    method: 'post',
    data
  })
}

export function exportShare(data) {
  return request({
    url: '/api/pwapi/manage/backend/share/experimentdata',
    // baseURL: baseurl,
    method: 'post',
    data
  })
}

