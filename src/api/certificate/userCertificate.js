import request from '@/utils/request'

// 查询用户证书列表
export function listCertificate(data) {
  return request({
    url: '/eycode/userCertificate/userCertificateList',
    method: 'post',
    data: data
  })
}

// 查询用户证书详细
export function getCertificate(id) {
  return request({
    url: '/eycode/userCertificate/userCertificateDetail',
    method: 'post',
    data: {id:id}
  })
}

// 新增用户证书
export function addCertificate(data) {
  return request({
    url: '/certificate/userCertificate',
    method: 'post',
    data: data
  })
}

// 修改用户证书
export function updateCertificate(data) {
  return request({
    url: '/certificate/userCertificate',
    method: 'put',
    data: data
  })
}

// 删除用户证书
export function delCertificate(id) {
  return request({
    url: '/certificate/userCertificate/' + id,
    method: 'delete'
  })
}

// 导出用户证书
export function exportCertificate(query) {
  return request({
    url: '/certificate/userCertificate/export',
    method: 'get',
    params: query
  })
}

// 用户证书状态修改
export function updateStatus(data) {
  return request({
    url: '/eycode/userCertificate/updateStatus',
    method: 'post',
    data: data
  })
}

// 上传用户证书
export function uploadUserCertificate(data) {
  return request({
    url: '/eycode/userCertificate/uploadUserCertificate',
    method: 'post',
    data: data
  })
}
