import request from '@/utils/request'

// 查询讲师列表
export function listTeacher(query) {
  return request({
    url: '/eycode/teacher/list',
    method: 'get',
    params: query
  })
}

// 查询讲师详细
export function getTeacher(teacherId) {
  return request({
    url: '/eycode/teacher/' + teacherId,
    method: 'get'
  })
}

// 新增讲师
export function addTeacher(data) {
  return request({
    url: '/eycode/teacher',
    method: 'post',
    data: data
  })
}

// 修改讲师
export function updateTeacher(data) {
  return request({
    url: '/eycode/teacher',
    method: 'put',
    data: data
  })
}

// 删除讲师
export function delTeacher(teacherId) {
  return request({
    url: '/eycode/teacher/' + teacherId,
    method: 'delete'
  })
}

// 导出讲师
export function exportTeacher(query) {
  return request({
    url: '/eycode/teacher/export',
    method: 'get',
    params: query
  })
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

/**
 * 获取讲师数据 用于下拉选择
 */
export function queryTeacherList(){
  return request({
    method: 'get',
    url: '/eycode/teacher/queryTeacherList'
  });
}

/**
 * 下拉选择讲师分类
 */
 export function categoryTeacherList(){
  return request({
    method: 'get',
    url: '/resource/teachercategory/categoryTeacherList'
  });
}
