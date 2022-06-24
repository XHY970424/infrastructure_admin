import request from '@/utils/request'

// 查询班级学员集成列表
export function fileUploadImg(data) {
  return request({
    url: '/file/uploadImg',
    method: 'post',
    data
  })
}