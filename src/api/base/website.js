import request from '@/utils/request'

// 查询网站基本信息列表
export function listWebsite(query) {
  return request({
    url: '/base/website/list',
    method: 'get',
    params: query
  })
}

// 查询网站基本信息详细
export function getWebsite(id) {
  return request({
    url: '/base/website/' + id,
    method: 'get'
  })
}

// 新增网站基本信息
export function addWebsite(data) {
  return request({
    url: '/base/website',
    method: 'post',
    data: data
  })
}

// 修改网站基本信息
export function updateWebsite(data) {
  return request({
    url: '/base/website',
    method: 'put',
    data: data
  })
}

// 删除网站基本信息
export function delWebsite(id) {
  return request({
    url: '/base/website/' + id,
    method: 'delete'
  })
}

// 导出网站基本信息
export function exportWebsite(query) {
  return request({
    url: '/base/website/export',
    method: 'get',
    params: query
  })
}

/**
 * 自定义上传
 * @param {*} fileobj
 */
export function fileUpload(fileobj){
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
 * 自定义上传 上传任意文件
 * @param {*} fileobj
 */
export function fileAnyUpload(fileobj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file',fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadFile',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  });
}

export function changeEnableStatus(id) {
  // const data = {
  //   id
  // }
  // return request({
  //   url: '/system/user/changeStatus',
  //   method: 'put',
  //   data: data
  // })
  return request({
    url: '/base/website/changeEnableStatus/'+id,
    method: 'get',
  })
}
