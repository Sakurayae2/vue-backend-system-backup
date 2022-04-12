import request from '@/utils/request'

// 获取banner
export function getBanner(params) {
  return request({
    url: '/api/pwapi/manage/banner/details',
    methods: 'get',
    params
  })
}

// 添加banner
export function addB(params) {
  return request({
    url: '/api/pwapi/manage/banner/newbanner',
    methods: 'get',
    params
  })
}

// 更新banner
export function updateB(params) {
  return request({
    url: '/api/pwapi/manage/banner/oldbanner',
    methods: 'get',
    params
  })
}

// 删除banner指定分类
export function deleteBType(params) {
  return request({
    url: '/api/pwapi/manage/banner/badtype',
    method: 'get',
    params
  })
}

// 删除banner
export function deleteB(params) {
  return request({
    url: '/api/pwapi/manage/banner/badbanner',
    methods: 'get',
    params
  })
}

// 更新sort
export function updateSt(params) {
  return request({
    url: '/api/pwapi/manage/banner/typeweight',
    methods: 'get',
    params
  })
}

// 上传图片
export function uploadImg(params) {
  return request({
    url: '/api/pwapi/user/image/banner/tourl',
    methods: 'post',
    params
  })
}
