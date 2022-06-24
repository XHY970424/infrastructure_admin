import request from '@/utils/request'

// 查询首页图标导航列表
export function listIconNav(query) {
  return request({
    url: '/cms/iconNav/list',
    method: 'get',
    params: query
  })
}

// 查询首页图标导航详细
export function getIconNav(indexIconNavId) {
  return request({
    url: '/cms/iconNav/' + indexIconNavId,
    method: 'get'
  })
}

// 新增首页图标导航
export function addIconNav(data) {
  return request({
    url: '/cms/iconNav',
    method: 'post',
    data: data
  })
}

// 修改首页图标导航
export function updateIconNav(data) {
  return request({
    url: '/cms/iconNav',
    method: 'put',
    data: data
  })
}

// 删除首页图标导航
export function delIconNav(indexIconNavId) {
  return request({
    url: '/cms/iconNav/' + indexIconNavId,
    method: 'delete'
  })
}

// 导出首页图标导航
export function exportIconNav(query) {
  return request({
    url: '/cms/iconNav/export',
    method: 'get',
    params: query
  })
}
