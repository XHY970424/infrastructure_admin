<template>
  <div class="app-container" v-loading="loading">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="关键字搜索">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入关键字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程">
        <el-select v-model="queryParams.subjectId" clearable  placeholder="请选择">
            <el-option
              v-for="subjectItem in subjectList"
              :key="subjectItem.id"
              :label="subjectItem.subjectTitle"
              :value="subjectItem.id">
            </el-option>
          </el-select>
      </el-form-item>
<!--      <el-form-item label="身份证号">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

      <el-form-item label="审核状态">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择">
            <el-option
              v-for="auditStatusItem in auditStatus"
              :key="auditStatusItem.value"
              :label="auditStatusItem.label"
              :value="auditStatusItem.value">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="学习状态">
        <el-select v-model="queryParams.studyStatus" placeholder="请选择">
            <el-option
              key="0"
              label="未学完"
              value="0">
            </el-option>
            <el-option
              key="1"
              label="已学完"
              value="1">
            </el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="学完时间">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.startFinishTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择学完时间(始)">
        </el-date-picker>
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.endFinishTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择学完时间(终)">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="审核时间">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.startAuditTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择审核时间(始)">
        </el-date-picker>
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.endAuditTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择审核时间(终)">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleAdd"
          v-hasPermi="['eycode:auditlog:getaudit']"
        >审核学习记录</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eycode:auditlog:getcheat']"
        >查看作弊学时</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          :disabled="single"
          v-hasPermi="['eycode:auditlog:export']"
        >导出学时记录</el-button> -->
      </el-col>
    </el-row>

    <el-table v-loading="loading"
              :data="userList"
              border
              @sort-change="changeSort"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="课程名称" align="center" sortable="custom" prop="subjectTitle" />
      <el-table-column label="套餐名称" align="center" sortable="custom" prop="servicesPriceName" />
      <el-table-column label="用户名称" align="center" sortable="custom" prop="userName" />
      <el-table-column label="公司名称" align="center" sortable="custom" prop="unitName" />
      <el-table-column label="手机号码" align="center" sortable="custom" prop="phonenumber" />
      <el-table-column label="身份证号" align="center" sortable="custom" prop="idCard" />
      <el-table-column label="学习状态" align="center" sortable="custom" prop="studyStatus" >
        <template slot-scope="scope">
          <span v-if="scope.row.studyStatus == 0" style="color: #0074D9;">未学完</span>
          <span v-if="scope.row.studyStatus == 1" style="color: #0074D9;">已学完</span>
        </template>
      </el-table-column>
      <el-table-column label="首次学习时间" align="center" sortable="custom"  prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习完成时间" align="center" sortable="custom" prop="finishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" sortable="custom" prop="auditStatus" >
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus == 0">未审核</span>
          <span v-if="scope.row.auditStatus == 1">审核通过</span>
          <span v-if="scope.row.auditStatus == 2">作弊</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" sortable="custom" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总课时" align="center" sortable="custom" prop="totalSection" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:user:edit']"
          >审核学习记录</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:user:remove']"
          >查看作弊学时</el-button>
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
   <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程id" prop="subjectId">
          <el-input v-model="form.subjectId" placeholder="请输入课程id" />
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
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.finishTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="已学课时" prop="learnSection">
          <el-input v-model="form.learnSection" placeholder="请输入已学课时" />
        </el-form-item>
        <el-form-item label="总课时" prop="totalSection">
          <el-input v-model="form.totalSection" placeholder="请输入总课时" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { auditUserList, auditSubjectList, apiExport } from "@/api/course/auditLog";

export default {
  name: "AuditLog",
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
      userList: [
        // {
        //   id: 1,
        //   subjectTitle: "测试课程1",
        //   userName: "测试用户1",
        //   idCard: "3622261",
        //   startTime: "2020-02-06",
        //   auditStatus: 0,
        //   auditTime: "",
        //   totalSection: 20
        // },
        // {
        //   id: 2,
        //   subjectTitle: "测试课程2",
        //   userName: "测试用户2",
        //   idCard: "3622262",
        //   startTime: "2020-08-23",
        //   auditStatus: 0,
        //   auditTime: "",
        //   totalSection: 30
        // },
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        subjectId: undefined,
        userName: undefined,
        idCard: undefined,
        startFinishTime: undefined,
        endFinishTime: undefined,
        auditStatus: undefined,
        startAuditTime: undefined,
        endAuditTime: undefined,
        orderField: undefined, // 排序字段
        orderType: undefined,   // 排序方式 倒序 顺序
        studyStatus:undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        subjectId: [
          { required: true, message: "课程id不能为空", trigger: "blur" }
        ],
        userId: [
          { required: true, message: "人员id不能为空", trigger: "blur" }
        ],
      },

      // 课程列表
      subjectList: {},
      // 审核状态
      auditStatus: [{
          value: '0',
          label: '未审核'
        }, {
          value: '1',
          label: '已通过'
        },{
          value: '2',
          label: '作弊'
        }],
      chooseId: []
    };
  },
  created() {
    /** 查询 课程列表 **/
    this.getSubjectList();
    this.getList();
  },
  methods: {
    changeSort(val){
      var fieldName = val.prop;
      var sortingType = val.order;
      if (sortingType == null){
        this.queryParams.orderField = undefined;
        this.queryParams.orderType = undefined;
      }else if(sortingType == "ascending"){
        this.queryParams.orderField = fieldName;
        this.queryParams.orderType = "asc";
      }else if(sortingType == "descending"){
        this.queryParams.orderField = fieldName;
        this.queryParams.orderType = "desc";
      }
      this.getList();
    },
    /** 查询 课程列表 **/
    getSubjectList(){
      auditSubjectList()
      .then(res => {
        if (res.code == 200 && res.data){
          // 将数据赋值
          this.subjectList = res.data
        }else{
          this.$message({
            type: "error",
            message: "获取课程数据失败"
          });
        }
      })
    },
    /** 查询 需要审核的 人员数据 */
    getList() {
      this.loading = true;
      this.userList = [];
      auditUserList(this.queryParams).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        // console.log(this.userList,"=======")
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
        subjectId: undefined,
        userId: undefined,
        startTime: undefined,
        classId: undefined,
        finishTime: undefined,
        learnSection: undefined,
        totalSection: undefined,
        delFlag: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        studyStatus: undefined,
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
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        subjectId: undefined,
        userName: undefined,
        idCard: undefined,
        startFinishTime: undefined,
        endFinishTime: undefined,
        auditStatus: undefined,
        startAuditTime: undefined,
        endAuditTime: undefined,
        studyStatus: undefined,
      }
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // if (selection.length > 1){
      //   this.$message({
      //     type: "error",
      //     message: "每次只能选择一条数据"
      //   });
      //   return false;
      // }
      this.chooseId = selection.map(item => item.id)
      this.single = selection.length<1
      // this.multiple = !selection.length
    },
    /** 审核学习记录按钮操作 */
    handleAdd() {
      this.$router.push({
        name:'audit',
        params: {id:JSON.stringify(this.chooseId)}
      });
    },
    /** 查看作弊学时按钮操作 */
    handleUpdate(row) {
      this.$router.push({
        name:'details',
        params: {id:JSON.stringify(this.chooseId)}
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
    /** 导出按钮操作 */
    handleExport() {
      if (this.chooseId.length > 1){
        this.$message({
          type: "error",
          message: "每次只能选择一条数据"
        });
        return false;
      }
      const id = this.chooseId[0]
      this.$confirm('是否确认导出选中的学员该课程的学时记录', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return apiExport(id);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
