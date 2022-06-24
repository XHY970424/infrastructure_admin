import request from '@/utils/request'

// 查询后台logo配置详细
export function getInfo() {
  return request({
    url: '/system/info/getInfo',
    method: 'get'
  })
}

// 修改后台logo配置
export function updateInfo(data) {
  return request({
    url: '/system/info',
    method: 'put',
    data: data
  })
}
