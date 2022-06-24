import request from '@/utils/request'

// 创建上传视频信息
export function createVideoInfo(data) {
  return request({
    url: '/hdscene/video/createVideoUploadInfo',
    method: 'post',
    data: data
  })
}
// 获取视频播放代码
export function getPlayCode(data) {
  return request({
    url: '/hdscene/video/getPlayCode',
    method: 'post',
    data: data
  })
}
// 删除上传成功的数据
export function delVideo(videoId) {
  return request({
    url: `/video/data/success/${videoId}`,
    method: 'get',
  })
}
