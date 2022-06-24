import request from '@/utils/request'

// 推送课题至企业
export function pushCompany(data) {
  return request({
    url: '/apply/pushCompany/pushCompany',
    method: 'post',
    data: data
  })
}
