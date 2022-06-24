<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="讲师姓名" prop="teacherName">
        <el-input
          v-model="queryParams.teacherName"
          placeholder="讲师姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="停用" :value="0" />
          <el-option label="启用" :value="1" />
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cms:teacher:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:teacher:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:teacher:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="teacherList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="排序" align="center" prop="sort" width="140">
        <template slot-scope="scope">
          <el-input :min="0" type="number" v-model="scope.row.sort" @change="updateSort(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="indexTeacherId" width="140"/>
      <el-table-column label="讲师姓名" align="center" prop="teacherName" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span> {{scope.row.status == 0 ? '停用' : '启用'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="putawayClick(scope.row)"
            v-hasPermi="['cms:teacher:edit']"
          >启用</el-button>
          <el-button
            v-show="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-s-release"
            @click="soldOutClick(scope.row)"
            v-hasPermi="['cms:teacher:edit']"
          >停用</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:teacher:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:teacher:remove']"
          >删除</el-button>
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

    <!-- 添加或修改讲师栏目数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="讲师" prop="teacherId">
          <el-select style="width: 100%;" v-model="form.teacherId" filterable clearable placeholder="可搜索">
            <el-option
              v-for="item in teacherOption"
              :key="item.teacherId"
              :label="item.name"
              :value="item.teacherId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number :min="0" v-model="form.sort" placeholder="请输入排序" />
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
import { listTeacher, getTeacher, delTeacher, addTeacher, updateTeacher, exportTeacher } from "@/api/cms/teacher";
import { queryTeacherList } from '@/api/course/teacher'

export default {
  name: "Teacher",
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
      // 讲师栏目数据表格数据
      teacherList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 栏目id
      queryIndexColumnId: undefined,
      // 讲师选项
      teacherOption: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        indexColumnId: undefined,
        teacherId: undefined,
        status: undefined,
        sort: undefined,
        standby: undefined,
        tenantId: undefined,
        teacherName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teacherId: [
          { required: true, message: "请选择讲师", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    // 设置栏目id
    this.queryIndexColumnId = this.$route.query.indexColumnId;
    // 查询专题数据
    queryTeacherList().then(res => {
      this.teacherOption = res.data
    })
    this.getList();
  },
  methods: {
    /** 查询讲师栏目数据列表 */
    getList() {
      this.loading = true;
      this.queryParams.indexColumnId = this.queryIndexColumnId
      listTeacher(this.queryParams).then(response => {
        this.teacherList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 更新排序
    updateSort(row){
      let updateData = {};
      updateData.indexTeacherId = row.indexTeacherId
      updateData.sort = row.sort
      updateTeacher(updateData).then(res => {
        if (res.code == 200){
          this.getList();
          this.msgSuccess("操作成功");
        }else{
          this.msgError(res.msg);
        }
      }).catch(function() {});
    },
    // 启用
    putawayClick(row){
      let updateData = {};
      updateData.indexTeacherId = row.indexTeacherId
      updateData.status = 1
      this.$confirm('是否确定启用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateTeacher(updateData);
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(function() {});
    },
    // 停用
    soldOutClick(row){
      let updateData = {};
      updateData.indexTeacherId = row.indexTeacherId
      updateData.status = 0
      this.$confirm('是否确定停用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateTeacher(updateData);
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(function() {});
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        indexTeacherId: undefined,
        indexColumnId: this.queryIndexColumnId,
        teacherId: undefined,
        status: 0,
        sort: 100,
        standby: undefined,
        tenantId: undefined,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.indexTeacherId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加讲师栏目数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const indexTeacherId = row.indexTeacherId || this.ids
      getTeacher(indexTeacherId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改讲师栏目数据";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.indexTeacherId != undefined) {
            updateTeacher(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTeacher(this.form).then(response => {
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
      const indexTeacherIds = row.indexTeacherId || this.ids;
      this.$confirm('是否确认删除讲师栏目数据编号为"' + indexTeacherIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTeacher(indexTeacherIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有讲师栏目数据数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTeacher(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
