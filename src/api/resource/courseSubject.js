import request from "@/utils/request";

// 查询课程主题 列表
export function listCourseSubject(query) {
  return request({
    url: "/resource/courseSubject/list",
    method: "get",
    params: query
  });
}

// 查询课程主题 详细
export function getCourseSubject(id) {
  return request({
    url: "/resource/courseSubject/" + id,
    method: "get"
  });
}

// 新增课程主题
export function addCourseSubject(data) {
  return request({
    url: "/resource/courseSubject",
    method: "post",
    data: data
  });
}

// 修改课程主题
export function updateCourseSubject(data) {
  return request({
    url: "/resource/courseSubject",
    method: "put",
    data: data
  });
}

// 删除课程主题
export function delCourseSubject(id) {
  return request({
    url: "/resource/courseSubject/" + id,
    method: "delete"
  });
}
//恢复课程
export function recover(data) {
  return request({
    url: "/resource/courseSubject/recover/" + data,
    method: "put"
    // data: data
  });
}

// 课程获取讲师
export function getTeacherlist() {
  return request({
    url: "/eycode/teacher/list",
    method: "get"
  });
}

// 获取业务人员排除班主任
export function getSalesMan() {
  return request({
    url: "/course/salesman/getSalesMan",
    method: "get"
  });
}

// 上传文件
export function uploadImage(data) {
  return request({
    url: "/file/uploadFile",
    method: "post",
    data
  });
}

// 获取单个视频详细信息保存到数据库
export function saveVideoMessage(data) {
  return request({
    url: "/video/data/saveVideoMessage",
    method: "post",
    data
  });
}

// 查询课程id下的所有视频与搜索
export function quitVideo(params) {
  return request({
    url: "/video/data/quitVideo",
    method: "get",
    params
  });
}

// 单个课程章节是否替换视频内容
export function replaceVideo(data) {
  return request({
    url: `/course/section/replace/${data.videoId}/${data.sectionId}`,
    method: "post"
  });
}

// 单个课程章节小节-绑定视频
export function bindvideo(data) {
  return request({
    url: "/video/data/bindvideo",
    method: "post",
    data
  });
}

// 删除课程小节
export function removeSection(ids) {
  return request({
    url: "/course/section/removeSection/" + ids,
    method: "delete"
  });
}

// 单个课程小节配置内容
export function configure(data) {
  return request({
    url: "/course/section/configure",
    method: "post",
    data
  });
}

// 课程章节是否加锁
export function updatelock(data) {
  return request({
    url: `/course/section/updatelock/${data.lockType}/${data.courseId}`,
    method: "post"
  });
}

// 获取课程章和小节列表
export function getChapterList(subjectId) {
  return request({
    url: "/course/section/secionlist",
    method: "get",
    params: { subjectId }
  });
}

// 新增课程章节
export function addChapterItem(data) {
  return request({
    url: "/course/chapter/add",
    method: "post",
    data
  });
}

// 删除课程章节
export function removeChapterItem(ids) {
  return request({
    url: "/course/chapter/removeChapter/" + ids,
    method: "delete"
  });
}

//修改课程章节
export function editChapterItem(data) {
  return request({
    url: "course/chapter/edit",
    method: "post",
    data
  });
}

// 新试卷列表
export function exampaperList(params) {
  return request({
    url: "/eycode/exampaper/list",
    method: "get",
    params
  });
}

// 单个课程章节小节-绑定试题
export function bindQuestion(data) {
  return request({
    url: "/course/section/questions",
    method: "post",
    data
  });
}

// 删除课程小节和小章试卷
export function deleteQuestions(data) {
  return request({
    url: `/course/section/deleteQuestions/${data.sectionId}/${data.type}`,
    method: "post"
  });
}

// 课程新增步骤修改
export function changeSteps(data) {
  return request({
    url: `/course/section/lastSteps/${data.courseId}/${data.step}`,
    method: "post"
  });
}

//物理删除课程
export function getdel(ids) {
  return request({
    url: "/resource/courseSubject/del/" + ids,
    method: "delete"
  });
}

//获取问题分类
export function helpCategory(params) {
  return request({
    url: "/resource/courseSubject/helpCategory",
    method: "get"
    // params
  });
}

//获取常见问题列表
export function helpContent(params) {
  return request({
    url: `/resource/courseSubject/helpContent/${params}`,
    method: "get"
  });
}

//保存课程配置
export function getconfig(data) {
  return request({
    url: `/resource/courseSubject/config`,
    method: "put",
    data
  });
}

// 批量导入课程数据
export function importCourseData(file, method) {
  let param = new FormData()
  param.append("file", file.file)
  param.append("method", method)
  return request({
    url: '/resource/courseSubject/importCourse',
    method: 'POST',
    // 定义上传头
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param
  })
}
