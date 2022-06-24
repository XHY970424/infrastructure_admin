import request from '@/utils/request'

// 查询证书分类列表
export function listCategory(query) {
  return request({
    url: '/eycode/certificateCategory/list',
    method: 'get',
    params: query
  })
}

// 查询证书分类详细
export function getCategory(id) {
  return request({
    url: '/eycode/certificateCategory/' + id,
    method: 'get'
  })
}

// 新增证书分类
export function addCategory(data) {
  return request({
    url: '/eycode/certificateCategory',
    method: 'post',
    data: data
  })
}

// 修改证书分类
export function updateCategory(data) {
  return request({
    url: '/eycode/certificateCategory',
    method: 'put',
    data: data
  })
}

// 删除证书分类
export function delCategory(id) {
  return request({
    url: '/eycode/certificateCategory/' + id,
    method: 'delete'
  })
}

// 导出证书分类
export function exportCategory(query) {
  return request({
    url: '/eycode/certificateCategory/export',
    method: 'get',
    params: query
  })
}
