import request from '@/utils/request';

// 后台接口
export function shellSys() {
  return request({
    url: 'http://apitest.jzgjzj.com/shell/sys',
    method: 'get'
  })
}

// 后台前端
export function shellSysUI() {
  return request({
    url: 'http://apitest.jzgjzj.com/shell/sysUI',
    method: 'get'
  })
}

// PC网站前端
export function shellPC() {
  return request({
    url: 'http://apitest.jzgjzj.com/shell/pc',
    method: 'get'
  })
}
