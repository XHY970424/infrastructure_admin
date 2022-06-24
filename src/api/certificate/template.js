import request from '@/utils/request'

// 查询证书模板列表
export function listTemplate(data) {
  return request({
    url: '/eycode/certificateTemplate/certificateTemplateList',
    method: 'post',
    data: data
  })
}

// 查询证书模板详细
export function getTemplate(id) {
  return request({
    url: '/eycode/certificateTemplate/templateDetail',
    method: 'post',
    data: {"id":id}
  })
}

// 新增证书模板
export function addTemplate(data) {
  return request({
    url: '/eycode/certificateTemplate/createCertificateTemplate',
    method: 'post',
    data: data
  })
}

// 修改证书模板
export function updateTemplate(data) {
  return request({
    url: '/eycode/certificateTemplate/updateCertificateTemplate',
    method: 'post',
    data: data
  })
}

// 删除证书模板
export function delTemplate(id) {
  return request({
    url: '/eycode/certificateTemplate/' + id,
    method: 'delete'
  })
}

// 导出证书模板
export function exportTemplate(query) {
  return request({
    url: '/eycode/certificateTemplate/export',
    method: 'get',
    params: query
  })
}

// 模板状态更改
export function updateTemplateStatus(data) {
  return request({
    url: '/eycode/certificateTemplate/updateCertificateTemplateStatus',
    method: 'post',
    data: data
  })
}

// 证书模板预览
export function pdfPreview(data) {
  return request({
    url: '/eycode/certificateTemplate/pdfPreview',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
