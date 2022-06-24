import request from '@/utils/request'

// 查询主页栏目列表
export function listColumn(query) {
  return request({
    url: '/cms/indexColumn/list',
    method: 'get',
    params: query
  })
}

// 查询主页栏目详细
export function getColumn(indexColumnId) {
  return request({
    url: '/cms/indexColumn/' + indexColumnId,
    method: 'get'
  })
}

// 新增主页栏目
export function addColumn(data) {
  return request({
    url: '/cms/indexColumn',
    method: 'post',
    data: data
  })
}

// 修改主页栏目
export function updateColumn(data) {
  return request({
    url: '/cms/indexColumn',
    method: 'put',
    data: data
  })
}

// 删除主页栏目
export function delColumn(indexColumnId) {
  return request({
    url: '/cms/indexColumn/' + indexColumnId,
    method: 'delete'
  })
}

// 导出主页栏目
export function exportColumn(query) {
  return request({
    url: '/cms/indexColumn/export',
    method: 'get',
    params: query
  })
}
