import request from '@/utils/request'

// 查询课程栏目数据列表
export function listCourse(query) {
  return request({
    url: '/cms/course/list',
    method: 'get',
    params: query
  })
}

// 查询课程栏目数据详细
export function getCourse(indexCourseId) {
  return request({
    url: '/cms/course/' + indexCourseId,
    method: 'get'
  })
}

// 新增课程栏目数据
export function addCourse(data) {
  return request({
    url: '/cms/course',
    method: 'post',
    data: data
  })
}

// 修改课程栏目数据
export function updateCourse(data) {
  return request({
    url: '/cms/course',
    method: 'put',
    data: data
  })
}

// 删除课程栏目数据
export function delCourse(indexCourseId) {
  return request({
    url: '/cms/course/' + indexCourseId,
    method: 'delete'
  })
}

// 导出课程栏目数据
export function exportCourse(query) {
  return request({
    url: '/cms/course/export',
    method: 'get',
    params: query
  })
}