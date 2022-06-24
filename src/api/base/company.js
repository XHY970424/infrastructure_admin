import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

/**
 * 自定义图片上传(base64格式)
 * @param obj
 */
export function imgBase64Upload(obj) {
  let param = new FormData()
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('image', obj)
  return request({
    method: 'post',
    // 上传地址
    url: '/base/eyUsers/uploadImgBase64',
    data: param
  })
}

/**
 * 自定义图片上传(base64格式)
 * @param obj
 */
export function imgBase64PrivateUpload(obj) {
  let param = new FormData()
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('image', obj)
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadPrivateImgBase64',
    data: param
  })
}

// 查询平台企业列表
export function listCompany(query) {
  return request({
    url: '/base/company/list',
    method: 'get',
    params: query
  })
}

// 查询工匠用户列表
export function listChannelEyUsers(query) {
  return request({
    url: '/channel/info/userList',
    method: 'get',
    params: query
  })
}

// 查询企业详细
export function getCompany(userId) {
  return request({
    url: '/base/company/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 批量审核企业
export function updateAudits(data) {
  return request({
    url: '/base/company/updateAudits' ,
    method: 'post',
    data,
  })
}
// 新增企业
export function addCompany(data) {
  return request({
    url: '/base/company',
    method: 'post',
    data: data
  })
}

// 下载excel
export function GetExcelUrl(configKey) {
  return request({
    // url: `/common/configKey/${configKey}`,
    url: `/system/config/configKey/${configKey}`,
    method: 'get'
  })
}

/** =========================================================省市区 */
/**获取省市区 */
export function GetCity() {
  return request({
    method: 'get',
    url: '/common/getRegion'
  })
}

/**获取行业信息*/
export function GetTrade() {
  return request({
    method: 'get',
    url: '/base/company/getTrade'
  })
}

// 修改企业
export function updateCompany(data) {
  return request({
    url: '/base/company',
    method: 'put',
    data: data
  })
}

// 导出工匠用户
export function exportCompany(query) {
  return request({
    url: '/base/company/export',
    method: 'get',
    params: query
  })
}

// 审核企业
export function auditContContents(data) {
  return request({
    url: '/base/company/audit',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeUserStatus(companyId, status) {
  const data = {
    companyId,
    status
  }
  return request({
    url: '/base/company/changeStatus',
    method: 'put',
    data: data
  })
}

// 重置密码
export function resetPassword(userId) {
  const data = {
    userId
  }
  return request({
    url: '/base/company/resetPassword',
    method: 'put',
    data: data
  })
}

// 批量导入学员数据
export function importUserData(data) {
  return request({
    url: '/base/company/importUserData',
    method: 'POST',
    data
  })
}

// 批量导入企业数据
export function importComponyData(data) {
  return request({
    url: '/base/company/importComponyData',
    method: 'POST',
    data
  })
}

/**
 * 上传身份头像压缩包
 * @param {*} fileobj
 */
export function fileUpload(fileobj, userType) {
  let param = new FormData()
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file', fileobj.file)
  param.append('userType', userType)
  return request({
    method: 'post',
    // 上传地址
    url: '/base/company/uploadImgFile',
    // 定义上传头
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

// 按条件查询学员列表
export function queryUserList(query) {
  return request({
    url: '/base/eyUsers/queryUserList',
    method: 'get',
    params: query
  })
}

// 按条件查询可开学员列表
export function queryAddibleUserList(query) {
  return request({
    url: '/base/eyUsers/queryAddibleUserList',
    method: 'get',
    params: query
  })
}

