import request from '@/utils/request'

// 查询2022-05-12课程资料上传记录列表
export function listCourseMaterial(query) {
  return request({
    url: '/course/courseMaterial/list',
    method: 'get',
    params: query
  })
}

// 上传资料文件 规定格式
export function uploadFileLimit(data) {
  return request({
    url: '/file/uploadFileLimit',
    method: 'POST',
    data
  })
}

// 查询2022-05-12课程资料上传记录详细
export function getCourseMaterial(id) {
  return request({
    url: '/course/courseMaterial/' + id,
    method: 'get'
  })
}

// 新增2022-05-12课程资料上传记录
export function addCourseMaterial(data) {
  return request({
    url: '/course/courseMaterial',
    method: 'post',
    data: data
  })
}

// 排序前列表查询
export function getSortCourseMaterial(courseId) {
  return request({
    url: `/course/courseMaterial/sortList/${courseId}`,
    method: 'get',
  })
}

// 课程资料排序
export function courseMaterialSort(data) {
  return request({
    url: `/course/courseMaterial/sort`,
    method: 'post',
    data
  })
}

// 修改2022-05-12课程资料上传记录
export function updateCourseMaterial(data) {
  return request({
    url: '/course/courseMaterial',
    method: 'put',
    data: data
  })
}

// 删除2022-05-12课程资料上传记录
export function delCourseMaterial(id) {
  return request({
    url: '/course/courseMaterial/' + id,
    method: 'delete'
  })
}
