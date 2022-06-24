import request from '@/utils/request'

// 查询文章内容分类列表
export function listContCategory(query) {
  return request({
    url: '/content/contCategory/list',
    method: 'get',
    params: query
  })
}

// 查询文章内容分类详细
export function getContCategory(categoryId) {
  return request({
    url: '/content/contCategory/' + categoryId,
    method: 'get'
  })
}

// 新增文章内容分类
export function addContCategory(data) {
  return request({
    url: '/content/contCategory',
    method: 'post',
    data: data
  })
}

// 修改文章内容分类
export function updateContCategory(data) {
  return request({
    url: '/content/contCategory',
    method: 'put',
    data: data
  })
}

// 删除文章内容分类
export function delContCategory(categoryId) {
  return request({
    url: '/content/contCategory/' + categoryId,
    method: 'delete'
  })
}


// 导出文章内容分类
export function exportContCategory(query) {
  return request({
    url: '/content/contCategory/export',
    method: 'get',
    params: query
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
 * 自定义视频上传
 * @param {*} fileobj
 */
export function fileUploadVideo(fileobj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file',fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadVideo',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  });
}
