<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="" prop="userId">
        <el-input
          v-model="queryParams.search"
          placeholder="学员姓名/学员手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属班级" prop="classId">
        <el-select v-model="queryParams.classId" clearable>
          <el-option v-for="item in classData" :label="item.className" :value="item.classId" />
        </el-select>
      </el-form-item>
      <el-form-item label="学习状态" prop="studyStatus">
        <el-select v-model="queryParams.studyStatus" clearable>
          <el-option label="未学完" value="0"/>
          <el-option label="已学完" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading"  border :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="55" fixed="left"/>
      <el-table-column label="课程标题" align="center" prop="subjectTitle" width="160" fixed="left" :show-overflow-tooltip="true" />
      <el-table-column label="学员姓名" align="center" prop="userName" :show-overflow-tooltip="true" fixed="left" />
      <el-table-column label="学员身份证号" align="center" prop="idCard" width="170" :show-overflow-tooltip="true"/>
      <el-table-column label="学员手机号" align="center" prop="phonenumber" width="160" :show-overflow-tooltip="true"/>
      <el-table-column label="课程学时" align="center" prop="subjectHours" width="100" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="首次学习时间" align="center" prop="startTime" width="180"/> -->
      <el-table-column label="班级名称" align="center" width="170" prop="className" />
      <el-table-column label="开始学习时间" align="center" width="150" prop="startTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总时长(分钟)" align="center" width="110" prop="allTime">
        <template slot-scope="scope">
          <span>{{ (scope.row.allTime / 60).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已学时长(秒)" align="center" width="120" prop="alreadyTime" />
      <el-table-column label="进度百分比" align="center" width="110" prop="progress" />
      <el-table-column label="所属单位" align="center" width="160" prop="companyName" />
      <el-table-column label="部门" align="center" prop="sectionName" />
      <el-table-column label="岗位" align="center" prop="postsName" />
      <el-table-column label="完成时间" align="center" prop="finishTime" width="180" fixed="right"/>
      <!-- <el-table-column label="总测试分数" align="center" prop="testScores" width="180"/> -->
      <!-- <el-table-column label="操作" align="center"  width="120">
        <template slot-scope="scope" v-if="scope.row.testScores > 60">
          <el-button @click="gotos(scope.row.id)" type="text" size="medium">审核</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改课程人员管理关联对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程标题" prop="subjectTitle">
          <el-input v-model="form.subjectTitle" placeholder="请输入课程id" />
        </el-form-item>
        <el-form-item label="人员id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入人员id" />
        </el-form-item>
        <el-form-item label="首次学习时间" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.startTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择首次学习时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="班级id" prop="classId">
          <el-input v-model="form.classId" placeholder="请输入班级id" />
        </el-form-item>
        <el-form-item label="累计学习时长" prop="learningTime">
          <el-input v-model="form.learningTime" placeholder="请输入累计学习时长" />
        </el-form-item>
        <el-form-item label="有效学习时长" prop="validTime">
          <el-input v-model="form.validTime" placeholder="请输入有效学习时长" />
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.finishTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择完成时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listUser, getUser, delUser, addUser, updateUser, exportUser, updateUserStatus, getClassData } from "@/api/course/subjectUser";

  export default {
    name: "User",
    data() {
      return {
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
        // 课程人员管理关联表格数据
        userList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //接收页面课程主题ID
        subjectId:undefined,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          subjectId: undefined,
          userId: undefined,
          startTime: undefined,
          classId: undefined,
          learningTime: undefined,
          validTime: undefined,
          finishTime: undefined,
          status: undefined,
          search: undefined,
          studyStatus: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        },
        classData: [],
      };
    },
    created() {
      this.subjectId = this.$route.params && this.$route.params.subjectId;
      console.log(this.$route.params)
      if(this.subjectId){
        this.queryParams.subjectId = this.subjectId;
      }
      this.getList();
      // 获取班级
      getClassData(this.subjectId).then(res => {
        this.classData = res.data;
      })
    },
    methods: {
      gotos(id){
        this.$router.push({
          name:'audit',
          params: {userId:id}
        });
      },
      /** 查询课程人员管理关联列表 */
      getList() {
        this.loading = true;
        listUser(this.queryParams).then(response => {
          this.userList = response.rows;
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
          id: undefined,
          userId: undefined,
          startTime: undefined,
          classId: undefined,
          learningTime: undefined,
          validTime: undefined,
          subjectId: this.subjectId,
          finishTime: undefined,
          status: "0",
          createTime: undefined,
          createBy: undefined,
          updateTime: undefined,
          updateBy: undefined
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
        this.queryParams.search = undefined;
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加课程人员管理关联";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getUser(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改课程人员管理关联";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateUser(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addUser(this.form).then(response => {
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
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除课程人员管理关联编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUser(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      /** 删除按钮操作 (只是修改其在数据库中显示的状态 ， 并不是真正删除数据) */
      handleUpdateStatus(row) {
        const ids = row.id;
        debugger
        this.$confirm('是否确认删除课程人员管理关联编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          if (this.form.id != undefined) {
            updateUserStatus(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("删除成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有课程人员管理关联数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUser(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
