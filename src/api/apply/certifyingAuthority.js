import request from '@/utils/request'

// 查询发证机构列表
export function listCertifyingAuthority(query) {
  return request({
    url: '/apply/certifyingAuthority/list',
    method: 'get',
    params: query
  })
}

// 查询发证机构详细
export function getCertifyingAuthority(authorityId) {
  return request({
    url: '/apply/certifyingAuthority/' + authorityId,
    method: 'get'
  })
}

// 新增发证机构
export function addCertifyingAuthority(data) {
  return request({
    url: '/apply/certifyingAuthority',
    method: 'post',
    data: data
  })
}

// 修改发证机构
export function updateCertifyingAuthority(data) {
  return request({
    url: '/apply/certifyingAuthority',
    method: 'put',
    data: data
  })
}

// 删除发证机构
export function delCertifyingAuthority(authorityId) {
  return request({
    url: '/apply/certifyingAuthority/' + authorityId,
    method: 'delete'
  })
}

// 发证机构状态变更
export function updateStatus(data) {
  return request({
    url: '/apply/certifyingAuthority/updateStatus',
    method: 'put',
    data: data
  })
}

// 导出发证机构
export function exportCertifyingAuthority(query) {
  return request({
    url: '/apply/certifyingAuthority/export',
    method: 'get',
    params: query
  })
}