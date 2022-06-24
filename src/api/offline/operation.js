import request from '@/utils/request'

// 查询线下激活开通记录列表
export function listOperation(query) {
  return request({
    url: '/eycode/operation/list',
    method: 'get',
    params: query
  })
}

// 查询线下激活开通记录详细
export function getOperation(operationId) {
  return request({
    url: '/eycode/operation/' + operationId,
    method: 'get'
  })
}

// 新增线下激活开通记录
export function addOperation(data) {
  return request({
    url: '/eycode/operation',
    method: 'post',
    data: data
  })
}

// 修改线下激活开通记录
export function updateOperation(data) {
  return request({
    url: '/eycode/operation',
    method: 'put',
    data: data
  })
}

// 删除线下激活开通记录
export function delOperation(operationId) {
  return request({
    url: '/eycode/operation/' + operationId,
    method: 'delete'
  })
}

// 导出线下激活开通记录
export function exportOperation(query) {
  return request({
    url: '/eycode/operation/export',
    method: 'get',
    params: query
  })
}