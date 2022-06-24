import request from '@/utils/request'

// 查询证书列表
export function listCertificate(data) {
  return request({
    url: '/eycode/certificate/certificateList',
    method: 'post',
    data: data
  })
}

// 查询证书详细
export function getCertificate(id) {
  return request({
    url: '/eycode/certificate/certificateDetail',
    method: 'post',
    data:{"id":id}
  })
}

// 新增证书
export function addCertificate(data) {
  return request({
    url: '/eycode/certificate/createCertificate',
    method: 'post',
    data: data
  })
}

// 修改证书
export function updateCertificate(data) {
  return request({
    url: '/eycode/certificate/updateCertificate',
    method: 'post',
    data: data
  })
}

// 删除证书
export function delCertificate(id) {
  return request({
    url: '/eycode/certificate/' + id,
    method: 'delete'
  })
}

// 导出证书
export function exportCertificate(query) {
  return request({
    url: '/eycode/certificate/export',
    method: 'get',
    params: query
  })
}

// 修改证书状态
export function updateCertificateStatus(data) {
  return request({
    url: '/eycode/certificate/updateCertificateStatus',
    method: 'post',
    data: data
  })
}
