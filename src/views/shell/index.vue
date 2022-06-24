<template>
  <div class="app-container">
    <el-container>
      <el-header class="header-css" style="height: 50px">部署说明</el-header>
      <el-main>
        <span>这里部署发布的环境指测试环境上：</span><br><br>
        <span>1.为了方便后端开发人员快速部署修改好的bug和接口数据，本页面提供一键部署功能</span><br>
        <span>2.后端接口部署要先将源代码提交到公司内网的gitLab上</span><br>
        <span>3.后端页面的部署，要先在本地打包好的dist里面的内容，拷贝在 "construction-master-ui-dist文件夹" 里面提交到公司内网的gitLab上</span><br>
        <span>4.点击按钮无论是成功还是失败，都应该等[30秒-1分钟]再重复点击(前提是部署不成功的时候)</span><br>
        <span>5.发布成功后，要登录相应的访问网址查看是否部署成功</span><br>
        <span>6.点击按钮后，会有一分钟的隐藏按钮时间段</span><br>
      </el-main>
    </el-container>

    <div style="margin-top: 10px">
      <el-table :data="tableData" border v-loading="loading" style="width: 100%" element-loading-text="发布请求中">

        <el-table-column label="项目名字" prop="name" align="center" min-width="20%" :show-overflow-tooltip="true"/>
        <el-table-column label="项目说明" prop="address" align="center" min-width="60%"  :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" min-width="20%">
          <template slot-scope="scope">
            <el-button v-if="show" type="success" @click="publish(scope.row.id)">发布更新</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
  import { shellSys, shellSysUI } from "@/api/shell/index";

  export default {
    data() {
      return {
        // 遮罩层
        loading: false,

        // 计时器参数
        show: true,
        count: '',
        timer: null,

        // 数据列表
        tableData: [{
          id: 1,
          name: '管理后台接口',
          address: '《 后台接口代码 -> construction-master 》需要提交再点发布按钮，切记:发布成功请内心等待30秒到一分钟，不要重复提交'
        }, {
          id: 2,
          name: '管理后台前端',
          address: '《 后台前端代码 -> construction-master 和 construction-master-ui-dist 》需要提交再点发布按钮'
        }, {
          id: 3,
          name: 'PC网站前端',
          address: '《 前端的代码需要前端人员打包后上传 -> 与前端沟通 》需要提交再点发布按钮'
        }]
      }
    },
    methods: {
      doHideButton(){
        const TIME_COUNT = 60;
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000)
        }
      },

      publish(id) {
        if (id == 1) {
          this.loading = true;

          shellSys().then(response => {
            if (response.code === 200) {
              this.msgSuccess("发布更新成功(等待<30秒-1分钟>)");
            } else {
              if (response.msg == 'Network Error'){
                this.msgSuccess("发布更新成功(等待<30秒-1分钟>)");
              }else{
                this.msgError(response.msg);
              }
            }
            this.doHideButton();
            this.loading = false;
          });
        }

        if (id == 2) {
          this.loading = true;
          shellSysUI().then(response => {
            if (response.code === 200) {
              this.msgSuccess("发布更新成功(等待<30秒-1分钟>)");
            } else {
              this.msgError(response.msg);
            }
            this.doHideButton();
            this.loading = false;
          });
        }

        if (id == 3) {
          this.msgSuccess("---待开发---");
        }
      }
    }
  }
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    font-size: 20px;
    font-weight: 900;
    text-align: center;
    line-height: 50px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    letter-spacing:2px
  }

</style>
