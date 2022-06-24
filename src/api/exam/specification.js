import request from '@/utils/request'

// 查询试题规则设立列表
export function listSpecification(query) {
  return request({
    url: '/exam/specification/list',
    method: 'get',
    params: query
  })
}

// 查询试题规则设立详细
export function getSpecification(id) {
  return request({
    url: '/exam/specification/' + id,
    method: 'get'
  })
}

// 新增试题规则设立
export function addSpecification(data) {
  return request({
    url: '/exam/specification',
    method: 'post',
    data: data
  })
}

// 修改试题规则设立
export function updateSpecification(data) {
  return request({
    url: '/exam/specification',
    method: 'put',
    data: data
  })
}

// 删除试题规则设立
export function delSpecification(id) {
  return request({
    url: '/exam/specification/' + id,
    method: 'delete'
  })
}

// 导出试题规则设立
export function exportSpecification(query) {
  return request({
    url: '/exam/specification/export',
    method: 'get',
    params: query
  })
}

//获取试题
export function testQuestions(query) {
  return request({
    url: '/exam/specification/testQuestions',
    method: 'get',
    params: query
  })
}
