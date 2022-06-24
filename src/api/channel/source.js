import request from '@/utils/request'

// 查询渠道来源列表
export function listSource(query) {
  return request({
    url: '/channel/source/list',
    method: 'get',
    params: query
  })
}

// 查询渠道来源详细
export function getSource(channelSourceId) {
  return request({
    url: '/channel/source/' + channelSourceId,
    method: 'get'
  })
}

// 新增渠道来源
export function addSource(data) {
  return request({
    url: '/channel/source',
    method: 'post',
    data: data
  })
}

// 修改渠道来源
export function updateSource(data) {
  return request({
    url: '/channel/source',
    method: 'put',
    data: data
  })
}

// 删除渠道来源
export function delSource(channelSourceId) {
  return request({
    url: '/channel/source/' + channelSourceId,
    method: 'delete'
  })
}

// 导出渠道来源
export function exportSource(query) {
  return request({
    url: '/channel/source/export',
    method: 'get',
    params: query
  })
}
