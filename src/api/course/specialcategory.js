import request from '@/utils/request'

// 查询专题分类列表
export function listSpecialcategory(query) {
  return request({
    url: '/eycode/specialcategory/list',
    method: 'get',
    params: query
  })
}

// 查询专题分类详细
export function getSpecialcategory(id) {
  return request({
    url: '/eycode/specialcategory/' + id,
    method: 'get'
  })
}

// 新增专题分类
export function addSpecialcategory(data) {
  return request({
    url: '/eycode/specialcategory',
    method: 'post',
    data: data
  })
}

// 修改专题分类
export function updateSpecialcategory(data) {
  return request({
    url: '/eycode/specialcategory',
    method: 'put',
    data: data
  })
}

// 删除专题分类
export function delSpecialcategory(id) {
  return request({
    url: '/eycode/specialcategory/' + id,
    method: 'delete'
  })
}

// 导出专题分类
export function exportSpecialcategory(query) {
  return request({
    url: '/eycode/specialcategory/export',
    method: 'get',
    params: query
  })
}