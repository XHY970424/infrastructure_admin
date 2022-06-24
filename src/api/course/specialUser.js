import request from '@/utils/request'

// 查询专题学员关联列表
export function listSpecialUser(query) {
  return request({
    url: '/eycode/specialuser/list',
    method: 'get',
    params: query
  })
}

// 查询专题下的所有班级(用于筛选学员)
export function getClassBySpecial(specialId) {
  return request({
    url: '/eycode/specialuser/getClass/' + specialId,
    method: 'get'
  })
}

// 导出数据
export function exportSpecialUser(query) {
  return request({
    url: '/eycode/specialuser/export',
    method: 'get',
    params: query
  })
}
