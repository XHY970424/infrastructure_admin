import request from '@/utils/request'

// 查询2022-05-07业务人员记录列表
export function listSalesman(query) {
  return request({
    url: '/course/salesman/list',
    method: 'get',
    params: query
  })
}

// 查询2022-05-07业务人员记录详细
export function getSalesman(id) {
  return request({
    url: '/course/salesman/' + id,
    method: 'get'
  })
}

// 新增2022-05-07业务人员记录
export function addSalesman(data) {
  return request({
    url: '/course/salesman',
    method: 'post',
    data: data
  })
}

// 修改2022-05-07业务人员记录
export function updateSalesman(data) {
  return request({
    url: '/course/salesman',
    method: 'put',
    data: data
  })
}

// 删除2022-05-07业务人员记录
export function delSalesman(id) {
  return request({
    url: '/course/salesman/' + id,
    method: 'delete'
  })
}

// 微信二维码图片上传
export function uploadWxImg(data) {
  return request({
    url: '/file/uploadImg',
    method: 'post',
    data
  })
}
