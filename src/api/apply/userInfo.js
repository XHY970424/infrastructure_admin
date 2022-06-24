import request from '@/utils/request'

// 查询学员报名信息列表(租户)
export function listUserInfo(query) {
  return request({
    url: '/apply/userInfo/list',
    method: 'get',
    params: query
  })
}

// 查询学员报名信息列表（分销商）
export function distributorList(query) {
  return request({
    url: '/apply/userInfo/distributorList',
    method: 'get',
    params: query
  })
}

// 查询学员报名信息详细
export function getUserInfo(userInfoId) {
  return request({
    url: '/apply/userInfo/' + userInfoId,
    method: 'get'
  })
}

// 新增学员报名信息
export function addUserInfo(data) {
  return request({
    url: '/apply/userInfo',
    method: 'post',
    data: data
  })
}

// 修改学员报名信息
export function updateUserInfo(data) {
  return request({
    url: '/apply/userInfo',
    method: 'put',
    data: data
  })
}

// 删除学员报名信息
export function delUserInfo(userInfoId) {
  return request({
    url: '/apply/userInfo/' + userInfoId,
    method: 'delete'
  })
}

// 导出学员报名信息
export function exportUserInfo(data) {
  return request({
    url: '/apply/userInfo/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 根据id数组查询报名信息
export function getApplyData(userInfoId) {
  return request({
    url: '/apply/userInfo/getApplyData/' + userInfoId,
    method: 'get'
  })
}

// 报名信息状态更改
export function updateStatus(data) {
  return request({
    url: '/apply/userInfo/updateStatus',
    method: 'put',
    data: data
  })
}

// 查询当前报名信息列表字段
export function fieldList(topicId) {
  return request({
    url: '/apply/userInfo/fieldList/' + topicId,
    method: 'get'
  })
}

/**
 * 上传证书压缩包
 * @param {*} fileobj
 */
export function fileUpload(fileobj, periodId) {
  let param = new FormData()
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file', fileobj.file)
  param.append('periodId', periodId)
  return request({
    method: 'post',
    // 上传地址
    url: '/apply/userInfo/upload',
    // 定义上传头
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

/**
 * 上传证书压缩包
 * @param {*} fileobj
 */
export function excelUpload(fileobj, periodId) {
  let param = new FormData()
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file', fileobj.file)
  param.append('periodId', periodId)
  return request({
    method: 'post',
    // 上传地址
    url: '/apply/userInfo/importUpdateStatus',
    // 定义上传头
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}


// 查询需导出附件信息
export function exportAttachment(data) {
  return request({
    url: '/apply/userInfo/exportAttachment',
    method: 'post',
    data: data
  })
}

// 查询当前课题关联的发证机构
export function getTopId(topicId) {
  return request({
    url: `/apply/userInfo/getTopId/${topicId}`,
    method: 'get',
  })
}
