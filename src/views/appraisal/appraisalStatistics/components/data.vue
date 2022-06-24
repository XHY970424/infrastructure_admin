<template>
  <div>
    <el-form
      :model="queryParams"
      :label-position="labelPosition"
      ref="queryForm"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="所在单位" prop="title">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入所在单位"
          clearable
          size="small"
          @keyup.enter.native="getList"
        />
      </el-form-item>
      <el-form-item label="学员姓名/用户名" prop="url" class="statisClass">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入学员姓名/用户名"
          clearable
          size="small"
          @keyup.enter.native="getList"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="getList"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['appraisal:statistics:export']"
          >下载数据
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="topNavList" border>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="所在单位" align="center" prop="companyName" />
      <el-table-column label="姓名" align="center" prop="userName" />
      <el-table-column label="部门" align="center" prop="sectionName">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.type == 0 ? "路由" : "外链" }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="岗位" align="center" prop="postsName" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="测评用途" align="center" prop="useDesc" />
      <el-table-column label="提交时间" align="center" prop="submitTime" />
      <el-table-column label="状态" align="center" prop="doneStatus">
        <template slot-scope="scope">
          {{ Datetime(scope.row.doneStatus,scope.row.timerEnd,scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column label="用时" align="center" prop="useTime" >
         <template slot-scope="scope">
          <span>{{ scope.row.useTime ?scope.row.useTime+'s':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button
          :disabled="scope.row.doneStatus==1?false:true"
            size="mini"
            type="success"
            plain
            @click="report(scope.row, 0)"
            v-hasPermi="['appraisal:statistics:personReport']"
            >个人报告
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { userStatistics, exportUserStatistics } from "../../../../api/appraisal/appraisal";
export default {
  props: {
    appraisalId: {
      type: String,
    },
  },

  computed:{
    Datetime(){
      return (doneStatus,timerEnd,endTime)=>{
        if((doneStatus==0 || doneStatus==1) || (timerEnd==1 && this.tabTime(endTime)==true)){//判断状态
          return '已结束'
        }else{
          return '未完成'
        }
      }
    }
  },
  data() {
    return {
      Status: ["未完成", "已结束"],
      // 遮罩层
      loading: false,
      // 顶部导航菜单表格数据
      topNavList: [],
      labelPosition: "left",
      total: 10, //总条数
      queryParams: {
        //搜索筛选
        pageNum: 1,
        pageSize: 10,
        appraisalId:this.$route.query.appraisalId,
        companyName: undefined,//单位
        userName: undefined,//名称
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    tabTime(endTime){//表格状态判断
      let startTime= new Date();
        let endTimes=new Date(Date.parse(endTime));
        if(startTime.getTime() > endTimes.getTime()){//比较时间大小
             return true
         } else {
            return false
         }
    },
    getList() {
      userStatistics({
        ...this.queryParams,
        // appraisalId: this.appraisalId, //id
      }).then((res) => {
        if (res.code == 200) {
          this.topNavList = res.rows;
          this.total = res.total; //总条数
        }
      });
    },

    //个人报告跳转
    report(e) {
      this.$router.push({
        path: "./result",
        query: { relevanceId: e.relevanceId },
      });
    },
    // //搜索筛选
    // handleQuery() {
    //   console.log("搜索筛选");
    // },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportUserStatistics(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    },
  }
};
</script>

<style scoped lang="scss">
.statisClass {
  /deep/ .el-form-item__label {
    width: 130px !important;
  }
}
</style>
