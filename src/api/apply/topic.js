import request from '@/utils/request'

// 查询报名课题列表
export function listTopic(query) {
  return request({
    url: '/apply/topic/list',
    method: 'get',
    params: query
  })
}

// 查询报名课题详细
export function getTopic(topicId) {
  return request({
    url: '/apply/topic/' + topicId,
    method: 'get'
  })
}

// 新增报名课题
export function addTopic(data) {
  return request({
    url: '/apply/topic',
    method: 'post',
    data: data
  })
}

// 修改报名课题
export function updateTopic(data) {
  return request({
    url: '/apply/topic',
    method: 'put',
    data: data
  })
}

// 课题状态变更
export function updateStatus(data) {
  return request({
    url: '/apply/topic/updateStatus',
    method: 'put',
    data: data
  })
}

// 课题回收站恢复
export function recover(topicId) {
  return request({
    url: '/apply/topic/recover/' + topicId,
    method: 'put'
  })
}

// 获取报名表属性配置-课题
export function topicForm(topicId) {
  return request({
    url: '/apply/formField/topicForm',
    method: 'get',
    params: {
      extendApplyForm:0,
      topicId
    }
  })
}

// 获取报名表条件配置-课题
export function queryFormCondition(topicId,projectId) {
  return request({
    url: '/apply/condition/queryFormCondition',
    method: 'get',
    params: {
      extend:0,
      topicId,
      projectId
    }
  })
}

// 获取可以设置的报名表条件
export function topicConditionField(topicId,extendApplyForm) {
  let params = {
    extendApplyForm
  }
  if(extendApplyForm == 1 ){
    params.projectId = topicId
  }else {
    params.topicId = topicId
  }
  return request({
    url: '/apply/formField/topicConditionField',
    method: 'get',
    params
  })
}

// 保存课题报名表条件
export function saveProjectCondition(data) {
  return request({
    url: '/apply/condition/saveTopicCondition',
    method: 'post',
    data
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

// 保存课题报名表
export function saveTopicApply(data) {
  console.log(data)
  return request({
    url: '/apply/formField/saveTopic/' + data.topicId,
    method: 'post',
    data:data.data
  })
}

// 删除报名课题
export function delTopic(topicId) {
  return request({
    url: '/apply/topic/' + topicId,
    method: 'delete'
  })
}

// 导出报名课题
export function exportTopic(query) {
  return request({
    url: '/apply/topic/export',
    method: 'get',
    params: query
  })
}
