import request from '@/utils/request'

// 查询渠道海报底图列表
export function listPoster(query) {
  return request({
    url: '/channel/poster/list',
    method: 'get',
    params: query
  })
}

// 查询渠道海报底图详细
export function getPoster(channelPosterId) {
  return request({
    url: '/channel/poster/' + channelPosterId,
    method: 'get'
  })
}

// 新增渠道海报底图
export function addPoster(data) {
  return request({
    url: '/channel/poster',
    method: 'post',
    data: data
  })
}

// 修改渠道海报底图
export function updatePoster(data) {
  return request({
    url: '/channel/poster',
    method: 'put',
    data: data
  })
}

// 删除渠道海报底图
export function delPoster(channelPosterId) {
  return request({
    url: '/channel/poster/' + channelPosterId,
    method: 'delete'
  })
}

// 导出渠道海报底图
export function exportPoster(query) {
  return request({
    url: '/channel/poster/export',
    method: 'get',
    params: query
  })
}