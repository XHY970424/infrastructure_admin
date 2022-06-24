import request from '@/utils/request'

// 查询专题栏目数据列表
export function listSpecial(query) {
  return request({
    url: '/cms/tjspecial/list',
    method: 'get',
    params: query
  })
}

// 查询专题栏目数据详细
export function getSpecial(indexSpecialId) {
  return request({
    url: '/cms/tjspecial/' + indexSpecialId,
    method: 'get'
  })
}

// 新增专题栏目数据
export function addSpecial(data) {
  return request({
    url: '/cms/tjspecial',
    method: 'post',
    data: data
  })
}

// 修改专题栏目数据
export function updateSpecial(data) {
  return request({
    url: '/cms/tjspecial',
    method: 'put',
    data: data
  })
}

// 删除专题栏目数据
export function delSpecial(indexSpecialId) {
  return request({
    url: '/cms/tjspecial/' + indexSpecialId,
    method: 'delete'
  })
}

// 导出专题栏目数据
export function exportSpecial(query) {
  return request({
    url: '/cms/tjspecial/export',
    method: 'get',
    params: query
  })
}