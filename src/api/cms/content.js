import request from '@/utils/request'

// 查询新闻资讯栏目数据列表
export function listContent(query) {
  return request({
    url: '/cms/content/list',
    method: 'get',
    params: query
  })
}

// 查询新闻资讯栏目数据详细
export function getContent(indexContentId) {
  return request({
    url: '/cms/content/' + indexContentId,
    method: 'get'
  })
}

// 新增新闻资讯栏目数据
export function addContent(data) {
  return request({
    url: '/cms/content',
    method: 'post',
    data: data
  })
}

// 修改新闻资讯栏目数据
export function updateContent(data) {
  return request({
    url: '/cms/content',
    method: 'put',
    data: data
  })
}

// 删除新闻资讯栏目数据
export function delContent(indexContentId) {
  return request({
    url: '/cms/content/' + indexContentId,
    method: 'delete'
  })
}

// 导出新闻资讯栏目数据
export function exportContent(query) {
  return request({
    url: '/cms/content/export',
    method: 'get',
    params: query
  })
}