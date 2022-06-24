import request from "@/utils/request";

// 查询班级列表
export function listClass(query) {
  return request({
    url: "/eycode/class/list",
    method: "get",
    params: query
  });
}

// 查询班级列表
export function listBySpecial(query) {
  return request({
    url: "/eycode/class/listBySpecial",
    method: "get",
    params: query
  });
}

// 查询班级详细
export function getClass(id) {
  return request({
    url: "/eycode/class/" + id,
    method: "get"
  });
}

// 新增班级
export function addClass(data) {
  return request({
    url: "/eycode/class",
    method: "post",
    data: data
  });
}

// 修改班级
export function updateClass(data) {
  return request({
    url: "/eycode/class",
    method: "put",
    data: data
  });
}

// 删除班级
export function delClass(data) {
  return request({
    url: "/eycode/class/" + data,
    method: "delete"
  });
}

// 导出班级
export function exportClass(query) {
  return request({
    url: "/eycode/class/export",
    method: "get",
    params: query
  });
}

// 审核内容管理
export function auditContContents(data) {
  return request({
    url: "/eycode/class/audit",
    method: "put",
    data: data
  });
}

// 查询讲师列表
export function getTeacherList(query) {
  return request({
    url: "/eycode/teacher/list",
    method: "get",
    params: query
  });
}

// // 查询班级列表
// export function getClassBySubjectId(query) {
//   return request({
//     url: '/eycode/class/list',
//     method: 'get',
//     params: query
//   })
// }
//获取查询班主任
export function getTeacher(query) {
  return request({
    url: "/course/salesman/getTeacher",
    method: "get"
  });
}
//新接口新增班级
export function setaddClass(data) {
  return request({
    url: "/eycode/class/addClasses",
    method: "post",
    data: data
  });
}

export function getNew(query) {
  return request({
    url: "/eycode/class/new/" + query,
    method: "get"
  });
}
//修改班级
export function NewEdit(data) {
  return request({
    url: "/eycode/class/NewEdit",
    method: "put",
    data: data
  });
}
//分配班级查询
export function getAllotClass(data) {
  return request({
    url: "/eycode/class/getAllotClass",
    method: "post",
    data: data
  });
}

//新接口新增班级
export function updateAllotClass(data) {
  return request({
    url: "/eycode/class/updateAllotClass",
    method: "post",
    data: data
  });
}

export function getClassUsers(data) {
  return request({
    url: "/eycode/user/getClassUsers",
    method: "post",
    data: data
  });
}
