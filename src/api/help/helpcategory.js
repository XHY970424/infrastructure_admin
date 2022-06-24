import request from '@/utils/request'

// 查询帮助中心常见问题类别列表
export function listHelpcategory(query) {
  return request({
    url: '/help/helpcategory/list',
    method: 'get',
    params: query
  })
}

// 查询帮助中心常见问题类别详细
export function getHelpcategory(helpCategoryId) {
  return request({
    url: '/help/helpcategory/' + helpCategoryId,
    method: 'get'
  })
}

// 新增帮助中心常见问题类别
export function addHelpcategory(data) {
  return request({
    url: '/help/helpcategory',
    method: 'post',
    data: data
  })
}

// 修改帮助中心常见问题类别
export function updateHelpcategory(data) {
  return request({
    url: '/help/helpcategory',
    method: 'put',
    data: data
  })
}

// 删除帮助中心常见问题类别
export function delHelpcategory(helpCategoryId) {
  return request({
    url: '/help/helpcategory/' + helpCategoryId,
    method: 'delete'
  })
}

// 导出帮助中心常见问题类别
export function exportHelpcategory(query) {
  return request({
    url: '/help/helpcategory/export',
    method: 'get',
    params: query
  })
}