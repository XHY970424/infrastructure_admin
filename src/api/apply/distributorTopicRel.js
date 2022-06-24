import request from '@/utils/request'

// 项目进度列表
export function listDistributorRel(query) {
  return request({
    url: '/apply/distributorTopicRel/list',
    method: 'get',
    params: query
  })
}

// 新增分销商与课题关联
export function addDistributorRel(data) {
  return request({
    url: '/apply/distributorTopicRel',
    method: 'post',
    data: data
  })
}
