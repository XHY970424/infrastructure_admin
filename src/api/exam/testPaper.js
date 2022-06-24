import request from '@/utils/request'

// 查询专题分类列表
export function listPaperClassification(query) {
  return request({
    url: '/eycode/paperClassification/list',
    method: 'get',
    params: query
  })
}

// 查询专题分类详细
export function getPaperClassification(id) {
  return request({
    url: '/eycode/paperClassification/' + id,
    method: 'get'
  })
}

// 新增专题分类
export function addPaperClassification(data) {
  return request({
    url: '/eycode/paperClassification',
    method: 'post',
    data: data
  })
}

// 修改专题分类
export function updatePaperClassification(data) {
  return request({
    url: '/eycode/paperClassification',
    method: 'put',
    data: data
  })
}

// 删除专题分类
export function delPaperClassification(id) {
  return request({
    url: '/eycode/paperClassification/' + id,
    method: 'delete'
  })
}

// 导出专题分类
export function exportPaperClassification(query) {
  return request({
    url: '/eycode/paperClassification/export',
    method: 'get',
    params: query
  })
}
