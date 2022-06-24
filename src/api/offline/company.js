import request from '@/utils/request'

// 查询已审核企业列表
export function queryCompanyList(query) {
  return request({
    url: '/eycode/company/list',
    method: 'get',
    params: query
  })
}

// 按条件查询学员列表
export function queryUserList(query) {
  return request({
    url: '/eycode/company/searchEyUsers',
    method: 'get',
    params: query
  })
}

// 查询可报名课程和专题
export function getCourseSubject() {
  return request({
    url: '/eycode/company/getCourseSubject',
    method: 'get'
  })
}

// 批量企业开课
export function openSubjectAndSpecial(data) {
  return request({
    url: '/eycode/company/batchApply',
    method: 'post',
    data: data
  })
}
