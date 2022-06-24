import request from '@/utils/request'

// 查询分销-企业关联列表
export function listSign(query) {
  return request({
    url: '/apply/sign/list',
    method: 'get',
    params: query
  })
}

// 查询分销-企业关联详细
export function getSign(signId) {
  return request({
    url: '/apply/sign/' + signId,
    method: 'get'
  })
}

// 新增分销-企业关联
export function addSign(data) {
  return request({
    url: '/apply/sign',
    method: 'post',
    data: data
  })
}

// 修改分销-企业关联
export function updateSign(data) {
  return request({
    url: '/apply/sign',
    method: 'put',
    data: data
  })
}

// 删除分销-企业关联
export function delSign(signId) {
  return request({
    url: '/apply/sign/' + signId,
    method: 'delete'
  })
}

// 导出分销-企业关联
export function exportSign(query) {
  return request({
    url: '/apply/sign/export',
    method: 'get',
    params: query
  })
}

// 发起后台用户与前台用户签约
export function sendAuthoritySign(data) {
  return request({
    url: '/apply/sign/sendAuthoritySign',
    method: 'post',
    data: data
  })
}

// 查询渠道用户与前台权限签约企业列表
export function companyList(query) {
  return request({
    url: '/apply/sign/companyList',
    method: 'get',
    params: query
  })
}
