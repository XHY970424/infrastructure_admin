import request from '@/utils/request'

// 查询工匠信息列表
export function listArtisan(query) {
  return request({
    url: '/craftsman/artisan/list',
    method: 'get',
    params: query
  })
}

// 查询工匠信息详细
export function getArtisan(id) {
  return request({
    url: '/craftsman/artisan/' + id,
    method: 'get'
  })
}

// 新增工匠信息
export function addArtisan(data) {
  return request({
    url: '/craftsman/artisan',
    method: 'post',
    data: data
  })
}

// 修改工匠信息
export function updateArtisan(data) {
  return request({
    url: '/craftsman/artisan',
    method: 'put',
    data: data
  })
}

// 删除工匠信息
export function delArtisan(id) {
  return request({
    url: '/craftsman/artisan/' + id,
    method: 'delete'
  })
}

// 导出工匠信息
export function exportArtisan(query) {
  return request({
    url: '/craftsman/artisan/export',
    method: 'get',
    params: query
  })
}

//图片上传
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
