import request from '@/utils/request'

// 查询新基建栏目数据列表
export function listNewconstruction(query) {
  return request({
    url: '/cms/newconstruction/list',
    method: 'get',
    params: query
  })
}

// 查询新基建栏目数据详细
export function getNewconstruction(indexConstructionId) {
  return request({
    url: '/cms/newconstruction/' + indexConstructionId,
    method: 'get'
  })
}

// 新增新基建栏目数据
export function addNewconstruction(data) {
  return request({
    url: '/cms/newconstruction',
    method: 'post',
    data: data
  })
}

// 修改新基建栏目数据
export function updateNewconstruction(data) {
  return request({
    url: '/cms/newconstruction',
    method: 'put',
    data: data
  })
}

// 删除新基建栏目数据
export function delNewconstruction(indexConstructionId) {
  return request({
    url: '/cms/newconstruction/' + indexConstructionId,
    method: 'delete'
  })
}

// 导出新基建栏目数据
export function exportNewconstruction(query) {
  return request({
    url: '/cms/newconstruction/export',
    method: 'get',
    params: query
  })
}

/**
 * 获取新基建课程分类
 */
export function getCategory() {
  return request({
    url: '/cms/newconstruction/getCategory',
    method: 'get'
  })
}

/**
 * 获取新基建课程
 */
export function getSubject(query) {
  return request({
    url: '/cms/newconstruction/getSubject',
    method: 'post',
    data: query
  })
}
