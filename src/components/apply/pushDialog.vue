<template>
  <div>
    <!-- 发送测评 -->
    <el-dialog
      :visible.sync="openSend"
      class="send"
      width="70%"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <!-- //步骤条 -->
      <div class="progress">
        <el-steps :active="porgress_index">
          <el-step
            v-for="(item, index) in porgress_list"
            :title="item.name"
            :key="index"
          ></el-step>
        </el-steps>
      </div>
      <!-- //步骤条 -->
      <!-- 选择课题 -->
      <div v-if="porgress_index == 0">
        <el-button
          type="primary"
          icon="el-icon-success"
          size="mini"
          @click="optional"
          >确认选择</el-button
        >
        <div class="add-flex">
          <div class="add-item1">已选课题:</div>
          <div class="add-item2">
            <div
              class="item2-display"
              v-for="(item, index) in this.StaffCheck"
              :key="index"
            >
              {{ item.topicName }}
            </div>
          </div>
        </div>
        <el-table
          border
          max-height="400"
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            prop="topicName"
            label="课题名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目名称"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="distributorName"
            label="分销商名称"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
        </el-table>
        <div class="pagein" v-if="total">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum"
            :page-sizes="[10, 100, 200, 300, 400]"
            :page-size="queryParams.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 选择课题 -->
      <!-- 完成 -->
      <div class="success" v-else>
        <vue-qr
          class="success-code"
          :logoScale="20"
          :margin="10"
          :dotScale="1"
          :text="qrCodeUrl"
        ></vue-qr>
        <el-input
          placeholder="二维码链接"
          v-model="qrCode"
          :disabled="true"
        ></el-input>
        <div>
          <el-button
            type="primary"
            icon="el-icon-download"
            size="small"
            @click="download"
            >点击下载</el-button
          >
          <el-button
            type="success"
            icon="el-icon-copy-document"
            size="small"
            @click="Copy"
            >点击复制</el-button
          >
        </div>
      </div>
      <!-- 完成 -->
    </el-dialog>
    <!-- 发送测评 -->
  </div>
</template>

<script>
import {
  searchMyPushUsers, //课题数据
  generator,
} from "@/api/apply/schedule";
import VueQr from 'vue-qr'
export default {
  props: {
    openSend: { type: Boolean }, //模态窗
    projectId: { type: String }, //项目id
  },
  watch: {
    openSend(val) {
      //模态窗
        if (val){
            this.queryParams.projectId = this.projectId
            this.getList()//列表数据
        }; 
    },
  },
  components:{VueQr},
  data() {
    return {
      qrCode: "",
      qrCodeUrl:"",
      porgress_index: 0, //步骤条下标
      porgress_list: [
        //步骤条数据
        {
          name: "选择课题",
        },
        {
          name: "完成",
        },
      ],
      total: 0, //总条数
      tableData: [], //课题数据
      StaffCheck:[],//已选课题数据
      queryParams: {
        //列表数据
        pageNum: 1,
        pageSize: 12,
        projectId:''
      },
    };
  },
  mounted() {
  },
  methods: {
    //下载二维码
    download() {
      var oQrcode = document.querySelectorAll(".success .success-code ");
      var url = oQrcode[0].src;
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "二维码");
      a.click();
    },
    //复制链接
    Copy() {
      var input = document.createElement("input"); // 直接构建input
      input.value = this.qrCode; // 设置内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      this.$message.success("复制成功");
    },
    // 确认选择
    optional() {
      if (!this.StaffCheck.length) return this.$message.warning("请先选择课题");
      this.porgress_index = 2;
      let ids = []
      let distributorId
      let distributorLevel
      this.StaffCheck.forEach(item=>{
          ids.push(item.topicId)
          distributorId = item.distributorId
          distributorLevel =item.distributorLevel
      })
      this.getUrl(ids.join(','),distributorId,distributorLevel)
    },
    getRowKeys(row) {
      return row.topicId; // id为列表数据的唯一标识
    },
    beforeClose() {
      //模态窗传给父组件 关闭模态窗
      this.StaffCheck = []; //选择数据清空
      this.porgress_index = 0; //进度条清空
      this.$emit("close", false, 1);
    },
    handleSizeChange(e) {
      //页数
      this.queryParams.pageSize = e;
      this.getList();
    },
    handleCurrentChange(e) {
      //页码
      this.queryParams.pageNum = e;
      this.getList();
    },
    //多选
    handleSelectionChange(val) {
      this.StaffCheck = val;
      this.$forceUpdate;
    },
    getList() {
      //课题列表
      searchMyPushUsers(this.queryParams).then((res) => {
        if(res.rows.length==0){
          this.$emit("close", false, 1);
          this.$message.warning('当前项目没有进行中的课题，请在课题开始后进行操作')
          return
        }
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    
    //获取短链接
    getUrl(topicId,distributorId,distributorLevel){
        const domain = this.$store.state.user.tenantUrl;
        if (!domain) {
        url = "www.bbazxw.com";
      }
        generator({
            url:`https://${domain}/apply/selectTopic?topicId=${topicId}&projectId=${this.projectId}&distributorId=${distributorId}&distributorLevel=${distributorLevel}&mobilePage=pages/signup/sign`,
            baseUrl:`${domain}/prod-api/`,
            expire:20160
        }).then(res=>{
            this.qrCode = res.data
            this.qrCodeUrl = `https://${domain}/apply/selectTopic?topicId=${topicId}&projectId=${this.projectId}&distributorId=${distributorId}&distributorLevel=${distributorLevel}&mobilePage=pages/signup/sign`
        })
    }
  },
};
</script>

<style lang="scss" scoped>
//进度
.progress {
  border-bottom: 1px solid #ccc;
  margin: 0 auto;
  padding: 0 30%;
  box-sizing: border-box;
  margin: 20px 0;
}
.formTitle {
  /deep/ .el-form-item {
    width: 10%;
  }
}
.pagein {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
//发送测试
.send {
  /deep/ .el-dialog__body {
    padding: 0px 20px 30px !important;
  }
}
.add-flex {
  display: flex;
  align-items: center;
  margin: 20px 0;
  .add-item1 {
    width: 7%;
    // margin-bottom: 10px;
  }
  .add-item2 {
    width: 90%;
    .item2-display {
      display: inline-block;
      padding-right: 10px;
    }
  }
}
.setup {
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .setup-flex {
    display: flex;
    justify-content: space-between;
    width: 80%;
    align-items: center;
    font-size: 15px;
    /deep/ .el-input {
      margin: 0px 20px;
      width: 75%;
    }
  }
  .position {
    position: absolute;
    margin-top: -307px;
    right: 38px;
  }
}
.success {
  height: 350px;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding-top: 35px;
  text-align: center;
  width: 100%;
  .success-code {
    width: 150px;
    height: 150px;
  }
  /deep/ .el-input__inner {
    width: 50% !important;
    height: 40px;
    margin: 15px 0px 25px;
  }
}
.select-option {
  width: 70%;
  /deep/ .el-selects {
    width: 20% !important;
  }
  /deep/ .el-input {
    margin: 0px !important;
    width: 100% !important;
  }
}
.input-text {
  width: 55% !important;
}
</style>
