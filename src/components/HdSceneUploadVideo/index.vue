<template>
  <div class="container">
    <div class="upload">
      <el-row>
        <el-col :span="8">
          <el-upload
            class="upload-demo"
            action="no"
            list-type="picture"
            drag
            :multiple="false"
            :http-request="importFile"
            :on-change="fileChange"
            :on-remove="onRemove"
            :file-list="fileList"
            :accept="allowVideoTypes"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              提示：仅允许上传视频格式文件！
            </div>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <label class="status" style=""
            >上传状态: <span>{{ statusText }}</span></label
          >
        </el-col>
      </el-row>
      <div class="upload-name" v-show="baseInfo.fileName">{{baseInfo.fileName}}</div>
      <div class="upload-type">
        上传:
        <el-button type="primary" @click="authUpload" :disabled="uploadDisabled"
          >开始上传</el-button
        >
        <span class="progress"
          >上传进度: <i id="auth-progress">{{ authProgress }}</i> %</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { createVideoInfo, getPlayCode } from "@/api/course/scene";
import axios from "axios";

export default {
  name: "SceneUploadVideo",
  data() {
    return {
      statusText: "",
      timeout: "",
      partSize: "",
      parallel: "",
      retryCount: "",
      retryDuration: "",
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      // 创建视频信息接口请求值
      baseInfo: {
        title: "",
        tag: "",
        fileName: "",
        fileSize: 0,
      },
      //本地视频文件
      fileList: [],
      //视频格式
      allowVideoTypes:
        ".wmv,.wm,.asf,.asx,.rm,.rmvb,.ra,.ram,.mpg,.mpeg,.mpe,.vob,.dat,.mov,.3gp,.mp4,.mp4v,.m4v,.mkv,.avi,.flv,.f4v,.mts,.m2t",
      // 创建视频信息返回值
      uploadInfo: {
        // 文件内容块上传接口
        chunkUrl: "",
        // 文件状态及断点位置查询接口地址
        metaUrl: "",
        // 服务类型
        serviceType: "",
        // 用户id
        userId: "",
        // 视频id
        videoId: "",
        // 分类id
        categoryId: "",
      },
      // 已上传的字节
      uploadByte: 0,
      // 每块最大字节
      maxChunkSize: 4 * 1024 * 1024,
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      this.fileList = [];
    },
    //删除
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    importFile() {},
    // 创建视频信息
    uploadVideo() {
      let resData;
      return new Promise((resolve) => {
        // 发送请求 创建上传视频信息
        createVideoInfo(this.baseInfo).then((res) => {
          if (res.code === 200) {
            this.uploadInfo = res.data;
          }
          resData = res;
          resolve(resData);
        });
      });
    },
    // 选中文件后的事件
    fileChange(fileObj, fileList) {
      this.file = fileObj.raw;
      if (!this.file) {
        this.msgError("请选择文件");
        return false;
      }
      // 验证文件是否可以上传
      let fileType = this.file.name.split(".").pop().toLowerCase();

      let allowVideoTypes =
        ",wmv,wm,asf,asx,rm,rmvb,ra,ram,mpg,mpeg,mpe,vob,dat,mov,3gp,mp4,mp4v,m4v,mkv,avi,flv,f4v,mts,m2t,";
      if (allowVideoTypes.indexOf("," + fileType + ",") < 0) {
        this.msgError("请选择视频文件");
        return false;
      }
      // 获取文件名 去除后缀
      let fileName = this.file.name.substring(
        0,
        this.file.name.lastIndexOf(".")
      );
      this.file.fileName = fileName;
      // 配置创建视频信息参数
      this.baseInfo.fileName = this.file.name;
      this.baseInfo.fileSize = this.file.size;
      this.baseInfo.title = fileName;
      this.resetInfo();
      // 开始上传按钮可用
      this.uploadDisabled = false;

      // let url = URL.createObjectURL(this.file)
      // let audioElement = new Audio(url);
      // audioElement.addEventListener('loadedmetadata', () => {
      //   // 获取当前视频时长
      //   let playTime = audioElement.duration
      //   // this.form.durationTime = parseInt(playTime)
      //   this.$emit('changePlayTime', parseInt(playTime))
      // })
      this.fileList = fileList
    },
    // 点击上传文件事件
    authUpload() {
      // 判断是否已创建上传视频信息
      if (this.uploadInfo.chunkUrl !== "") {
        // 已创建 直接发送请求获取上传状态及断点位置
        this.uploadDisabled = false;
        this.queryInfo();
      } else {
        // 创建上传视频信息
        this.uploadVideo().then((resData) => {
          if (resData.code === 200) {
            this.uploadDisabled = false;
            let promise = this.queryInfo();
            this.checkStatus(promise);
          } else {
            this.msgError(resData.msg);
          }
        });
      }
    },
    // 发送请求查询⽂件上传状态及断点位置
    queryInfo() {
      let queryParams = {
        ccvid: this.uploadInfo.videoId,
        uid: this.uploadInfo.userId,
        filename: this.file.name,
        filesize: this.file.size,
        servicetype: this.uploadInfo.serviceType,
      };
      return new Promise((resolve, reject) => {
        axios
          .get(this.uploadInfo.metaUrl, {
            params: queryParams,
          })
          .then((res) => {
            if (res.status === 200) {
              resolve(res);
            }
          });
      });
    },
    // 判断查询文件状态
    checkStatus(promise) {
      promise.then((queryDataInfo) => {
        if (queryDataInfo.status === 200) {
          // 获取成功 判断状态
          let infoData = queryDataInfo.data;
          // 上传状态中
          switch (infoData.result) {
            case 0:
              // 成功获取断点位置
              // 设置上传点
              this.uploadByte = parseInt(infoData.received);
              this.chunkFileUpload();
              break;
            case 1:
              // 文件已全部上传成功
              this.statusText = "上传成功";
              this.uploadDisabled = true;
              this.authProgress = 100;
              break;
            case -1:
              // 上传失败 可放弃本次上传,不重试
              this.msgError("上传失败!");
              this.resetInfo();
              break;
            case -2:
            // 服务器内部错误 可以续传重试
            case -3:
              // 请求参数错误
              this.msgError("上传失败!请重试");
              this.uploadDisabled = false;
              break;
          }
        } else {
          this.msgError(queryDataInfo.statusText);
        }
      });
    },
    // 分块上传
    chunkFileUpload() {
      this.uploadDisabled = true;
      let range;
      if (this.uploadByte + this.maxChunkSize > this.file.size) {
        range = this.file.size;
      } else {
        range = this.uploadByte + this.maxChunkSize;
      }
      let requestOpt = {
        blob: this.file.slice(this.uploadByte, range),
      };
      requestOpt.chunkSize = requestOpt.blob.size;
      // 本次上传range范围
      requestOpt.contentRange =
        "bytes " + this.uploadByte + "-" + (range - 1) + "/" + this.file.size;
      const formData = new FormData();
      formData.append("file", requestOpt.blob, this.file.name);
      axios
        .post(
          this.uploadInfo.chunkUrl + "?ccvid=" + this.uploadInfo.videoId,
          formData,
          {
            headers: {
              "Content-Range": requestOpt.contentRange,
              "Content-Disposition":
                'attachment; filename="' + encodeURI(this.file.fileName) + '"',
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            switch (res.data.result) {
              case 0:
                // 本次块文件上传成功
                this.uploadByte = parseInt(res.data.received);
                // 设置进度
                this.setProgress(res.data.received);
                this.chunkFileUpload();
                break;
              case 1:
                // 文件完成
                this.statusText = "上传成功";
                this.uploadDisabled = true;
                this.authProgress = 100;
                // 获取视频播放代码
                this.playCode();
                break;
              case -1:
                // 上传失败 放弃本次上传 不再重试
                this.msgError("上传失败!");
                this.resetInfo();
                break;
              case -2:
              case -3:
                this.msgError("上传失败!请重试");
                break;
            }
          }
        });
    },
    // 重置上传视频信息
    resetInfo() {
      this.uploadInfo = {
        // 文件内容块上传接口
        chunkUrl: "",
        // 文件状态及断点位置查询接口地址
        metaUrl: "",
        // 服务类型
        serviceType: "",
        // 用户id
        userId: "",
        // 视频id
        videoId: "",
        // 分类id
        categoryId: "",
      };
      this.uploadByte = 0;
      this.uploadDisabled = true;
      this.authProgress = 0;
      this.statusText = "";
    },
    // 获取进度
    setProgress(currentSize) {
      this.authProgress = Math.floor((currentSize / this.file.size) * 100);
    },
    // 获取视频播放代码
    playCode() {
      let reqData = {
        videoId: this.uploadInfo.videoId,
      };
      getPlayCode(reqData).then((res) => {
        if (res.code === 200) {
          this.$emit("changeVideo", res.msg, this.uploadInfo.videoId);
        } else {
          this.msgError(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.upload-name{
  margin-top: 20px;
}
.upload-type{
  margin-top: 20px;
}
</style>
