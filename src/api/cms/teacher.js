import request from '@/utils/request'

// 查询讲师栏目数据列表
export function listTeacher(query) {
  return request({
    url: '/cms/teacher/list',
    method: 'get',
    params: query
  })
}

// 查询讲师栏目数据详细
export function getTeacher(indexTeacherId) {
  return request({
    url: '/cms/teacher/' + indexTeacherId,
    method: 'get'
  })
}

// 新增讲师栏目数据
export function addTeacher(data) {
  return request({
    url: '/cms/teacher',
    method: 'post',
    data: data
  })
}

// 修改讲师栏目数据
export function updateTeacher(data) {
  return request({
    url: '/cms/teacher',
    method: 'put',
    data: data
  })
}

// 删除讲师栏目数据
export function delTeacher(indexTeacherId) {
  return request({
    url: '/cms/teacher/' + indexTeacherId,
    method: 'delete'
  })
}

// 导出讲师栏目数据
export function exportTeacher(query) {
  return request({
    url: '/cms/teacher/export',
    method: 'get',
    params: query
  })
}