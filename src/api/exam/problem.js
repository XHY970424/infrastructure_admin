import request from '@/utils/request'

// 查询案例题列表
export function listProblem(query) {
  return request({
    url: '/exam/problem/list',
    method: 'get',
    params: query
  })
}

// 查询案例题详细
export function getProblem(id) {
  return request({
    url: '/exam/problem/' + id,
    method: 'get'
  })
}

// 新增案例题
export function addProblem(data) {
  return request({
    url: '/exam/problem',
    method: 'post',
    data: data
  })
}

// 修改案例题
export function updateProblem(data) {
  return request({
    url: '/exam/problem',
    method: 'put',
    data: data
  })
}

// 删除案例题
export function delProblem(id) {
  return request({
    url: '/exam/problem/' + id,
    method: 'delete'
  })
}

// 导出案例题
export function exportProblem(query) {
  return request({
    url: '/exam/problem/export',
    method: 'get',
    params: query
  })
}