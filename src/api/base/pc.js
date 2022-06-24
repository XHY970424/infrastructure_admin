import request from '@/utils/request'

// 查询pc端轮播图列表
export function listPc(query) {
  return request({
    url: '/base/carouselpc/list',
    method: 'get',
    params: query
  })
}

// 查询pc端轮播图详细
export function getPc(pictureId) {
  return request({
    url: '/base/carouselpc/' + pictureId,
    method: 'get'
  })
}

// 新增pc端轮播图
export function addPc(data) {
  return request({
    url: '/base/carouselpc',
    method: 'post',
    data: data
  })
}

// 修改pc端轮播图
export function updatePc(data) {
  return request({
    url: '/base/carouselpc',
    method: 'put',
    data: data
  })
}

// 删除pc端轮播图
export function delPc(pictureId) {
  return request({
    url: '/base/carouselpc/' + pictureId,
    method: 'delete'
  })
}

// 导出pc端轮播图
export function exportPc(query) {
  return request({
    url: '/base/carouselpc/export',
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
