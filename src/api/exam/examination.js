import request from '@/utils/request'

// 查询试卷管理列表
export function listExamination(query) {
  return request({
    url: '/exam/examination/list',
    method: 'get',
    params: query
  })
}

// 查询试卷管理详细
export function getExamination(id) {
  return request({
    url: '/exam/examination/' + id,
    method: 'get'
  })
}

// 新增试卷管理
export function addExamination(data) {
  return request({
    url: '/exam/examination',
    method: 'post',
    data: data
  })
}

// 修改试卷管理
export function updateExamination(data) {
  return request({
    url: '/exam/examination',
    method: 'put',
    data: data
  })
}

// 删除试卷管理
export function delExamination(id) {
  return request({
    url: '/exam/examination/' + id,
    method: 'delete'
  })
}

// 导出试卷管理
export function exportExamination(query) {
  return request({
    url: '/exam/examination/export',
    method: 'get',
    params: query
  })
}


// 题库列表
export function selectCategory(query) {
  return request({
    url: '/exam/preface/selectCategory',
    method: 'get',
    params: query
  })
}