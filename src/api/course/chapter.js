import request from '@/utils/request'

// 查询课程大章列表
export function listChapter(query) {
  return request({
    url: '/course/chapter/list',
    method: 'get',
    params: query
  })
}

// 查询课程大章详细
export function getChapter(id) {
  return request({
    url: '/course/chapter/' + id,
    method: 'get'
  })
}

// 新增课程大章
export function addChapter(data) {
  return request({
    url: '/course/chapter',
    method: 'post',
    data: data
  })
}

// 修改课程大章
export function updateChapter(data) {
  return request({
    url: '/course/chapter',
    method: 'put',
    data: data
  })
}

// 删除课程大章
export function delChapter(id) {
  return request({
    url: '/course/chapter/' + id,
    method: 'delete'
  })
}

// 导出课程大章
export function exportChapter(query) {
  return request({
    url: '/course/chapter/export',
    method: 'get',
    params: query
  })
}

/**
 * 获取可选试卷
 * @param {Object} id 课程id
 */
export function getPreface(id) {
  return request({
    url: '/course/chapter/getPreface/' + id,
    method: 'get',
  })
}
