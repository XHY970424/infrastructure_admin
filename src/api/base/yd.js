import request from '@/utils/request'

// 查询移动端轮播图列表
export function listYd(query) {
  return request({
    url: '/base/carouselyd/list',
    method: 'get',
    params: query
  })
}

// 查询移动端轮播图详细
export function getYd(pictureId) {
  return request({
    url: '/base/carouselyd/' + pictureId,
    method: 'get'
  })
}

// 新增移动端轮播图
export function addYd(data) {
  return request({
    url: '/base/carouselyd',
    method: 'post',
    data: data
  })
}

// 修改移动端轮播图
export function updateYd(data) {
  return request({
    url: '/base/carouselyd',
    method: 'put',
    data: data
  })
}

// 删除移动端轮播图
export function delYd(pictureId) {
  return request({
    url: '/base/carouselyd/' + pictureId,
    method: 'delete'
  })
}

// 导出移动端轮播图
export function exportYd(query) {
  return request({
    url: '/base/carouselyd/export',
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
