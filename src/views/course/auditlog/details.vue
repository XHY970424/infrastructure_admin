<template>
  <div class="app-container" v-loading="allLoading">
    <!--    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入搜索内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <div class="sfz">
      <span>身份证国徽面: </span>
      <!-- <img src="../../../assets/401_images/401.gif" /> -->
      <el-image :src="list[0].idCardFm" style="width: 120px; height: 60px" :preview-src-list="[list[0].idCardZm]"/>
      <span>身份证人像面: </span>
      <el-image :src="list[0].idCardZm" style="width: 120px; height: 60px"  :preview-src-list="[list[0].idCardFm]"/>
      <span>头像: </span>
      <el-image :src="list[0].avatar" style="width: 120px; height: 60px"  :preview-src-list="[list[0].avatar]" />
      <span>学员联系电话: {{list[0].phonenumber}}</span>
    </div>
    <div style="padding: 8px 0;">
      <span>课程名称: {{list[0].subjectTitle}} </span>
      <span class="info-class">套餐名称: {{list[0].servicesPriceName}} </span>
      <span class="info-class">用户名称: {{list[0].nickName}} </span>
      <span class="info-class">公司名称: {{list[0].unitName}} </span>
      <span class="info-class">身份证号码: {{list[0].idCard}} </span>
    </div>
    <div>
      <el-col :span="2.5" style="margin-left:15px; float: right;"><el-button type="primary" @click="nextData">下一条</el-button></el-col>
      <el-col :span="2.5" style="margin-left:15px; float: right;"><el-button type="primary" @click="lastData">上一条</el-button></el-col>
      <el-col :span="2.5" style="margin-left:15px; float: right;"><span style="height: 36px;display: inline-block;line-height: 36px;">当前为第{{current}}条</span></el-col>
      <el-col :span="2.5" style="margin-left:15px; float: right;"><span style="height: 36px;display: inline-block;line-height: 36px;">共选中{{ids.length}}条</span></el-col>
    </div>

    <el-table class="yw-table"
              v-loading="loading"
              border
              height="600"
              :default-expand-all = "defaultExpand"
              :data="list"
              @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
       <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item>
                  <div class="audit-img" v-for="item in props.row.eyLogImgList">
                    <img :src="item.path">
                    <span>{{item.createTime}}</span>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
      <el-table-column label="章节名称" align="center" prop="sectionTitle" :show-overflow-tooltip="true" />
      <el-table-column label="总时长(时:分:秒)" align="center" prop="durationStr" :show-overflow-tooltip="true" />
      <el-table-column label="学习状态" align="center" prop="status" width="200" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">未学完</span>
          <span v-if="scope.row.status == 1">已学完</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="createTime" width="180" />
      <el-table-column label="结束时间" align="center" prop="finishTime" />
      <el-table-column label="审核状态" align="center" prop="auditStatus" >
        <template slot-scope="scope">
          <span style="color: red">作弊</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="auditTime" />
      <el-table-column label="IP地址" align="center" prop="ip" width="180" />
      <!-- <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope" v-if="scope.row.testScores > 60">
          <el-button @click="handleClick(scope.row)" type="text" size="medium">审核</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
  import { getAudit,apiAllPass,apiChoosePass,apiChooseNoPass, getCheat } from "@/api/course/auditLog";

  export default {
    name: "audit",
    data() {
      return {
        allLoading: true, // 整页加载层
        opType: undefined,
        showTitle: "",
        dialogVisible: false,
        chooseIds:[], // 选中的id
        loading: false,  // 表格加载层
        defaultExpand: true,  // 表格默认展开
        subjectUserId: undefined,  // 课程用户中间表id
        list: [
          {
            idCardFm: undefined,
            idCardZm: undefined,
            avatar: undefined,
            sectionTitle: undefined,
            durationStr: undefined,
            status: undefined,
            createTime: undefined,
            finishTime: undefined,
            auditStatus: undefined,
            auditTime: undefined,
            ip: undefined,
          },
          // {
          //   idCardFm: "",
          //   idCardZm: "",
          //   avatar: "",
          //   sectionTitle: "测试章节1",
          //   durationStr: "20:30",
          //   status: 0,
          //   createTime: "2020-11-11",
          //   finishTime: "2020-11-12",
          //   auditStatus: 0,
          //   auditTime: "2020-11-13",
          //   ip: "127.0.0.1",
          // },
          // {
          //   idCardFm: "",
          //   idCardZm: "",
          //   avatar: "",
          //   sectionTitle: "测试章节1",
          //   durationStr: "20:30",
          //   status: 0,
          //   createTime: "2020-11-11",
          //   finishTime: "2020-11-12",
          //   auditStatus: 0,
          //   auditTime: "2020-11-13",
          //   ip: "127.0.0.1",
          // },
        ],
        ids: [],
        id: false,
        current: 1
      };
    },
    created() {
      this.id = this.$route.params && this.$route.params.id;
      if (this.id) {
        this.ids = JSON.parse(this.$route.params.id);
        this.subjectUserId = this.ids[0];
        this.current = 1;
        this.getList();
      }else{
        this.$message({
          type: "error",
          message: "参数错误"
        });
      }
    },
    methods: {
      /** 查询审核*/
      getList() {
        this.allLoading = false
        getCheat(this.subjectUserId)
        .then(res => {
          if (res.code == 200){
            this.list = res.data
            this.allLoading = false
            if (this.list.length < 1){
              this.$message({
                type: "error",
                message: "暂无数据"
              });
            }
          }else{
            this.allLoading = false
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        })
      },
      // 上一条数据
      lastData(){
        if (this.current == 1){
          this.$message({
            type: "warning",
            message: "已经是第一条数据了"
          });
          return;
        }
        this.current -= 1;
        this.subjectUserId = this.ids[this.current - 1];
        this.getList();
      },
      // 下一条数据
      nextData(){
        if (this.current >= this.ids.length){
          this.$message({
            type: "warning",
            message: "已经是最后一条数据了"
          });
          return;
        }
        this.current += 1;
        this.subjectUserId = this.ids[this.current - 1];
        this.getList();
      },
      // 多选 操作
      handleSelectionChange(selection){
        this.chooseIds = selection.map(item => item.id)
      },
      // 所有通过
      allPass(){
        this.showTitle = "您确定要全部通过?"
        this.opType = 1
        this.dialogVisible = true
      },
      // 选中项 通过
      choosePass(){
        if (this.chooseIds.length < 1){
          this.$message({
            type: "error",
            message: "请选择数据"
          });
          return;
        }
        this.showTitle = "您确定要选中项通过?"
        this.opType = 2
        this.dialogVisible = true
      },
      // 选中项 作弊
      chooseNoPass(){
        if (this.chooseIds.length < 1){
          this.$message({
            type: "error",
            message: "请选择数据"
          });
          return;
        }
        this.showTitle = "您确定要选中项作弊?"
        this.opType = 3
        this.dialogVisible = true
      },

      opsure(type){
        this.dialogVisible = false
        if (this.opType == 1){
          apiAllPass(this.subjectUserId)
          .then(res => {
            if (res.code == 200){
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getList();
            }else{
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          })
        }else if(this.opType == 2){
          apiChoosePass(this.chooseIds)
          .then(res => {
            if (res.code == 200){
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getList();
            }else{
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          })
        }else if(this.opType == 3){
          apiChooseNoPass(this.chooseIds)
          .then(res => {
            if (res.code == 200){
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.getList();
            }else{
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          })
        }

      }
    }
  }
</script>
<style>
  .yw-table {
    margin-top: 45px;
  }

  .app-container {
    /* position: relative; */
  }

  .sfz {
    padding-bottom: 20px;
    /* background-color: bisque; */
    width: 100%;
    height: 70px;
  }


  .audit-img{
    margin-left: 20px;
    max-width: 500px;
    max-height: 60px;
    display: inline-block;
    text-align: center;
  }

  .audit-img img{
    display: block;
  }
  .audit-img span{
    display: inline-block;
  }
  .info-class{
    margin-left: 10px;
  }

</style>
