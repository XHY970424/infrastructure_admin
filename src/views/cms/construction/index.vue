<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
          v-hasPermi="['cms:newconstruction:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:newconstruction:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:newconstruction:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="排序" align="center" prop="sort" width="140">
        <template slot-scope="scope">
          <el-input :min="0" type="number" v-model="scope.row.sort" @change="updateSort(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="indexConstructionId" width="120" />
      <el-table-column label="新基建课程名称" align="center" prop="courseTitle" />
      <el-table-column label="占用列数" align="center" prop="colspan" />
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
            v-hasPermi="['cms:newconstruction:edit']"
          >启用</el-button>
          <el-button
            v-show="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-s-release"
            @click="soldOutClick(scope.row)"
            v-hasPermi="['cms:newconstruction:edit']"
          >停用</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:newconstruction:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:newconstruction:remove']"
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

    <!-- 添加或修改课程栏目数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="选择课程" prop="subjectId">
          <el-input v-model="form.courseTitle" disabled/>
          <el-input v-model="form.subjectId" v-show="false"/>
          <el-button type="primary" @click="ctoCourseOpen=true">选择课程</el-button>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="占用列数" prop="colspan">
          <el-input-number v-model="form.colspan" :min="1" :max="4" placeholder="占用列数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <CtoCourse @cancelCtoCourse="ctoCourseOpen=false"
               categoryTitle="添加课程分类"
               :open="ctoCourseOpen"
               v-show="ctoCourseOpen"
               @choose-subject="chooseSubject"
    ></CtoCourse>
  </div>
</template>

<script>
import {
  listNewconstruction,
  getNewconstruction,
  addNewconstruction,
  updateNewconstruction,
  delNewconstruction,
  exportNewconstruction
} from "@/api/cms/newconstruction";
import CtoCourse from '@/components/CtoCourse'

export default {
  name: "Construction",
  components: { CtoCourse },
  data() {
    return {
      // 是否展示选择
      ctoCourseOpen: false,
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
      // 课程栏目数据表格数据
      courseList: [],
      // 下拉选择课程数据
      courseOption: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 栏目id
      queryIndexColumnId: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        indexColumnId: undefined,
        courseId: undefined,
        status: undefined,
        sort: undefined,
        standby: undefined,
        tenantId: undefined,
        courseTitle: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        subjectId: [
          { required: true, message: "请选择课程", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        colspan: [
          { required: true, message: "占用列数不能为空", trigger: "blur" }
        ],
      },
      chooseSubjectInfo: {},
    };
  },
  created() {
    // 设置栏目id
    this.queryIndexColumnId = this.$route.query.indexColumnId;
    this.getList();
  },
  methods: {
    // 子组件选中后触发的事件
    chooseSubject(info) {
      this.chooseSubjectInfo = info;
      this.form.subjectId = info.id
      this.form.categoryId = info.categoryId
      this.form.courseTitle = info.subjectTitle
      this.form.teacherName = info.teacher
      this.form.subjectImageUrl = info.subjectImageUrl
      this.form.hours = info.hours
    },
    /** 查询新基建栏目数据列表 */
    getList() {
      this.loading = true;
      this.queryParams.indexColumnId = this.queryIndexColumnId
      listNewconstruction(this.queryParams).then(response => {
        this.courseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 更新排序
    updateSort(row){
      let updateData = {};
      updateData.indexConstructionId = row.indexConstructionId
      updateData.sort = row.sort
      updateNewconstruction(updateData).then(res => {
        if (res.code === 200){
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
      updateData.indexConstructionId = row.indexConstructionId
      updateData.status = 1
      this.$confirm('是否确定启用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateNewconstruction(updateData);
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(function() {});
    },
    // 停用
    soldOutClick(row){
      let updateData = {};
      updateData.indexConstructionId = row.indexConstructionId
      updateData.status = 0
      this.$confirm('是否确定停用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateNewconstruction(updateData);
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
        indexConstructionId: undefined,
        indexColumnId: this.queryIndexColumnId,
        subjectId: undefined,
        status: 0,
        sort: 100,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        tenantId: undefined,
        colspan: 1,
        categoryId: undefined,
        courseTitle: null,
        teacherName: null,
        subjectImageUrl: null,
        hours: null,
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
      this.ids = selection.map(item => item.indexConstructionId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加新基建栏目数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const indexConstructionId = row.indexConstructionId || this.ids
      getNewconstruction(indexConstructionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改新基建栏目数据";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.indexConstructionId !== undefined) {
            updateNewconstruction(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addNewconstruction(this.form).then(response => {
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
      const indexConstructionIds = row.indexConstructionId || this.ids;
      this.$confirm('是否确认删除课程栏目数据编号为"' + indexConstructionIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNewconstruction(indexConstructionIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  }
};
</script>
