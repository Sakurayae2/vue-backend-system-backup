import request from '@/utils/request'

export function getRole() {
  return request({
    url: '/api/dwapi/system/role/',
    method: 'get'
  })
}

export function getRoleID(id) {
  return request({
    url: '/api/dwapi/system/role/' + id + '/',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/api/dwapi/system/role/',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/api/dwapi/system/role/' + id + '/',
    method: 'delete'
  })
}

export function editRole(id, data) {
  return request({
    url: '/api/dwapi/system/role/' + id + '/',
    method: 'patch',
    data
  })
}
