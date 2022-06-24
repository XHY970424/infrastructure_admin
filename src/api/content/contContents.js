import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询内容管理列表
export function listContContents(query) {
  return request({
    url: '/content/contContents/list',
    method: 'get',
    params: query
  })
}

// 查询内容管理详细
export function getContContents(id) {
  return request({
    url: '/content/contContents/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增内容管理
export function addContContents(data) {
  return request({
    url: '/content/contContents',
    method: 'post',
    data: data
  })
}

// 修改内容管理
export function updateContContents(data) {
  return request({
    url: '/content/contContents',
    method: 'put',
    data: data
  })
}

// 审核内容管理
export function auditContContents(data) {
  return request({
    url: '/content/contContents/audit',
    method: 'put',
    data: data
  })
}

// 删除内容管理
export function delContContents(id) {
  return request({
    url: '/content/contContents/' + id,
    method: 'delete'
  })
}

// 发布状态修改
export function publishContContents(id,status) {
  return request({
    url: '/content/contContents/publish?ids=' + id + "&status=" + status,
    method: 'put'
  })
}

// 导出内容管理
export function exportContContents(query) {
  return request({
    url: '/content/contContents/export',
    method: 'get',
    params: query
  })
}


// 获取分类的列表信息
export function getCategorys() {
  return request({
    url: '/content/contCategory/getCategorys',
    method: 'get'
  })
}

/**
 * 自定义图片上传
 * @param {*} fileobj
 */
export function imgUpload(fileobj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file',fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadImg',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  });
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

//添加日期范围
export function addDateRange(params, dateRangeAuditTime, dateRangeCreateDate) {
  var search = params;
  search.beginAuditTime = "";
  search.endAuditTime = "";
  search.beginCreateDate = "";
  search.endCreateDate = "";
  if (null != dateRangeAuditTime && '' != dateRangeAuditTime) {
    search.beginAuditTime = dateRangeAuditTime[0];
    search.endAuditTime = dateRangeAuditTime[1];
  }
  if (null != dateRangeCreateDate && '' != dateRangeCreateDate) {
    search.beginCreateDate = dateRangeCreateDate[0];
    search.endCreateDate = dateRangeCreateDate[1];
  }
  return search;
}

// 上架
export function putaway(ids) {
  return request({
    url: '/content/contContents/putaway?ids=' + ids,
    method: 'put'
  })
}

// 下架
export function soldOut(ids) {
  return request({
    url: '/content/contContents/soldOut?ids=' + ids,
    method: 'put'
  })
}

/**
 * 获取已上架的文章数据
 */
export function queryContentList() {
  return request({
    url: '/content/contContents/queryContentList',
    method: 'get'
  })
}

/**
 * 获取已上架的文章数据 可筛选
 */
export function getContentList(query) {
  return request({
    url: '/content/contContents/getContentList',
    method: 'get',
    params: query
  })
}
