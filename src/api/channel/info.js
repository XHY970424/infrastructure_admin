import request from '@/utils/request'

// 查询邀请码
export function getCode() {
  return request({
    url: '/channel/info/getCode',
    method: 'get'
  })
}

// 查询生成海报的底图
export function getPoster() {
  return request({
    url: '/channel/info/getPoster',
    method: 'get'
  })
}
