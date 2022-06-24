import request from '@/utils/request'

// 当前分销商结算列表
export function currentList() {
  return request({
    url: '/apply/currentDistributor/list',
    method: 'get'
  })
}

// 当前分销商结算列表
export function lowerList(query) {
  return request({
    url: '/apply/lowerDistributor/list',
    method: 'get',
    params: query
  })
}

// 当前分销商详情
export function detailList() {
  return request({
    url: '/apply/currentDistributor/detail',
    method: 'get'
  })
}


// 当前分销结算记录
export function settlementLogList(accountId) {
  return request({
    url: '/apply/currentDistributor/settlementLog/' + accountId,
    method: 'get'
  })
}

// 下级分销详情信息
export function lowerDetailList(distributorId) {
  return request({
    url: '/apply/lowerDistributor/detail/' + distributorId,
    method: 'get'
  })
}

// 下级分销结算记录
export function lowerSettlementLogList(accountId) {
  return request({
    url: '/apply/lowerDistributor/settlementLog/' + accountId,
    method: 'get'
  })
}

// 手动结算
export function withdraw(data) {
  return request({
    url: '/apply/lowerDistributor/withdraw',
    method: 'post',
    data: data
  })
}
