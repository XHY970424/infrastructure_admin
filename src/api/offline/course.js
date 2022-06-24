import request from '@/utils/request'

// 批量开课
export function openSubjectAndSpecial(data) {
  return request({
    url: '/eycode/offline/openSubjectAndSpecial',
    method: 'post',
    data: data
  })
}
