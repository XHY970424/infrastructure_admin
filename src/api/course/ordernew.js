import request from '@/utils/request'

// 查询新订单列表
export function listNeworder(query) {
  return request({
    url: '/eycode/neworder/list',
    method: 'get',
    params: query
  })
}

// 查询渠道新订单列表
export function listChannelNeworder(query) {
  return request({
    url: '/channel/info/orderList',
    method: 'get',
    params: query
  })
}

// 查询新订单详细
export function getNeworder(id) {
  return request({
    url: '/eycode/neworder/' + id,
    method: 'get'
  })
}

// 新增新订单
export function addNeworder(data) {
  return request({
    url: '/eycode/neworder',
    method: 'post',
    data: data
  })
}

// 修改新订单
export function updateNeworder(data) {
  return request({
    url: '/eycode/neworder',
    method: 'put',
    data: data
  })
}

// 删除新订单
export function delNeworder(id) {
  return request({
    url: '/eycode/neworder/' + id,
    method: 'delete'
  })
}

// 导出新订单
export function exportNeworder(query) {
  return request({
    url: '/eycode/neworder/export',
    method: 'get',
    params: query,
    responseType:'blob'
  })
}

// 获取线下转账信息
export function getPayInfo(id) {
  return request({
    url: '/eycode/neworder/getPayInfo/' + id,
    method: 'get'
  })
}
// 提交支付审核信息
export function auditPay(data) {
  return request({
    url: '/eycode/neworder/auditPay',
    method: 'post',
    data: data
  })
}


// 查询新订单详情列表
export function listNeworderDetail(query) {
  return request({
    url: '/eycode/neworderdetail/list',
    method: 'get',
    params: query
  })
}
// 查询新订单详情列表
export function listChannelNeworderDetail(query) {
  return request({
    url: '/channel/info/orderDetailList',
    method: 'get',
    params: query
  })
}

// 提交发票审核信息
export function auditInvoiceInfo(data) {
  return request({
    url: '/eycode/neworder/uploadInvoiceInfo',
    method: 'post',
    data: data
  })
}

// 订单备注添加
export function setRemark(data) {
  return request({
    url: '/eycode/neworder/setRemark',
    method: 'post',
    data: data
  })
}
