import request from '@/utils/request'

// 查询课程章节 列表
export function listSection(query) {
  return request({
    url: '/course/section/list',
    method: 'get',
    params: query
  })
}

// 查询课程章节 详细
export function getSection(id) {
  return request({
    url: '/course/section/' + id,
    method: 'get'
  })
}

// 新增课程章节
export function addSection(data) {
  return request({
    url: '/course/section',
    method: 'post',
    data: data
  })
}


// 修改小节
export function sectionEdit(data) {
  return request({
    url: 'course/section/sectionEdit',
    method: 'post',
    data: data
  })
}

// 修改课程章节
export function updateSection(data) {
  return request({
    url: '/course/section',
    method: 'put',
    data: data
  })
}

// 删除课程章节
export function delSection(id) {
  return request({
    url: '/course/section/' + id,
    method: 'delete'
  })
}

// 导出课程章节
export function exportSection(query) {
  return request({
    url: '/course/section/export',
    method: 'get',
    params: query
  })
}

/**
 * 自定义视频上传
 * @param {*} fileobj
 */
export function fileUpload1(fileobj){
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
/**
 * 获取可选的试卷列表
 * @param {Object} id
 */
export function getPapers(id) {
  return request({
    url: '/course/section/getPapers/' + id,
    method: 'get'
  })
}
/**
 * 获取视频上传地址和凭证
 * @param
 */
export function createUploadVideo(query) {
  return request({
    url: '/file/createUploadVideo',
    method: 'get',
    params: query
  })
}

/**
 * 刷新视频上传凭证
 * @param
 */
export function refreshUploadVideo(query) {
  return request({
    url: '/file/refreshUploadVideo',
    method: 'get',
    params: query
  })
}

/**
 * 获得视频播放地址url
 * @param
 */
export function getPlayInfo(query) {
  return request({
    url: '/file/getPlayInfo',
    method: 'get',
    params: query
  })
}

