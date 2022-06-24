import request from '@/utils/request'

// 期次进度(租户)列表
export function tenantList(query) {
  return request({
    url: '/apply/periodSchedule/tenantList',
    method: 'get',
    params: query
  })
}

// 期次进度(分销)列表
export function distributionList(query) {
  return request({
    url: '/apply/periodSchedule/distributionList',
    method: 'get',
    params: query
  })
}

