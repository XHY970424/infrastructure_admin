import request from '@/utils/request'

// 查询折扣列表
export function listDiscount(query) {
  return request({
    url: '/eycode/discount/list',
    method: 'get',
    params: query
  })
}

// 查询折扣详细
export function getDiscount(discountId) {
  return request({
    url: '/eycode/discount/' + discountId,
    method: 'get'
  })
}

// 新增折扣
export function addDiscount(data) {
  return request({
    url: '/eycode/discount',
    method: 'post',
    data: data
  })
}

// 修改折扣
export function updateDiscount(data) {
  return request({
    url: '/eycode/discount',
    method: 'put',
    data: data
  })
}

// 删除折扣
export function delDiscount(discountId) {
  return request({
    url: '/eycode/discount/' + discountId,
    method: 'delete'
  })
}

// 导出折扣
export function exportDiscount(query) {
  return request({
    url: '/eycode/discount/export',
    method: 'get',
    params: query
  })
}