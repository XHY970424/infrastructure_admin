import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询课程订单列表
export function listOrder(query) {
  return request({
    url: '/eycode/order/list',
    method: 'get',
    params: query
  })
}

// 查询课程订单详细
export function getOrder(id) {
  return request({
    url: '/eycode/order/' + id,
    method: 'get'
  })
}

// 新增课程订单
export function addOrder(data) {
  return request({
    url: '/eycode/order',
    method: 'post',
    data: data
  })
}

// 修改课程订单
export function updateOrder(data) {
  return request({
    url: '/eycode/order',
    method: 'put',
    data: data
  })
}

// 删除课程订单
export function delOrder(id) {
  return request({
    url: '/eycode/order/' + id,
    method: 'delete'
  })
}

// 导出课程订单
export function exportOrder(query) {
  return request({
    url: '/eycode/order/export',
    method: 'get',
    params: query
  })
}

// 审核内容管理
export function auditContContents(data) {
  return request({
    url: '/eycode/order/audit',
    method: 'put',
    data: data
  })
}


// 查询订单详情列表
export function getOrderDetailList(query) {
  return request({
    url: '/eycode/detail/list',
    method: 'get',
    params: query
  })
}

// 查询订单下课程详情列表
export function getSubject(subjectId) {
  return request({
    url: '/eycode/order/subject/' + subjectId,
    method: 'get',
  })
}

// 查询订单 线下转账 客户提交的信息
export function getOfflinePayInfo(orderId) {
  return request({
    url: '/eycode/orderOffline/getInfo/' + orderId,
    method: 'get',
  })
}

// 更新线下转账客户提交的信息 并 修改 订单的支付审核状态
export function updateOfflinePayInfo(data) {
  return request({
    url: '/eycode/orderOffline/update',
    method: 'post',
    data: data
  })
}

/**
 * 自定义图片上传(base64格式)
 * @param obj
 */
export function imgBase64Upload(obj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('image',obj);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadImgBase64',
    data: param
  });
}

/**
 * 上传发票
 * @param {Object} data
 */
export function uploadInvoice(data) {
  return request({
    url: '/eycode/order/invoice',
    method: 'post',
    data: data
  })
}
/**
 * 自定义pdf文件上传
 * @param {*} fileobj
 */
export function fileUpload2(fileobj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file',fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadPDF',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  });
}

// 获取用户的退费信息
export function getBackInfo(orderId) {
  return request({
    url: '/eycode/order/back/' + orderId,
    method: 'get',
  })
}

// 修改退费信息
export function updateReturn(data) {
  return request({
    url: '/eycode/order/saveBack',
    method: 'post',
    data: data
  })
}
