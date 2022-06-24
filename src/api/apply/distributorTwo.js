import request from '@/utils/request'

// 查询分销商(二级)列表
export function listDistributorTwo(query) {
  return request({
    url: '/apply/distributorTwo/list',
    method: 'get',
    params: query
  })
}

// 查询分销商(二级)详细
export function getDistributorTwo(distributorId) {
  return request({
    url: '/apply/distributorTwo/' + distributorId,
    method: 'get'
  })
}

// 新增分销商(二级)
export function addDistributorTwo(data) {
  return request({
    url: '/apply/distributorTwo',
    method: 'post',
    data: data
  })
}

// 修改分销商(二级)
export function updateDistributorTwo(data) {
  return request({
    url: '/apply/distributorTwo',
    method: 'put',
    data: data
  })
}

// 删除分销商(二级)
export function delDistributorTwo(distributorId) {
  return request({
    url: '/apply/distributorTwo/' + distributorId,
    method: 'delete'
  })
}

// 导出分销商(二级)
export function exportDistributorTwo(query) {
  return request({
    url: '/apply/distributorTwo/export',
    method: 'get',
    params: query
  })
}
export function updateStatus(data) {
  return request({
    url: '/apply/distributorTwo/updateStatus',
    method: 'put',
    data: data
  })
}
