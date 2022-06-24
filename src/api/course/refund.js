import request from '@/utils/request'

// 查询退课列表
export function listNewrefund(query) {
  return request({
    url: '/eycode/newrefund/list',
    method: 'get',
    params: query
  })
}

// 查询退课详细
export function getNewrefund(refundId) {
  return request({
    url: '/eycode/newrefund/' + refundId,
    method: 'get'
  })
}

// 新增退课
export function addNewrefund(data) {
  return request({
    url: '/eycode/newrefund',
    method: 'post',
    data: data
  })
}

// 修改退课
export function updateNewrefund(data) {
  return request({
    url: '/eycode/newrefund',
    method: 'put',
    data: data
  })
}

// 删除退课
export function delNewrefund(refundId) {
  return request({
    url: '/eycode/newrefund/' + refundId,
    method: 'delete'
  })
}

// 导出退课
export function exportNewrefund(query) {
  return request({
    url: '/eycode/newrefund/export',
    method: 'get',
    params: query
  })
}