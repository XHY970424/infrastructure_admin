import request from '@/utils/request'

// 查询课程分类 列表
export function listCategory(query) {
  return request({
    url: '/eycode/category/list',
    method: 'get',
    params: query
  })
}

// 查询课程分类 详细
export function getCategory(id) {
  return request({
    url: '/eycode/category/' + id,
    method: 'get'
  })
}

// 新增课程分类
export function addCategory(data) {
  return request({
    url: '/eycode/category',
    method: 'post',
    data: data
  })
}

// 修改课程分类
export function updateCategory(data) {
  return request({
    url: '/eycode/category',
    method: 'put',
    data: data
  })
}

// 删除课程分类
export function delCategory(id) {
  return request({
    url: '/eycode/category/' + id,
    method: 'delete'
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

// 导出课程分类
export function exportCategory(query) {
  return request({
    url: '/eycode/category/export',
    method: 'get',
    params: query
  })
}
