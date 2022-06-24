import request from '@/utils/request'

// 查询帮助中心内容列表
export function listHelpcontent(query) {
  return request({
    url: '/help/helpcontent/list',
    method: 'get',
    params: query
  })
}

// 查询帮助中心内容详细
export function getHelpcontent(helpContentId) {
  return request({
    url: '/help/helpcontent/' + helpContentId,
    method: 'get'
  })
}

// 新增帮助中心内容
export function addHelpcontent(data) {
  return request({
    url: '/help/helpcontent',
    method: 'post',
    data: data
  })
}

// 修改帮助中心内容
export function updateHelpcontent(data) {
  return request({
    url: '/help/helpcontent',
    method: 'put',
    data: data
  })
}

// 删除帮助中心内容
export function delHelpcontent(helpContentId) {
  return request({
    url: '/help/helpcontent/' + helpContentId,
    method: 'delete'
  })
}

// 导出帮助中心内容
export function exportHelpcontent(query) {
  return request({
    url: '/help/helpcontent/export',
    method: 'get',
    params: query
  })
}

// 获取类别
export function getHelpCategory() {
  return request({
    url: '/help/helpcontent/getCategory',
    method: 'get'
  })
}

// 修改帮助中心内容
export function upDownData(data) {
  return request({
    url: '/help/helpcontent/upDownData',
    method: 'post',
    data: data
  })
}
