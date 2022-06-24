import request from '@/utils/request'

// 查询自定义推广页列表
export function listCustompage(query) {
  return request({
    url: '/eycode/custompage/list',
    method: 'get',
    params: query
  })
}

// 查询自定义推广页详细
export function getCustompage(customPageId) {
  return request({
    url: '/eycode/custompage/' + customPageId,
    method: 'get'
  })
}

// 新增自定义推广页
export function addCustompage(data) {
  return request({
    url: '/eycode/custompage',
    method: 'post',
    data: data
  })
}

// 修改自定义推广页
export function updateCustompage(data) {
  return request({
    url: '/eycode/custompage',
    method: 'put',
    data: data
  })
}

// 删除自定义推广页
export function delCustompage(customPageId) {
  return request({
    url: '/eycode/custompage/' + customPageId,
    method: 'delete'
  })
}

// 导出自定义推广页
export function exportCustompage(query) {
  return request({
    url: '/eycode/custompage/export',
    method: 'get',
    params: query
  })
}

// 查询自定义推广页详细
export function getRouteConfig() {
  return request({
    url: '/eycode/custompage/getRouteConfig',
    method: 'get'
  })
}
