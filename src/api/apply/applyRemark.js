import request from '@/utils/request'

// 查询报名信息备注列表
export function listApplyRemark(query) {
  return request({
    url: '/remark/applyRemark/list',
    method: 'get',
    params: query
  })
}

// 查询报名信息备注详细
export function getApplyRemark(userInfoId) {
  return request({
    url: '/remark/applyRemark/' + userInfoId,
    method: 'get'
  })
}

// 新增报名信息备注
export function addApplyRemark(data) {
  return request({
    url: '/remark/applyRemark',
    method: 'post',
    data: data
  })
}

// 修改报名信息备注
export function updateApplyRemark(data) {
  return request({
    url: '/remark/applyRemark',
    method: 'put',
    data: data
  })
}

// 删除报名信息备注
export function delApplyRemark(userInfoId) {
  return request({
    url: '/remark/applyRemark/' + userInfoId,
    method: 'delete'
  })
}

// 导出报名信息备注
export function exportApplyRemark(query) {
  return request({
    url: '/remark/applyRemark/export',
    method: 'get',
    params: query
  })
}