import request from '@/utils/request'

export function getPermission(params) {
  return request({
    url: '/api/dwapi/system/permission/',
    method: 'get',
    params
  })
}

export function getPermissionID(id) {
  return request({
    url: '/api/dwapi/system/permission/' + id + '/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/api/dwapi/system/permission/',
    method: 'post',
    data
  })
}

export function deletePer(id) {
  return request({
    url: '/api/dwapi/system/permission/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: '/api/dwapi/system/permission/' + id + '/',
    method: 'patch',
    data
  })
}

export function getmenu(params) {
  return request({
    url: '/api/dwapi/system/menu/',
    method: 'get',
    params
  })
}

export function deletemenu(id) {
  return request({
    url: '/api/dwapi/system/menu/' + id + '/',
    method: 'delete'
  })
}

export function editmenu(id, data) {
  return request({
    url: '/api/dwapi/system/menu/' + id + '/',
    method: 'patch',
    data
  })
}

export function addmenu(data) {
  return request({
    url: '/api/dwapi/system/menu/',
    method: 'post',
    data
  })
}
