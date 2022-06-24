import request from '@/utils/request'

// 查询新试卷列表
export function listExampaper(query) {
  return request({
    url: '/eycode/exampaper/list',
    method: 'get',
    params: query
  })
}

// 查询新试卷详细
export function getExampaper(id) {
  return request({
    url: '/eycode/exampaper/' + id,
    method: 'get'
  })
}

// 新增新试卷
export function addExampaper(data) {
  return request({
    url: '/eycode/exampaper',
    method: 'post',
    data: data
  })
}

// 修改新试卷
export function updateExampaper(data) {
  return request({
    url: '/eycode/exampaper',
    method: 'put',
    data: data
  })
}

// 删除新试卷
export function delExampaper(id) {
  return request({
    url: '/eycode/exampaper/' + id,
    method: 'delete'
  })
}

// 导出新试卷
export function exportExampaper(query) {
  return request({
    url: '/eycode/exampaper/export',
    method: 'get',
    params: query
  })
}

// 查询题库列表(用于选择)
export function getPrefaces() {
  return request({
    url: '/eycode/exampaper/getPrefaces',
    method: 'get'
  })
}
// 查询试卷标签列表(用于选择)
export function getTag() {
  return request({
    url: '/eycode/exampaper/getTag',
    method: 'get'
  })
}

/**
 * 获取题库下的章
 * @param {Object} id 题库id
 */
export function getExamination(id){
  return request({
    url: '/eycode/exampaper/getExamination/' + id ,
    method: 'get'
  })
}

/**
 * 获取题库下的小节
 * @param {Object} id 题库下 章id
 */
export function getExaminationChild(id){
  return request({
    url: '/eycode/exampaper/getExaminationChild/' + id ,
    method: 'get'
  })
}
