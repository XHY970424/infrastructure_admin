import request from '@/utils/request'

// 查询报名期次列表
export function listPeriod(query) {
  return request({
    url: '/apply/period/list',
    method: 'get',
    params: query
  })
}

// 查询报名期次详细
export function getPeriod(periodId) {
  return request({
    url: '/apply/period/' + periodId,
    method: 'get'
  })
}

// 新增报名期次
export function addPeriod(data) {
  return request({
    url: '/apply/period',
    method: 'post',
    data: data
  })
}

// 修改报名期次
export function updatePeriod(data) {
  return request({
    url: '/apply/period',
    method: 'put',
    data: data
  })
}

// 报名期次状态变更
export function updateStatus(data) {
  return request({
    url: '/apply/period/updateStatus',
    method: 'put',
    data: data
  })
}

// 报名期次回收站恢复
export function recover(periodId) {
  return request({
    url: '/apply/period/recover/' + periodId,
    method: 'put'
  })
}

// 删除报名期次
export function delPeriod(periodId) {
  return request({
    url: '/apply/period/' + periodId,
    method: 'delete'
  })
}

// 导出报名期次
export function exportPeriod(query) {
  return request({
    url: '/apply/period/export',
    method: 'get',
    params: query
  })
}