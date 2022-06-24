import request from '@/utils/request'

// 查询 需要审核的 人员数据
export function auditUserList(query) {
  return request({
    url: '/eycode/auditlog/list',
    method: 'get',
    params: query
  })
}

// 查询 课程列表
export function auditSubjectList(query) {
  return request({
    url: '/eycode/auditlog/getSubjectList',
    method: 'get',
    params: query
  })
}

// 查询 审核课时 详情
export function getAudit(id) {
  return request({
    url: '/eycode/auditlog/getAudit/' + id,
    method: 'get'
  })
}

// 查询 作弊课时 详情
export function getCheat(id) {
  return request({
    url: '/eycode/auditlog/getCheat/' + id,
    method: 'get'
  })
}

// 所有通过
export function apiAllPass(id) {
  return request({
    url: '/eycode/auditlog/allPass/' + id,
    method: 'get'
  })
}
// 选中项通过
export function apiChoosePass(data) {
  return request({
    url: '/eycode/auditlog/choosePass',
    method: 'post',
    data: data
  })
}
// 选中项作弊
export function apiChooseNoPass(data) {
  return request({
    url: '/eycode/auditlog/chooseNoPass',
    method: 'post',
    data: data
  })
}

// 导出学时记录
export function apiExport(id) {
  return request({
    url: '/eycode/auditlog/export/' + id,
    method: 'get'
  })
}
