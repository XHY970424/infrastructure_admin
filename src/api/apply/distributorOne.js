import request from '@/utils/request'

// 查询分销商(一级)列表
export function listDistributorOne(query) {
  return request({
    url: '/apply/distributorOne/list',
    method: 'get',
    params: query
  })
}

// 查询分销商(一级)详细
export function getDistributorOne(distributorId) {
  return request({
    url: '/apply/distributorOne/' + distributorId,
    method: 'get'
  })
}

// 新增分销商(一级)
export function addDistributorOne(data) {
  return request({
    url: '/apply/distributorOne',
    method: 'post',
    data: data
  })
}

// 修改分销商(一级)
export function updateDistributorOne(data) {
  return request({
    url: '/apply/distributorOne',
    method: 'put',
    data: data
  })
}

// 删除分销商(一级)
export function delDistributorOne(distributorId) {
  return request({
    url: '/apply/distributorOne/' + distributorId,
    method: 'delete'
  })
}

// 导出分销商(一级)
export function exportDistributorOne(query) {
  return request({
    url: '/apply/distributorOne/export',
    method: 'get',
    params: query
  })
}
export function updateStatus(data) {
  return request({
    url: '/apply/distributorOne/updateStatus',
    method: 'put',
    data: data
  })
}

// 根据等级查询分销商列表
export function distributorList(query) {
  return request({
    url: '/apply/distributorOne/distributorList',
    method: 'get',
    params: query
  })
}
