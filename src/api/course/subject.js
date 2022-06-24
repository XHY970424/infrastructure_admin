import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询课程主题 列表
export function listSubject(query) {
  return request({
    url: '/eycode/subject/list',
    method: 'get',
    params: query
  })
}

// 查询课程主题 详细
export function getSubject(id) {
  return request({
    url: '/eycode/subject/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增课程主题
export function addSubject(data) {
  return request({
    url: '/eycode/subject',
    method: 'post',
    data: data
  })
}

// 修改课程主题
export function updateSubject(data) {
  return request({
    url: '/eycode/subject',
    method: 'put',
    data: data
  })
}

// 修改课程主题排序
export function updateSubjectSort(data) {
  return request({
    url: '/eycode/subject/editSort',
    method: 'put',
    data: data
  })
}

// 删除课程主题
export function delSubject(id) {
  return request({
    url: '/eycode/subject/' + id,
    method: 'delete'
  })
}

// 逻辑删除课程主题
export function deleteTime(query) {
  return request({
    url: '/eycode/subject/deleteTime',
    method: 'get',
    params: query
  })
}

// 导出课程主题
export function exportSubject(query) {
  return request({
    url: '/eycode/subject/export',
    method: 'get',
    params: query
  })
}


/**
 * 自定义图片上传
 * @param {*} fileobj
 */
export function fileUpload(fileobj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file',fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadImg',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  });
}

/**
 * 自定义图片上传(base64格式)
 * @param obj
 */
export function imgBase64Upload(obj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('image',obj);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadImgBase64',
    data: param
  });
}

// 查询课程主题 列表
export function getCategoryList() {
  return request({
    url: '/eycode/category/getList',
    method: 'get',
  })
}


// 查询工匠学堂教材列表
export function getBookList(query) {
  return request({
    url: '/eycode/book/list',
    method: 'get',
    params: query
  })
}

// 查询工匠学堂教材列表
export function bookList(query) {
  return request({
    url: '/eycode/book/bookList',
    method: 'get',
    params: query
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


// 查询班级列表
export function getClassList(query) {
  return request({
    url: '/eycode/class/getList',
    method: 'get',
    params: query
  })
}

//试题规则
export function specification(query){
  return request({
    url: '/eycode/subject/specification',
    method: 'get',
    params: query
  })
}

//修改课程-》教材回显
export function editBookList(query){
  return request({
    url: '/eycode/subjectbook/editList',
    method: 'get',
    params: query
  })
}

/**
 * 自定义pdf文件上传
 * @param {*} fileobj
 */
export function fileUpload2(fileobj){
  let param = new FormData();
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file',fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/file/uploadPDF',
    // 定义上传头
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  });
}

// 推送课程
export function apiPushSubject(ids){
  return request({
    url: '/eycode/subject/push/' + ids,
    method: 'get',
  })
}

// 推送所有未推送课程
export function apiPushAllSubject(){
  return request({
    url: '/eycode/subject/pushAll',
    method: 'get',
  })
}

/**
 * 获取试卷下拉选择
 */
export function getPreface(){
  return request({
    url: '/eycode/subject/getPreface',
    method: 'get',
  })
}

// 查询可开通课程列表
export function queryCourseList(query) {
  return request({
    url: '/eycode/subject/queryCourseList',
    method: 'get',
    params: query
  })
}

// 查询可开通课程列表
export function queryCourseListNew() {
  return request({
    url: '/eycode/subject/queryCourseListNew',
    method: 'get'
  })
}

// 批量导入课程数据
export function importCourseData(data) {
  return request({
    url: '/eycode/subject/importCourse',
    method: 'POST',
    data
  })
}

/**
 * 上传封面图压缩包
 * @param {*} fileobj
 */
export function fileImgUpload(fileobj) {
  let param = new FormData()
  // 上传文件对象 名称 file与后台控制器参数要一致
  param.append('file', fileobj.file);
  return request({
    method: 'post',
    // 上传地址
    url: '/eycode/subject/uploadImgFile',
    // 定义上传头
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}

// 修改课程状态
export function updateCourseStatus(data) {
  return request({
    url: '/eycode/subject/updateStatus',
    method: 'post',
    data: data
  })
}
