import request from '@/utils/request'

// 查询试题管理列表
export function listQuestions(query) {
  return request({
    url: '/exam/questions/list',
    method: 'get',
    params: query
  })
}

// 查询试题管理详细
export function getQuestions(id) {
  return request({
    url: '/exam/questions/' + id,
    method: 'get'
  })
}

// 新增试题管理
export function addQuestions(data) {
  return request({
    url: '/exam/questions',
    method: 'post',
    data: data
  })
}

// 修改试题管理
export function updateQuestions(data) {
  return request({
    url: '/exam/questions',
    method: 'put',
    data: data
  })
}

// 删除试题管理
export function delQuestions(id) {
  return request({
    url: '/exam/questions/' + id,
    method: 'delete'
  })
}

// 导出试题管理
export function exportQuestions(query) {
  return request({
    url: '/exam/questions/export',
    method: 'get',
    params: query
  })
}

// 试卷下拉选择
export function selectExamination(query) {
  return request({
    url: '/exam/examination/selectExamination',
    method: 'get',
    params: query
  })
}

// 批量上传题库
export function importExam(data) {
  return request({
    url: '/exam/preface/importExam',
    method: 'post',
    data: data
  })
}
