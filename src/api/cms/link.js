import request from '@/utils/request'

// 查询友情链接栏目列表
export function listLink(query) {
  return request({
    url: '/cms/link/list',
    method: 'get',
    params: query
  })
}

// 查询友情链接栏目详细
export function getLink(indexLinkId) {
  return request({
    url: '/cms/link/' + indexLinkId,
    method: 'get'
  })
}

// 新增友情链接栏目
export function addLink(data) {
  return request({
    url: '/cms/link',
    method: 'post',
    data: data
  })
}

// 修改友情链接栏目
export function updateLink(data) {
  return request({
    url: '/cms/link',
    method: 'put',
    data: data
  })
}

// 删除友情链接栏目
export function delLink(indexLinkId) {
  return request({
    url: '/cms/link/' + indexLinkId,
    method: 'delete'
  })
}

// 导出友情链接栏目
export function exportLink(query) {
  return request({
    url: '/cms/link/export',
    method: 'get',
    params: query
  })
}