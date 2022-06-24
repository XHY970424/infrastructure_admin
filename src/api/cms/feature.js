import request from '@/utils/request'

// 查询首页平台特色列表
export function listFeature(query) {
  return request({
    url: '/cms/feature/list',
    method: 'get',
    params: query
  })
}

// 查询首页平台特色详细
export function getFeature(indexFeatureId) {
  return request({
    url: '/cms/feature/' + indexFeatureId,
    method: 'get'
  })
}

// 新增首页平台特色
export function addFeature(data) {
  return request({
    url: '/cms/feature',
    method: 'post',
    data: data
  })
}

// 修改首页平台特色
export function updateFeature(data) {
  return request({
    url: '/cms/feature',
    method: 'put',
    data: data
  })
}

// 删除首页平台特色
export function delFeature(indexFeatureId) {
  return request({
    url: '/cms/feature/' + indexFeatureId,
    method: 'delete'
  })
}

// 导出首页平台特色
export function exportFeature(query) {
  return request({
    url: '/cms/feature/export',
    method: 'get',
    params: query
  })
}