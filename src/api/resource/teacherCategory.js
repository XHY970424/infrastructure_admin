import request from '@/utils/request'

// 查询名师专区分类列表
export function listTeacherCategory(query) {
  return request({
    url: '/resource/teachercategory/list',
    method: 'get',
    params: query
  })
}

// 查询名师专区分类详细
export function getTeacherCategory(id) {
  return request({
    url: '/resource/teachercategory/' + id,
    method: 'get'
  })
}

// 新增名师专区分类
export function addTeacherCategory(data) {
  return request({
    url: '/resource/teachercategory',
    method: 'post',
    data: data
  })
}

// 修改名师专区分类
export function updateTeacherCategory(data) {
  return request({
    url: '/resource/teachercategory',
    method: 'put',
    data: data
  })
}

// 删除名师专区分类
export function delTeacherCategory(id) {
  return request({
    url: '/resource/teachercategory/' + id,
    method: 'delete'
  })
}
