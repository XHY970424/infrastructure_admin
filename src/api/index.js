import request from '@/utils/request'

// 获取首页头部统计数量
export function getData() {
  return request({
    url: '/eycode/index/index',
    method: 'get'
  })
}

// 获取首页增长订单统计数量
export function orderRiseData(query) {
  return request({
    url: '/eycode/index/orderRiseData',
    method: 'get',
    params: query
  })
}

// 获取首页增长用户统计数量
export function userRiseData(query) {
  return request({
    url: '/eycode/index/userRiseData',
    method: 'get',
    params: query
  })
}

// 获取首页课程和专题分类统计数量
export function classifyStatistics() {
  return request({
    url: '/eycode/index/classifyStatistics',
    method: 'get'
  })
}
