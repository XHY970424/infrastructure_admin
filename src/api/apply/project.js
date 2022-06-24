import request from '@/utils/request'

// 查询报名项目列表
export function listProject(query) {
  return request({
    url: '/apply/project/list',
    method: 'get',
    params: query
  })
}

// 查询报名项目详细
export function getProject(projectId) {
  return request({
    url: '/apply/project/' + projectId,
    method: 'get'
  })
}

// 新增报名项目
export function addProject(data) {
  return request({
    url: '/apply/project',
    method: 'post',
    data: data
  })
}

// 修改报名项目
export function updateProject(data) {
  return request({
    url: '/apply/project',
    method: 'put',
    data: data
  })
}

// 项目状态变更
export function updateStatus(data) {
  return request({
    url: '/apply/project/updateStatus',
    method: 'put',
    data: data
  })
}

// 项目回收站恢复
export function recover(projectId) {
  return request({
    url: '/apply/project/recover/' + projectId,
    method: 'put'
  })
}

// 删除报名项目
export function delProject(projectId) {
  return request({
    url: '/apply/project/' + projectId,
    method: 'delete'
  })
}

// 获取报名表属性配置-项目
export function topicForm(projectId) {
  return request({
    url: '/apply/formField/topicForm',
    method: 'get',
    params: {
      extendApplyForm:1,
      projectId
    }
  })
}

// 获取报名表条件配置-项目
export function queryFormCondition(projectId) {
  return request({
    url: '/apply/condition/queryFormCondition',
    method: 'get',
    params: {
      extend:1,
      projectId
    }
  })
}

// 获取可以设置的报名表条件
export function topicConditionField(projectId) {
  return request({
    url: '/apply/formField/topicConditionField',
    method: 'get',
    params:{
      projectId,
      extendApplyForm:1
    }
  })
}

// 获取动态表单属性配置-全部
export function queryAllGroupByColumn() {
  return request({
    url: '/apply/field/queryAllGroupByColumn',
    method: 'get'
  })
}

// 保存项目报名表条件
export function saveProjectCondition(data) {
  return request({
    url: '/apply/condition/saveProjectCondition',
    method: 'post',
    data
  })
}

// 保存项目报名表
export function saveProjectApply(data) {
  return request({
    url: '/apply/formField/saveProject/' + data.projectId,
    method: 'post',
    data:data.data
  })
}

// 获取动态表单选项字典
export function treeList(query) {
  return request({
    url: '/apply/dict/treeList/' + query.fieldDictId,
    method: 'get',
    params: query
  })
}

// 导出报名项目
export function exportProject(query) {
  return request({
    url: '/apply/project/export',
    method: 'get',
    params: query
  })
}