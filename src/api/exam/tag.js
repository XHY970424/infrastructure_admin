import request from '@/utils/request'

// 查询试卷标签列表
export function listTag(query) {
  return request({
    url: '/eycode/papertag/list',
    method: 'get',
    params: query
  })
}

// 查询试卷标签详细
export function getPapertag(id) {
  return request({
    url: '/eycode/papertag/' + id,
    method: 'get'
  })
}

// 新增试卷标签
export function addPapertag(data) {
  return request({
    url: '/eycode/papertag',
    method: 'post',
    data: data
  })
}

// 修改试卷标签
export function updatePapertag(data) {
  return request({
    url: '/eycode/papertag',
    method: 'put',
    data: data
  })
}

// 删除试卷标签
export function delPapertag(id) {
  return request({
    url: '/eycode/papertag/' + id,
    method: 'delete'
  })
}

// 导出试卷标签
export function exportPapertag(query) {
  return request({
    url: '/eycode/papertag/export',
    method: 'get',
    params: query
  })
}

