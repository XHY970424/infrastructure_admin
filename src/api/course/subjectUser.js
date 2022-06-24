import request from '@/utils/request'

// 查询课程人员管理关联列表
export function listUser(query) {
  return request({
    url: '/eycode/user/list',
    method: 'get',
    params: query
  })
}

// 查询课程人员管理关联详细
export function getUser(id) {
  return request({
    url: '/eycode/user/' + id,
    method: 'get'
  })
}

// 新增课程人员管理关联
export function addUser(data) {
  return request({
    url: '/eycode/user',
    method: 'post',
    data: data
  })
}

// 修改课程人员管理关联
export function updateUser(data) {
  return request({
    url: '/eycode/user',
    method: 'put',
    data: data
  })
}

// 删除课程人员管理关联
export function delUser(id) {
  return request({
    url: '/eycode/user/' + id,
    method: 'delete'
  })
}

// 导出课程人员管理关联
export function exportUser(query) {
  return request({
    url: '/eycode/user/export',
    method: 'get',
    params: query
  })
}

//逻辑删除
export function updateUserStatus(data) {
  return request({
    url: '/eycode/user/update',
    method: 'put',
    data: data
  })
}

// 根据课程id 获取该课程关联的班级
export function getClassData(subjectId){
return request({
    url: '/eycode/user/getClass/' + subjectId,
    method: 'get'
  })
}
