<template>
  <div class="app-container">
    <el-form ref="form" label-width="90px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="当前项目：">{{ projectName }}</el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="当前课题：">{{
            topicName
            }}
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="当前期次：">{{
            periodName
            }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="学员姓名" prop="certName">
        <el-input
          v-model="queryParams.certName"
          placeholder="请输入学员姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择结算状态" clearable size="small">
          <el-option :label="dict.dictLabel" :value="dict.dictValue" v-for="(dict,index) in statusOptions" :key="index"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="userInfoList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学员姓名" align="center" prop="certName" />
      <el-table-column label="所在单位" align="center" prop="companyName" />
      <el-table-column label="手机号" align="center" prop="phonenumber" />
      <el-table-column label="发证机构" align="center" prop="certifyingAuthorityName" />
      <el-table-column label="报名时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.applyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime ? formatTime(scope.row.updateTime) : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成率" align="center" prop="finishRate">
        <template slot-scope="scope">
          <span>{{scope.row.finishRate ? scope.row.finishRate+'%' : '0%'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试分数" align="center" prop="examScore">
        <template slot-scope="scope">
          <span>{{scope.row.examScore ? scope.row.examScore+'分' : '暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="结算状态" align="center" prop="settleStatus">
        <template slot-scope="scope">
            <span>{{!scope.row.settleStatus ? '未结算' : scope.row.settleStatus == 1 ? '完训可结算' : scope.row.settleStatus == 2 ? '补贴已下放' : '补贴失败'}}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { distributorList, getUserInfo, delUserInfo, addUserInfo, updateUserInfo, exportUserInfo } from "@/api/apply/userInfo";
import Template from '../../certificate/template/index'

export default {
  name: "DistributionUserInfo",
  components: { Template },
  data() {
    return {
      projectName: undefined,
      topicName: undefined,
      periodName: undefined,
      statusOptions:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 学员报名信息表格数据
      userInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: undefined,
        topicId: undefined,
        periodId: undefined,
        userId: undefined,
        certName: undefined,
        companyId: undefined,
        companyName: undefined,
        distributorLevel: undefined,
        distributorId: undefined,
        distributorName: undefined,
        certifyingAuthorityId: undefined,
        certifyingAuthorityName: undefined,
        applyTime: undefined,
        finishRate: undefined,
        examScore: undefined,
        status: undefined,
        history:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectId: [
          { required: true, message: "关联项目id不能为空", trigger: "blur" }
        ],
        topicId: [
          { required: true, message: "关联课题id不能为空", trigger: "blur" }
        ],
        periodId: [
          { required: true, message: "关联期次不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "关联报名学员用户id不能为空", trigger: "blur" }
        ],
        certName: [
          { required: true, message: "报名人姓名不能为空", trigger: "blur" }
        ],
        companyId: [
          { required: true, message: "单位id不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        distributorLevel: [
          { required: true, message: "分销商等级{0:直销,1:一级分销,2:二级分销}不能为空", trigger: "blur" }
        ],
        distributorId: [
          { required: true, message: "分销商账号id不能为空", trigger: "blur" }
        ],
        distributorName: [
          { required: true, message: "分销商名称不能为空", trigger: "blur" }
        ],
        certifyingAuthorityId: [
          { required: true, message: "发证机构id不能为空", trigger: "blur" }
        ],
        certifyingAuthorityName: [
          { required: true, message: "发证机构名称不能为空", trigger: "blur" }
        ],
        applyTime: [
          { required: true, message: "报名时间不能为空", trigger: "blur" }
        ],
        finishRate: [
          { required: true, message: "完成率 0-100不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        if (
          this.$route.query &&
          this.$route.query.topicName &&
          this.$route.query.periodId &&
          this.$route.query.projectName &&
          this.$route.query.periodName
        ) {
          this.projectName = this.$route.query && this.$route.query.projectName
          this.topicName = this.$route.query && this.$route.query.topicName
          this.periodName = this.$route.query && this.$route.query.periodName
          this.queryParams.periodId = this.$route.query && this.$route.query.periodId
          this.queryParams.history = this.$route.query && this.$route.query.history
          this.getList()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.projectName = this.$route.query && this.$route.query.projectName
    this.topicName = this.$route.query && this.$route.query.topicName
    this.periodName = this.$route.query && this.$route.query.periodName
    this.queryParams.periodId = this.$route.query && this.$route.query.periodId
    this.queryParams.history = this.$route.query && this.$route.query.history
    this.getList();
    this.getDicts("apply_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    // 数据状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 查询学员报名信息列表 */
    getList() {
      this.loading = true;
      distributorList(this.queryParams).then(response => {
        this.userInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userInfoId: undefined,
        projectId: undefined,
        topicId: undefined,
        periodId: undefined,
        userId: undefined,
        certName: undefined,
        companyId: undefined,
        companyName: undefined,
        distributorLevel: undefined,
        distributorId: undefined,
        distributorName: undefined,
        certifyingAuthorityId: undefined,
        certifyingAuthorityName: undefined,
        applyTime: undefined,
        finishRate: undefined,
        examScore: undefined,
        status: "0",
        remark: undefined,
        createTime: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userInfoId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学员报名信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userInfoId = row.userInfoId || this.ids
      getUserInfo(userInfoId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学员报名信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userInfoId != undefined) {
            updateUserInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addUserInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userInfoIds = row.userInfoId || this.ids;
      this.$confirm('是否确认删除学员报名信息编号为"' + userInfoIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUserInfo(userInfoIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学员报名信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUserInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
