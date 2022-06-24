import request from '@/utils/request'

// 查询建筑工种列表
export function listCraft(query) {
  return request({
    url: '/craftschool/craft/list',
    method: 'get',
    params: query
  })
}

// 查询建筑工种详细
export function getCraft(id) {
  return request({
    url: '/craftschool/craft/' + id,
    method: 'get'
  })
}

// 新增建筑工种
export function addCraft(data) {
  return request({
    url: '/craftschool/craft',
    method: 'post',
    data: data
  })
}

// 修改建筑工种
export function updateCraft(data) {
  return request({
    url: '/craftschool/craft',
    method: 'put',
    data: data
  })
}

// 删除建筑工种
export function delCraft(id) {
  return request({
    url: '/craftschool/craft/' + id,
    method: 'delete'
  })
}

// 导出建筑工种
export function exportCraft(query) {
  return request({
    url: '/craftschool/craft/export',
    method: 'get',
    params: query
  })
}

// 工种下拉列表
export function optionselect() {
  return request({
    url: '/craftschool/craft/optionselect',
    method: 'get'
  })
}
