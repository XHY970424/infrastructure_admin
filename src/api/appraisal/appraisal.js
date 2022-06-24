import request from '@/utils/request'

// 测评配置获取企业
export function getCompany(query) {
  return request({
    url: '/appraisal/appraisalConfig/getCompany',
    method: 'get',
    params: query
  })
}

// 创建测评
export function appraisal(data) {
  return request({
    url: '/appraisal/appraisal',
    method: 'post',
    data: data
  })
}
//获取测评信息
export function getappraisal(query) {
  return request({
    url: '/appraisal/appraisal/'+query,
    method: 'get',
    // params: query
  })
}
//更新测评
export function putappraisal(data) {
  return request({
    url: '/appraisal/appraisal',
    method: 'put',
    data: data
  })
}

// 添加测评配置信息
export function appraisalConfig(data) {
  return request({
    url: '/appraisal/appraisalConfig',
    method: 'post',
    data: data
  })
}

//获取测评配置信息
export function getConfig(query) {
  return request({
    url: '/appraisal/appraisalConfig/'+query,
    method: 'get',
    // params: query
  })
}
//修改测评配置
export function putConfig(data) {
  return request({
    url: '/appraisal/appraisalConfig',
    method: 'put',
    data: data
  })
}

//测评列表
export function getlist(query) {
  return request({
    url: '/appraisal/appraisal/list',
    method: 'get',
    params: query
  })
}

// 更改测评发布状态
export function updStatus(data) {
  return request({
    url: '/appraisal/appraisal/publishStatus',
    method: 'post',
    data: data
  })
}
// 删除测评
export function delStatus(data) {
  return request({
    url: '/appraisal/appraisal/'+data,
    method: 'delete',
  })
}
// 恢复测评
export function recover(data) {
  return request({
    url: '/appraisal/appraisal/recover',
    method: 'post',
    data: data
  })
}

//复制测评
export function getcopy(query) {
  return request({
    url: '/appraisal/appraisal/copy/'+query,
    method: 'get',
    // params: query
  })
}

//获取导入测评题目模板链接
export function getExcelConfig(query) {
  return request({
    url: '/appraisal/appraisal/getExcelConfig',
    method: 'get',
  })
}

//数据概况
export function getsurvey(query) {
  return request({
    url: '/appraisal/statistics/survey/'+query,
    method: 'get',
  })
}

//统计详情企业数据
export function companyStatistics(query) {
  return request({
    url: '/appraisal/statistics/companyStatistics',
    method: 'get',
    params: query
  })
}

//统计 数据详情用户列表
export function userStatistics(query) {
  return request({
    url: '/appraisal/statistics/userStatistics',
    method: 'get',
    params: query
  })
}

//统计 数据详情用户列表
export function statisticsMap(query) {
  return request({
    url: '/appraisal/statistics/statisticsMap/'+query,
    method: 'get',
  })
}

// 导出用户详情
export function exportUserStatistics(query) {
  return request({
    url: '/appraisal/statistics/export',
    method: 'get',
    params: query
  })
}


// 个人报告数据
export function personReport(query) {
  return request({
    url: '/appraisal/statistics/personReport/'+query,
    method: 'get',
  })
}

