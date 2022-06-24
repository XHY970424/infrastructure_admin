import request from '@/utils/request'

// 查询顶部导航菜单列表
export function listTopNav(query) {
  return request({
    url: '/cms/topNav/list',
    method: 'get',
    params: query
  })
}

// 查询顶部导航菜单详细
export function getTopNav(indexTopNavId) {
  return request({
    url: '/cms/topNav/' + indexTopNavId,
    method: 'get'
  })
}

// 新增顶部导航菜单
export function addTopNav(data) {
  return request({
    url: '/cms/topNav',
    method: 'post',
    data: data
  })
}

// 修改顶部导航菜单
export function updateTopNav(data) {
  return request({
    url: '/cms/topNav',
    method: 'put',
    data: data
  })
}
// 修改顶部导航菜单
export function updateTopNavStatus(data) {
  return request({
    url: '/cms/topNav/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除顶部导航菜单
export function delTopNav(indexTopNavId) {
  return request({
    url: '/cms/topNav/' + indexTopNavId,
    method: 'delete'
  })
}

// 导出顶部导航菜单
export function exportTopNav(query) {
  return request({
    url: '/cms/topNav/export',
    method: 'get',
    params: query
  })
}
