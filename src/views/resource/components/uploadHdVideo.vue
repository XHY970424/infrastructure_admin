<template>
  <div class="upload">
    <el-row type="flex" align="middle">
      <el-col :span="10">
        <el-upload
          class="upload-demo"
          action="no"
          list-type="picture"
          drag
          :multiple="true"
          :http-request="importFile"
          :on-change="fileChange"
          :file-list="fileList"
          :accept="allowVideoTypes"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <div
          class="tips"
          style="color: #999; fontsize: 16px; margin-bottom: 10px"
        >
          支持批量上传,上传格式{{ allowVideoTypes }}文件
        </div>
        <el-table :data="list" border height="300" :row-style="showRow">
          <el-table-column label="文件名" align="center" prop="fileName" />
          <el-table-column label="大小" align="center" prop="size" width="80" />
          <el-table-column label="状态" align="center" prop="statusText">
            <template slot-scope="scope">
              <div class="flex flex-center flex-jcenter" style="width: 100%">
                <i
                  class="el-icon-time"
                  style="color: #909399"
                  v-show="!scope.row.result && scope.row.result != 0"
                ></i>
                <i
                  class="el-icon-loading"
                  style="color: #409eff"
                  v-show="scope.row.result == 0"
                ></i>
                <i
                  class="el-icon-success"
                  style="color: #67c23a"
                  v-show="scope.row.result == 1"
                ></i>
                <i
                  class="el-icon-error"
                  style="color: #f56c6c"
                  v-show="
                    scope.row.result == -1 ||
                    scope.row.result == -2 ||
                    scope.row.result == -3
                  "
                ></i>
                <span v-show="scope.row.statusText">{{
                  scope.row.statusText
                }}</span>
                <span v-show="!scope.row.result && scope.row.result != 0"
                  >等待中</span
                >
                <span v-show="scope.row.result == 0"
                  >上传中{{ scope.row.authProgress }}%</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleDelete(scope.$index)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { createVideoInfo, getPlayCode, delVideo } from "@/api/course/scene";
