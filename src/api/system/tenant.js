import request from '@/utils/request'

// 查询租户信息列表
export function listTenant(query) {
  return request({
    url: '/system/tenant/list',
    method: 'get',
    params: query
  })
}

// 查询租户信息详细
export function getTenant(id) {
  return request({
    url: '/system/tenant/' + id,
    method: 'get'
  })
}

// 新增租户信息
export function addTenant(data) {
  return request({
    url: '/system/tenant',
    method: 'post',
    data: data
  })
}

// 修改租户信息
export function updateTenant(data) {
  return request({
    url: '/system/tenant',
    method: 'put',
    data: data
  })
}

// 修改租户信息
export function bindTenant(data) {
  return request({
    url: '/system/bindTenant',
    method: 'put',
    data: data
  })
}

// 删除租户信息
export function delTenant(id) {
  return request({
    url: '/system/tenant/' + id,
    method: 'delete'
  })
}

// 导出租户信息
export function exportTenant(query) {
  return request({
    url: '/system/tenant/export',
    method: 'get',
    params: query
  })
}

// 查询租户角色列表
export function listTenantRole(query) {
  return request({
    url: '/system/tenant/roleList',
    method: 'get',
    params: query
  })
}

// 查询租户角色详细
export function getTenantRole(roleId) {
  return request({
    url: '/system/tenant/role/' + roleId,
    method: 'get'
  })
}

// 修改租户角色
export function updateTenantRole(data) {
  return request({
    url: '/system/tenant/role',
    method: 'put',
    data: data
  })
}

// 修改租户角色
export function tenantSync(data) {
  return request({
    url: '/system/tenant/resource/sync',
    method: 'post',
    data: data
  })
}
