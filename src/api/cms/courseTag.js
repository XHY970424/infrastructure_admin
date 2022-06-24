import request from '@/utils/request'

// 查询2022-04-24课程标签列表
export function listCourseTag(query) {
  return request({
    url: '/resource/courseTag/list',
    method: 'get',
    params: query
  })
}

// 查询2022-04-24课程标签详细
export function getCourseTag(id) {
  return request({
    url: '/resource/courseTag/' + id,
    method: 'get'
  })
}

// 新增2022-04-24课程标签
export function addCourseTag(data) {
  return request({
    url: '/resource/courseTag',
    method: 'post',
    data: data
  })
}

// 修改2022-04-24课程标签
export function updateCourseTag(data) {
  return request({
    url: '/resource/courseTag',
    method: 'put',
    data: data
  })
}

// 删除2022-04-24课程标签
export function delCourseTag(id) {
  return request({
    url: '/resource/courseTag/' + id,
    method: 'delete'
  })
}

// 新增课程标签分类
export function addCourseTagClass(tagClassName) {
  return request({
    url: '/resource/courseTagClass',
    method: 'post',
    data: {tagClassName}
  })
}

// 修改课程标签分类
export function updateCourseTagClass(data) {
  return request({
    url: '/resource/courseTagClass',
    method: 'put',
    data: data
  })
}

// 删除课程标签分类
export function delCourseTagClass(id) {
  return request({
    url: '/resource/courseTagClass/' + id,
    method: 'delete'
  })
}

// 查询课程标签分类列表
export function getCourseTagClass() {
  return request({
    url: '/resource/courseTagClass/list',
    method: 'get'
  })
}

// 获取课程标签分类下数据的详细信息
export function getTagClassById(id) {
  return request({
    url: '/resource/courseTag/queryByTagClassId/' + id,
    method: 'get'
  })
}

// 获取未被加入到标签分类的数据
export function getTagClassList(params) {
  return request({
    url: '/resource/courseTag/queryByTagClassId',
    method: 'get',
    params
  })
}

// 标签加入分类（分类标签)
export function tagAddClass(data) {
  return request({
    url: '/resource/courseTag/TagAddClass',
    method: 'post',
    data
  })
}

// 标签加入分类（分类标签)
export function delTagClassById(id) {
  return request({
    url: '/resource/courseTag/' + id,
    method: 'post'
  })
}
