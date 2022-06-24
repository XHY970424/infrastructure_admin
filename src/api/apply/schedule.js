import request from '@/utils/request'

// 项目进度(租户)列表
export function listScheduleTenant(query) {
  return request({
    url: '/apply/scheduleTenant/list',
    method: 'get',
    params: query
  })
}

// 项目进度(分销)列表
export function listScheduleDistribution(query) {
  return request({
    url: '/apply/scheduleDistribution/list',
    method: 'get',
    params: query
  })
}

// 查询报名进度租户汇总列表
export function collectList(query) {
  return request({
    url: '/apply/scheduleTenant/collectList',
    method: 'get',
    params: query
  })
}

// 查询租户报名数据汇总
export function collect(query) {
  return request({
    url: '/apply/scheduleTenant/collect',
    method: 'get',
    params: query
  })
}

// 查询报名进度分销汇总列表
export function dCollectList(query) {
  return request({
    url: '/apply/scheduleDistribution/collectList',
    method: 'get',
    params: query
  })
}

// 查询分销报名数据汇总
export function dCollect(query) {
  return request({
    url: '/apply/scheduleDistribution/collect',
    method: 'get',
    params: query
  })
}

// 查询是否有历史数据
export function hasHistory(query) {
  return request({
    url: '/apply/scheduleDistribution/hasHistory',
    method: 'get',
    params: query
  })
}

// 查询是否有历史数据
export function historyCollect(query) {
  return request({
    url: '/apply/scheduleDistribution/historyCollect',
    method: 'get',
    params: query
  })
}

// 查询是否有历史数据
export function historyCollectList(query) {
  return request({
    url: '/apply/scheduleDistribution/historyCollectList',
    method: 'get',
    params: query
  })
}

//查询项目下的课题
export function searchMyPushUsers(params) {
  return request({
    url: '/apply/userInfo/searchMyPushUsers/projectId',
    method: 'get',
    params
  })
}

//生成短链接
export function generator(data) {
  return request({
      url: '/apply/surl/generator',
      method: 'post',
      data
  })
}