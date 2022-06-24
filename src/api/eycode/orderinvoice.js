import request from '@/utils/request'

// 查询订单发票申请列表
export function listOrderinvoice(query) {
  return request({
    url: '/eycode/orderinvoice/list',
    method: 'get',
    params: query
  })
}

// 查询订单发票申请详细
export function getOrderinvoice(id) {
  return request({
    url: '/eycode/orderinvoice/' + id,
    method: 'get'
  })
}

// 新增订单发票申请
export function addOrderinvoice(data) {
  return request({
    url: '/eycode/orderinvoice',
    method: 'post',
    data: data
  })
}

// 修改订单发票申请
export function updateOrderinvoice(data) {
  return request({
    url: '/eycode/orderinvoice',
    method: 'put',
    data: data
  })
}

// 删除订单发票申请
export function delOrderinvoice(id) {
  return request({
    url: '/eycode/orderinvoice/' + id,
    method: 'delete'
  })
}

// 导出订单发票申请
export function exportOrderinvoice(query) {
  return request({
    url: '/eycode/orderinvoice/export',
    method: 'get',
    params: query
  })
}