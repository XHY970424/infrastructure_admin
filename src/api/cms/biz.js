import request from '@/utils/request'

// 查询业务场景列表
export function listBiz(query) {
  return request({
    url: '/cms/biz/list',
    method: 'get',
    params: query
  })
}

// 查询业务场景详细
export function getBiz(indexBizId) {
  return request({
    url: '/cms/biz/' + indexBizId,
    method: 'get'
  })
}

// 新增业务场景
export function addBiz(data) {
  return request({
    url: '/cms/biz',
    method: 'post',
    data: data
  })
}

// 修改业务场景
export function updateBiz(data) {
  return request({
    url: '/cms/biz',
    method: 'put',
    data: data
  })
}

// 删除业务场景
export function delBiz(indexBizId) {
  return request({
    url: '/cms/biz/' + indexBizId,
    method: 'delete'
  })
}

// 导出业务场景
export function exportBiz(query) {
  return request({
    url: '/cms/biz/export',
    method: 'get',
    params: query
  })
}
