import axios from 'axios'
import { getToken } from '@/utils/auth'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
}

const baseUrl = process.env.VUE_APP_BASE_API

export function downLoadZip(str, filename) {
  var url = baseUrl + str
  axios({
    method: 'get',
    url: url,
    responseType: 'blob',
    headers: { 'Authorization': 'Bearer ' + getToken() }
  }).then(res => {
    resolveBlob(res, mimeMap.zip)
  })
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement('a')
  var blob = new Blob([res.data], { type: mimeType })
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var contentDisposition = decodeURI(res.headers['content-disposition'])
  var result = patt.exec(contentDisposition)
  var fileName = result[1]
  fileName = fileName.replace(/\"/g, '')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.appendChild(aLink)
}

//网络图片或文件压缩
export const filesToRar = (arrImages, filename) => {
  let _this = this
  let zip = new JSZip()
  let cache = {}
  let promises = []
  // _this.title = "正在加载压缩文件";
  for (let item of arrImages) {
    const promise = getImgArrayBuffer(item.url).then((data) => {
      // 下载文件, 并存成ArrayBuffer对象(blob)
      zip.file(item.name + getType(item.url), data, { binary: true }) // 逐个添加文件
      cache[item.name] = data
    })
    promises.push(promise)
  }
  Promise.all(promises)
    .then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        //   _this.title = "正在压缩";
        // 生成二进制流
        FileSaver.saveAs(content, filename) // 利用file-saver保存文件 自定义文件名
        //   _this.title = "压缩完成";
      })
    })
    .catch((res) => {
      _this.$message.error('文件压缩失败')
    })
}

// 文件后缀
function getType(file) {
  let filename = file
  let index1 = filename.lastIndexOf('.')
  let index2 = filename.length
  if (filename.indexOf('?') != -1) {
    return filename.substring(index1, filename.indexOf('?'))
  } else {
    return filename.substring(index1, index2)
  }
}

//获取文件blob
function getImgArrayBuffer(url) {
  return new Promise((resolve, reject) => {
    //通过请求获取文件blob格式
    let xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', url, true)
    xmlhttp.responseType = 'blob'
    xmlhttp.onload = function() {
      if (this.status == 200) {
        resolve(this.response)
      } else {
        reject(this.status)
      }
    }
    xmlhttp.send()
  })
}
