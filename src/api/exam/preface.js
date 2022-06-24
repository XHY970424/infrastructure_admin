import request from '@/utils/request'

// 查询题库管理列表
export function listPreface(query) {
  return request({
    url: '/exam/preface/list',
    method: 'get',
    params: query
  })
}

// 查询题库管理详细
export function getPreface(id) {
  return request({
    url: '/exam/preface/' + id,
    method: 'get'
  })
}

// 新增题库管理
export function addPreface(data) {
  return request({
    url: '/exam/preface',
    method: 'post',
    data: data
  })
}

// 修改题库管理
export function updatePreface(data) {
  return request({
    url: '/exam/preface',
    method: 'put',
    data: data
  })
}

// 删除题库管理
export function delPreface(id) {
  return request({
    url: '/exam/preface/' + id,
    method: 'delete'
  })
}

// 逻辑删除题库管理
export function deleteTime(query) {
  return request({
    url: '/exam/preface/deleteTime',
    method: 'get',
    params: query
  })
}


// 导出题库管理
export function exportPreface(query) {
  return request({
    url: '/exam/preface/export',
    method: 'get',
    params: query
  })
}
