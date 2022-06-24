<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="sourceList" border>
      <el-table-column label="我的邀请码" align="center" prop="sourceCode"/>
      <el-table-column label="邀请人数" align="center" prop="userCount"/>
      <el-table-column label="邀请购买订单金额" align="center" prop="money"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCopy(scope.row)"
          >邀请链接
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="createPoster(scope.row)"
          >生成海报
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  复制邀请码  -->
    <el-dialog title="邀请链接" :visible.sync="copyDialog" width="800px" append-to-body :close-on-click-modal="false" >
      <el-row>
        <el-col>
          <span style="font-size: 18px">链接地址: </span>
          <span class="self-font">https://www.bbazxw.com?sourceCode={{ copyDialogRow.sourceCode }}&sign={{copyDialogRow.sign}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="margin-top: 10px">
            <div><span style="font-size: 18px">分享文字: </span></div>
            <div>
              <span class="self-font">
                说明:
<!--                假如分享文字为"
                <span style="color: red">
                  更多惊喜免费课程、免费使用 ${url}
                </span>",
                <br/>复制链接则会生成"
                <span style="color: red">
                  更多惊喜免费课程、免费使用 https://www.bbazxw.com?sourceCode={{ copyDialogRow.sourceCode }}&sign={{copyDialogRow.sign}}
                </span>", -->
                占位符为<span style="color: red">${url}</span>, 文字中的 <span style="color: red">${url}</span> 会被替换成相应的<span style="color: red">链接地址</span>
              </span>
            </div>
            <div style="margin-top: 10px">
              <el-input type="textarea"
                        v-model="slogan"
                        maxlength="500"
                        :autosize="{ minRows: 5, maxRows: 7}"
                        show-word-limit/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;" type="flex" justify="right">
        <el-col :span="6">
          <el-button type="primary" @click="useDefaultSlogan">使用默认分享文字</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-document-copy" @click="copyCode">复制文字和链接</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <builderPoster
      :posterOpen="posterOpen"
      @cancelCreatePoster="posterOpen=false"
      :row="copyDialogRow"
      v-if="posterOpen"
    >
    </builderPoster>

  </div>
</template>

<script>
  import {getCode} from '@/api/channel/info'
  import builderPoster from './components/builderPoster'
  import Swiper from "swiper";

  export default {
    name: "index",
    components: { builderPoster },
    created() {
      this.getList();
      // 获取缓存的邀请文本
      let str = localStorage.getItem("slogan_info");
      if (str) {
        this.slogan = str
      } else {
        this.slogan = this.defaultSlogan
      }
    },
    data() {
      return {
        posterOpen: false,
        loading: false,
        sourceList: [],
        // 邀请链接弹出框
        copyDialog: false,
        // 邀请链接数据
        copyDialogRow: {},
        // 邀请文本
        slogan: "",
        // 默认邀请文本
        defaultSlogan: "一分钟开启在线专属课堂, " +
          "7700+门课程，涵盖5G、人工智能、大数据、云计算、区块链等多个专业领域和研发, " +
          "数字化人才培养的全面生态体系, 更多惊喜免费课程、免费使用${url}"
      }
    },
    methods: {
      createPoster(row) {
        this.copyDialogRow = row;
        this.posterOpen = true;
      },
      // 获取表格数据
      getList() {
        this.loading = true
        getCode().then(res => {
          if (res.code === 200) {
            this.sourceList = res.data
          }
          this.loading = false
        }).finally(() => {
          this.loading = false
        })
      },
      // 使用默认的分享文字
      useDefaultSlogan() {
        this.slogan = this.defaultSlogan;
        this.copyCode();
      },
      // 表格点击邀请链接
      handleCopy(row) {
        this.copyDialog = true;
        this.copyDialogRow = row;
      },
      // 复制邀请链接(包含文字)
      copyCode() {
        let htmlInputElement = document.createElement("input");
        htmlInputElement.value = this.getSloganStr();
        document.body.append(htmlInputElement);
        htmlInputElement.select();
        document.execCommand("Copy");
        this.msgSuccess("复制成功!");
        htmlInputElement.remove()
        // 浏览器缓存 slogan
        localStorage.setItem("slogan_info", this.slogan);
      },
      // 替换占位符
      getSloganStr() {
        let url = "https://www.bbazxw.com?sourceCode=" + this.copyDialogRow.sourceCode + "&sign=" + this.copyDialogRow.sign;
        // 判断是否有文字
        if (this.slogan.length < 1) {
          return url
        }
        // 判断是否有占位符,如果没有则直接将链接拼接在文字后面
        if (this.slogan.indexOf("${url}") === -1) {
          // 无占位符
          return this.slogan + " " + url;
        }else {
          // 处理占位符
          return this.slogan.replace( /\${url}/g, url);
        }
      },
    }
  }
</script>

<style scoped>
  .self-font {
    font-size: 16px;
  }
</style>
