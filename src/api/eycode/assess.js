import request from '@/utils/request'

// 查询培训考核列表
export function listAssess(query) {
  return request({
    url: '/eycode/assess/list',
    method: 'get',
    params: query
  })
}

// 查询培训考核详细
export function getAssess(id) {
  return request({
    url: '/eycode/assess/' + id,
    method: 'get'
  })
}

// 新增培训考核
export function addAssess(data) {
  return request({
    url: '/eycode/assess',
    method: 'post',
    data: data
  })
}

// 修改培训考核
export function updateAssess(data) {
  return request({
    url: '/eycode/assess',
    method: 'put',
    data: data
  })
}

// 删除培训考核
export function delAssess(id) {
  return request({
    url: '/eycode/assess/' + id,
    method: 'delete'
  })
}

// 导出培训考核
export function exportAssess(query) {
  return request({
    url: '/eycode/assess/export',
    method: 'get',
    params: query
  })
}

//请求订单管理数据
export function getOrderManagement() {
  return request({
    url: '/eycode/assess/selectAssess',
    method: 'post'
  })
}
//请求状态改变
export function modifyState(data) {
  return request({
    url: '/eycode/assess/updateAssess',
    method: 'post',
    data: data
    // headers:{
    //   'Content-Type': "application/x-www-form-urlencoded"
    // }
  })
}
