import request from '@/utils/request'

// 查询企业行业列表
export function listTrade(query) {
  return request({
    url: '/eycode/trade/list',
    method: 'get',
    params: query
  })
}

// 查询企业行业详细
export function getTrade(tradeId) {
  return request({
    url: '/eycode/trade/' + tradeId,
    method: 'get'
  })
}

// 新增企业行业
export function addTrade(data) {
  return request({
    url: '/eycode/trade',
    method: 'post',
    data: data
  })
}

// 修改企业行业
export function updateTrade(data) {
  return request({
    url: '/eycode/trade',
    method: 'put',
    data: data
  })
}

// 删除企业行业
export function delTrade(tradeId) {
  return request({
    url: '/eycode/trade/' + tradeId,
    method: 'delete'
  })
}

// 导出企业行业
export function exportTrade(query) {
  return request({
    url: '/eycode/trade/export',
    method: 'get',
    params: query
  })
}