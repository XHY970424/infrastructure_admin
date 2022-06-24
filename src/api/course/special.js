import request from '@/utils/request'

// 查询专题列表
export function listSpecial(query) {
  return request({
    url: '/eycode/special/list',
    method: 'get',
    params: query
  })
}

// 查询专题详细
export function getSpecial(specialId) {
  return request({
    url: '/eycode/special/' + specialId,
    method: 'get'
  })
}

// 新增专题
export function addSpecial(data) {
  return request({
    url: '/eycode/special',
    method: 'post',
    data: data
  })
}

// 修改专题
export function updateSpecial(data) {
  return request({
    url: '/eycode/special',
    method: 'put',
    data: data
  })
}

// 删除专题
export function delSpecial(specialId) {
  return request({
    url: '/eycode/special/' + specialId,
    method: 'delete'
  })
}

// 根据条件 删除/恢复 专题
export function delSpecialByData(query) {
  return request({
    url: '/eycode/special/deleteSign',
    method: 'get',
    params: query
  })
}

// 导出专题
export function exportSpecial(query) {
  return request({
    url: '/eycode/special/export',
    method: 'get',
    params: query
  })
}

// 更新排序
export function updateSpecialSort(data) {
  return request({
    url: '/eycode/special/editSort',
    method: 'put',
    data: data
  })
}

// 获取课程下拉选择数据
export function getSubject(specialId) {
  return request({
    url: '/eycode/special/getSubject',
    method: 'get',
    params: {specialId:specialId}
  })
}

// 查询讲师列表
export function getTeacherList(query) {
  return request({
    url: '/eycode/teacher/list',
    method: 'get',
    params: query
  })
}

//试题规则
export function specification(query) {
  return request({
    url: '/eycode/subject/specification',
    method: 'get',
    params: query
  })
}

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
    url: '/file/uploadImgBase64',
    data: param
  })
}

/**
 * 获取工种列表数据
 */
export function getWork() {
  return request({
    url: '/eycode/special/getWork',
    method: 'get'
  })
}

// 查询课程分类下拉树结构
export function treeselect() {
  return request({
    url: '/eycode/special/treeselect',
    method: 'get'
  })
}

export function getExamPaper() {
  return request({
    url: '/eycode/special/getExamPaper',
    method: 'get'
  })
}

// 按专题id 查询课程数据
export function queryCourseList(id) {
  return request({
    url: '/eycode/special/queryCourseList/' + id,
    method: 'get'
  })
}

// 查询可开通专题列表
export function querySpecialList(query) {
  return request({
    url: '/eycode/special/querySpecialList',
    method: 'get',
    params: query
  })
}

// 查询可展示专题列表
export function querySpecialListNoShow(query) {
  return request({
    url: '/eycode/special/querySpecialListNoShow',
    method: 'get',
    params: query
  })
}

// 修改专题状态
export function updateSpecialStatus(data) {
  return request({
    url: '/eycode/special/updateStatus',
    method: 'post',
    data: data
  })
}
