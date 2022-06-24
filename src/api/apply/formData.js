import request from '@/utils/request'

// 查询报名填写数据列表
export function listApplyData(query) {
  return request({
    url: '/apply/formData/list',
    method: 'get',
    params: query
  })
}
