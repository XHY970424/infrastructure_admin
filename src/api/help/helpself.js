import request from '@/utils/request'

// 查询帮助中心自助服务列表
export function listHelpself(query) {
  return request({
    url: '/help/helpself/list',
    method: 'get',
    params: query
  })
}

// 查询帮助中心自助服务详细
export function getHelpself(helpSelfId) {
  return request({
    url: '/help/helpself/' + helpSelfId,
    method: 'get'
  })
}

// 新增帮助中心自助服务
export function addHelpself(data) {
  return request({
    url: '/help/helpself',
    method: 'post',
    data: data
  })
}

// 修改帮助中心自助服务
export function updateHelpself(data) {
  return request({
    url: '/help/helpself',
    method: 'put',
    data: data
  })
}

// 删除帮助中心自助服务
export function delHelpself(helpSelfId) {
  return request({
    url: '/help/helpself/' + helpSelfId,
    method: 'delete'
  })
}

// 导出帮助中心自助服务
export function exportHelpself(query) {
  return request({
    url: '/help/helpself/export',
    method: 'get',
    params: query
  })
}