import axios from "axios";
export default {
  props: {
    videoList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isNext: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //上传的视频
      list: [],
      //本地视频文件
      fileList: [],
      //视频格式
      allowVideoTypes: ".wmv,.rm,.mp4,.avi",
      // 每块最大字节
      maxChunkSize: 4 * 1024 * 1024,
      //当前上传第几个
      upold: 0,
    };
  },
  created() {
    this.init();
  },
  watch: {
    videoList(newVal) {
      // this.init();
    },
  },
  computed: {
    renderSize() {
      return (value) => {
        if (null == value || value == "") {
          return "0 Bytes";
        }
        let unitArr = new Array(
          "Bytes",
          "KB",
          "MB",
          "GB",
          "TB",
          "PB",
          "EB",
          "ZB",
          "YB"
        );
        let index = 0;
        let srcsize = parseFloat(value);
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        let size = srcsize / Math.pow(1024, index);
        size = size.toFixed(2); //保留的小数位数
        return size + unitArr[index];
      };
    },
  },
  methods: {
    showRow({ row, rowIndwx }) {
      let styleJson = {};
      // console.log(row);
      if (row.delete == 0) {
        styleJson = {
          // 'display': 'block'
        };
      } else {
        styleJson = {
          display: "none",
        };
      }
      return styleJson; // 返回对象
    },
    //初始化
    init() {
      this.fileList = [];
      this.videoList.forEach((item) => {
        item.delete = 0; //是否已经删除 0:未删除,1:已删除
        //上传状态
        item.result = 1; //null是未上传//0是上传中//1是上传成功//-1,-2,-3都是上传失败
        // 创建视频信息返回值
        item.uploadInfo = {
          // 视频id
          videoId: item.videoId,
        };
        //状态
        item.statusText = "上传成功";
        //字节大小
        item.size = item.videoSize;
        //文件名称
        item.fileName = item.sectionTitle;
      });
      this.list = this.videoList;
    },
    //删除
    handleDelete(index) {
      this.$confirm(
        `是否删除名为${this.list[index].fileName}的视频吗?`,
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          if (this.list[index].result == 1) {
            delVideo(this.list[index].uploadInfo.videoId).then(() => {
              this.$emit("delectVideo", this.list[index].uploadInfo.videoId);
              this.msgSuccess("删除成功");
              this.list[index].delete = 1;
              this.list.splice(index, 1);
              this.$forceUpdate();
            });
          } else {
            this.msgSuccess("删除成功");
            this.list[index].delete = 1;
            this.upold -= 1;
            this.upoldFile();
            this.$forceUpdate();
            return;
          }
        })
        .finally(() => {});
    },
    importFile() {},
    // 选中文件后的事件
    fileChange(fileObj, fileList) {
      let obj = {
        delete: 0, //是否已经删除 0:未删除,1:已删除
        //上传状态
        result: null, //null是未上传//0是上传中//1是上传成功//-1,-2,-3都是上传失败
        //文件信息
        file: fileObj.raw,
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
        // 创建视频信息接口请求值
        baseInfo: {
          title: "",
          tag: "",
          fileName: "",
          fileSize: 0,
        },
        // 已上传的字节
        uploadByte: 0,
        //进度
        authProgress: 0,
        //状态
        statusText: "",
        //字节大小
        size: this.renderSize(fileObj.raw.size),
        //字节大小Number
        sizeNum: fileObj.raw.size,
        //文件名称
        fileName: fileObj.raw.name,
      };
      if (!fileObj.raw) {
        this.msgError("请选择文件");
        return false;
      }
      // 验证文件是否可以上传
      let fileType = obj.file.name.split(".").pop().toLowerCase();

      let allowVideoTypes = ",wmv,rm,mp4,avi,";
      if (allowVideoTypes.indexOf("," + fileType + ",") < 0) {
        this.msgError("请选择视频文件");
        return false;
      }
      // 获取文件名 去除后缀
      let fileName = obj.file.name.substring(0, obj.file.name.lastIndexOf("."));
      if (fileName.length > 35) {
        this.msgError("文件名不能超过35个字");
        return false;
      }
      obj.file.fileName = fileName;
      // 配置创建视频信息参数
      obj.baseInfo.fileName = obj.file.name;
      obj.baseInfo.fileSize = obj.file.size;
      obj.baseInfo.title = fileName;
      this.list.push(obj);
      // console.log(obj);
      // console.log(this.list);
      this.upoldFile();
      this.fileList = fileList;
    },
    //开始上传
    upoldFile() {
      for (let index in this.list) {
        if (this.upold < 4) {
          this.$emit("update:isNext", false);
          if (
            !this.list[index].result &&
            this.list[index].result != 0 &&
            this.list[index].delete == 0
          ) {
            this.upold += 1;
            this.list[index].result = 0;
            this.authUpload(this.list[index], index);
          }
        } else {
          break;
        }
      }
    },
    // 上传文件事件
    authUpload(item, index) {
      // 判断是否已创建上传视频信息
      if (item.uploadInfo.chunkUrl !== "") {
        // 已创建 直接发送请求获取上传状态及断点位置
        this.queryInfo(item);
      } else {
        // 创建上传视频信息
        this.uploadVideo(item, index).then((resData) => {
          if (resData.code === 200) {
            let promise = this.queryInfo(item);
            this.checkStatus(promise, item, index);
          } else {
            this.msgError(resData.msg);
          }
        });
      }
    },
    // 创建视频信息
    uploadVideo(item, index) {
      let resData;
      return new Promise((resolve) => {
        // 发送请求 创建上传视频信息
        createVideoInfo(item.baseInfo).then((res) => {
          if (res.code === 200) {
            this.list[index].uploadInfo = res.data;
          }
          resData = res;
          resolve(resData);
        });
      });
    },
    // 发送请求查询⽂件上传状态及断点位置
    queryInfo(item) {
      let queryParams = {
        ccvid: item.uploadInfo.videoId,
        uid: item.uploadInfo.userId,
        filename: item.file.name,
        filesize: item.file.size,
        servicetype: item.uploadInfo.serviceType,
      };
      return new Promise((resolve, reject) => {
        axios
          .get(item.uploadInfo.metaUrl, {
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
    checkStatus(promise, item, index) {
      promise.then((queryDataInfo) => {
        if (queryDataInfo.status === 200) {
          // 获取成功 判断状态
          let infoData = queryDataInfo.data;
          // 上传状态中
          switch (infoData.result) {
            case 0:
              // 成功获取断点位置
              // 设置上传点
              this.list[index].uploadByte = parseInt(infoData.received);
              if (this.list[index].delete == 0) {
                this.chunkFileUpload(item, index);
              }
              break;
            case 1:
              // 文件已全部上传成功
              this.list[index].result = 1;
              this.list[index].statusText = "上传成功";
              this.list[index].authProgress = 100;
              this.upold -= 1;
              if (this.list[index].delete == 0) {
                this.playCode(item);
              }
              this.upoldFile();
              break;
            case -1:
              // 上传失败 可放弃本次上传,不重试
              this.list[index].statusText = "上传失败";
              this.list[index].result = -1;
              break;
            case -2:
              this.list[index].statusText = "上传失败";
              this.list[index].result = -2;
            // 服务器内部错误 可以续传重试
            case -3:
              // 请求参数错误
              this.list[index].statusText = "上传失败";
              this.list[index].result = -3;
              break;
          }
        } else {
          this.msgError(queryDataInfo.statusText);
        }
      });
    },
    // 获取视频播放代码
    playCode(item) {
      let reqData = {
        videoId: item.uploadInfo.videoId,
      };
      getPlayCode(reqData).then((res) => {
        if (res.code === 200) {
          this.$emit("creatVideo", {
            sectionVideoUrl: res.msg,
            titleName: item.baseInfo.title,
            videoId: item.uploadInfo.videoId,
            videoSize: item.sizeNum,
          });
          for (let index in this.list) {
            if (
              !this.list[index].result &&
              this.list[index].result == 0 &&
              this.list[index].delete == 0
            ) {
              this.$emit("update:isNext", false);
              return;
            }
          }
          this.$emit("update:isNext", true);
        } else {
          this.msgError(res.msg);
        }
      });
    },
    // 分块上传
    chunkFileUpload(item, index) {
      let range;
      if (
        this.list[index].uploadByte + this.maxChunkSize >
        this.list[index].file.size
      ) {
        range = this.list[index].file.size;
      } else {
        range = this.list[index].uploadByte + this.maxChunkSize;
      }
      let requestOpt = {
        blob: this.list[index].file.slice(this.list[index].uploadByte, range),
      };
      requestOpt.chunkSize = requestOpt.blob.size;
      // 本次上传range范围
      requestOpt.contentRange =
        "bytes " +
        this.list[index].uploadByte +
        "-" +
        (range - 1) +
        "/" +
        this.list[index].file.size;
      const formData = new FormData();
      formData.append("file", requestOpt.blob, item.file.name);
      axios
        .post(
          item.uploadInfo.chunkUrl + "?ccvid=" + item.uploadInfo.videoId,
          formData,
          {
            headers: {
              "Content-Range": requestOpt.contentRange,
              "Content-Disposition":
                'attachment; filename="' + encodeURI(item.file.fileName) + '"',
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            switch (res.data.result) {
              case 0:
                // 本次块文件上传成功
                this.list[index].uploadByte = parseInt(res.data.received);
                // 设置进度
                this.list[index].authProgress = Math.floor(
                  (res.data.received / item.file.size) * 100
                );
                if (this.list[index].delete == 0) {
                  this.chunkFileUpload(item, index);
                }
                break;
              case 1:
                // 文件已全部上传成功
                this.list[index].result = 1;
                this.list[index].statusText = "上传成功";
                this.list[index].authProgress = 100;
                this.upold -= 1;
                if (this.list[index].delete == 0) {
                  this.playCode(item);
                }
                this.upoldFile();
                break;
              case -1:
                // 上传失败 可放弃本次上传,不重试
                this.list[index].statusText = "上传失败";
                this.list[index].result = -1;
                break;
              case -2:
                this.list[index].statusText = "上传失败";
                this.list[index].result = -2;
              // 服务器内部错误 可以续传重试
              case -3:
                // 请求参数错误
                this.list[index].statusText = "上传失败";
                this.list[index].result = -3;
                break;
            }
          }
        });
    },
  },
};
</script>
<style lang="scss" scope>
.flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.flex-start {
  align-items: flex-start;
  -webkit-align-items: flex-start;
  box-align: flex-start;
  -moz-box-align: flex-start;
  -webkit-box-align: flex-start;
}

.flex-end {
  align-items: flex-end;
  -webkit-align-items: flex-end;
  box-align: flex-end;
  -moz-box-align: flex-end;
  -webkit-box-align: flex-end;
}

.flex-center {
  align-items: center;
  -webkit-align-items: center;
  box-align: center;
  -moz-box-align: center;
  -webkit-box-align: center;
}

.flex-jend {
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  -moz-box-pack: flex-end;
  -webkit--moz-box-pack: flex-end;
  box-pack: flex-end;
}

.flex-jcenter {
  -webkit-justify-content: center;
  justify-content: center;
  -moz-box-pack: center;
  -webkit--moz-box-pack: center;
  box-pack: center;
}

.flex-between {
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -moz-box-pack: space-between;
  -webkit--moz-box-pack: space-between;
  box-pack: space-between;
}

.flex-column {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
}

.flex-wrap {
  -webkit-flex-wrap: wrap;
  -webkit-box-lines: multiple;
  -moz-flex-wrap: wrap;
  flex-wrap: wrap;
}
</style>