import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/dwapi/system/login/',
    method: 'post',
    data
  })
}

// export function login(data) {
//   return request({
//     url: '/api/dwapi/login/',
//     method: 'post',
//     data
//   })
// }

export function getCaptcha(data) {
  return request({
    url: '/api/dwapi/system/captcha/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/dwapi/system/user/',
    method: 'get',
    params: { info: true }
  })
}

export function get_menu() {
  return request({
    url: '/api/dwapi/system/menu/',
    method: 'get',
    params: { info: true }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// 获取用户
export function getUser(params) {
  return request({
    url: '/api/dwapi/system/user/',
    method: 'get',
    params
  })
}

export function getUserID(id) {
  return request({
    url: '/api/dwapi/system/user/' + id + '/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/dwapi/system/user/',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/api/dwapi/system/user/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: '/api/dwapi/system/user/' + id + '/',
    method: 'patch',
    data
  })
}
