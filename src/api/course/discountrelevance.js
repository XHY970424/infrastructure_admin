import request from '@/utils/request'

// 查询折扣关联列表
export function listDiscountrelevance(query) {
  return request({
    url: '/eycode/discountrelevance/list',
    method: 'get',
    params: query
  })
}

// 查询折扣关联详细
export function getDiscountrelevance(discountRelevanceId) {
  return request({
    url: '/eycode/discountrelevance/' + discountRelevanceId,
    method: 'get'
  })
}

// 新增折扣关联
export function addDiscountrelevance(data) {
  return request({
    url: '/eycode/discountrelevance',
    method: 'post',
    data: data
  })
}

// 修改折扣关联
export function updateDiscountrelevance(data) {
  return request({
    url: '/eycode/discountrelevance',
    method: 'put',
    data: data
  })
}

// 删除折扣关联
export function delDiscountrelevance(discountRelevanceId) {
  return request({
    url: '/eycode/discountrelevance/' + discountRelevanceId,
    method: 'delete'
  })
}

// 导出折扣关联
export function exportDiscountrelevance(query) {
  return request({
    url: '/eycode/discountrelevance/export',
    method: 'get',
    params: query
  })
}