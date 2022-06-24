import request from '@/utils/request'

// 查询用户会员列表
export function listMember(query) {
  return request({
    url: '/eycode/member/list',
    method: 'get',
    params: query
  })
}

// 查询用户会员详细
export function getMember(memberId) {
  return request({
    url: '/eycode/member/' + memberId,
    method: 'get'
  })
}

// 新增用户会员
export function addMember(data) {
  return request({
    url: '/eycode/member',
    method: 'post',
    data: data
  })
}

// 修改用户会员
export function updateMember(data) {
  return request({
    url: '/eycode/member',
    method: 'put',
    data: data
  })
}

// 删除用户会员
export function delMember(memberId) {
  return request({
    url: '/eycode/member/' + memberId,
    method: 'delete'
  })
}

// 导出用户会员
export function exportMember(query) {
  return request({
    url: '/eycode/member/export',
    method: 'get',
    params: query
  })
}

// 提升用户会员等级
export function promote(data) {
  return request({
    url: '/eycode/member/promote',
    method: 'post',
    data: data
  })
}
