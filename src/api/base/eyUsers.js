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

// 查询工匠用户列表
export function listEyUsers(query) {
  return request({
    url: '/base/eyUsers/list',
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

// 查询工匠用户详细
export function getEyUsers(userId) {
  return request({
    url: '/base/eyUsers/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增工匠用户
export function addEyUsers(data) {
  return request({
    url: '/base/eyUsers',
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

/**获取账号单位数据*/
export function GetAccountCompany() {
  return request({
    method: 'get',
    url: '/base/eyUsers/getCompany'
  })
}

/**获取行业信息*/
export function GetTrade() {
  return request({
    method: 'get',
    url: '/base/eyUsers/getTrade'
  })
}

// 修改工匠用户
export function updateEyUsers(data) {
  return request({
    url: '/base/eyUsers',
    method: 'put',
    data: data
  })
}

// 删除工匠用户
export function delEyUsers(userId) {
  return request({
    url: '/base/eyUsers/' + userId,
    method: 'delete'
  })
}

// 导出工匠用户
export function exportEyUsers(query) {
  return request({
    url: '/base/eyUsers/export',
    method: 'get',
    params: query
  })
}

// 审核内容管理
export function auditContContents(data) {
  return request({
    url: '/base/eyUsers/audit',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/base/eyUsers/changeStatus',
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
    url: '/base/eyUsers/resetPassword',
    method: 'put',
    data: data
  })
}

// 批量导入学员数据
export function importUserData(data) {
  return request({
    url: '/base/eyUsers/importUserData',
    method: 'POST',
    data
  })
}

// 批量导入企业数据
export function importComponyData(data) {
  return request({
    url: '/base/eyUsers/importComponyData',
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
    url: '/base/eyUsers/uploadImgFile',
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

/**
 * 自定义图片上传(base64格式)
 * @param obj
 */
export function imgBase64UploadPrivate(obj) {
  let param = new FormData()
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('image', obj)
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadPrivateImgBase64',
    data: param,
  })
}

  /**
   * 批量审核用户
   * @param data
   */
export function updateAudits(data) {
  return request({
    // 批量审核地址
    url: '/base/eyUsers/updateAudits',
    method: 'post',
    data,
    })
}
