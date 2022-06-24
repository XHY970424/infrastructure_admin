import request from '@/utils/request'

// 查询内页轮播图列表
export function listNavbanner(query) {
  return request({
    url: '/cms/navbanner/list',
    method: 'get',
    params: query
  })
}

// 查询内页轮播图详细
export function getNavbanner(navBannerId) {
  return request({
    url: '/cms/navbanner/' + navBannerId,
    method: 'get'
  })
}

// 新增内页轮播图
export function addNavbanner(data) {
  return request({
    url: '/cms/navbanner',
    method: 'post',
    data: data
  })
}

// 修改内页轮播图
export function updateNavbanner(data) {
  return request({
    url: '/cms/navbanner',
    method: 'put',
    data: data
  })
}

// 删除内页轮播图
export function delNavbanner(navBannerId) {
  return request({
    url: '/cms/navbanner/' + navBannerId,
    method: 'delete'
  })
}

// 导出内页轮播图
export function exportNavbanner(query) {
  return request({
    url: '/cms/navbanner/export',
    method: 'get',
    params: query
  })
}