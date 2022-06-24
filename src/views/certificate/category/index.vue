<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      @submit.native.prevent
    >
      <el-form-item label="类型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入证书类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['certificate:category:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="categoryList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="证书类型名称" align="center" prop="name" />
      <!--      <el-table-column label="证书状态" align="center" prop="status" >-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{scope.row.status==0?'不启动':'启用'}}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['certificate:category:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['certificate:category:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination-->
    <!--      v-show="total>0"-->
    <!--      :total="total"-->
    <!--      :page.sync="queryParams.pageNum"-->
    <!--      :limit.sync="queryParams.pageSize"-->
    <!--      @pagination="getList"-->
    <!--    />-->

    <!-- 添加或修改证书分类对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入证书类型名称" />
        </el-form-item>
        <!--        <el-form-item label="状态">-->
        <!--          <el-radio-group v-model="form.status">-->
        <!--            <el-radio :label="0">不启用</el-radio>-->
        <!--            <el-radio :label="1">启用</el-radio>-->
        <!--          </el-radio-group>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCategory,
  getCategory,
  delCategory,
  addCategory,
  updateCategory,
  exportCategory,
} from "@/api/certificate/category";
import Template from "../template/index";

export default {
  name: "Category",
  components: { Template },
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
      // 证书分类表格数据
      categoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        name: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "证书类型名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询证书分类列表 */
    getList() {
      this.loading = true;
      if (this.queryParams.name == "") {
        this.queryParams.name = undefined;
      }
      listCategory(this.queryParams).then((response) => {
        this.categoryList = response.data;
        // this.total = response.total;
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
        name: undefined,
        status: 0,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加证书分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCategory(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改证书分类";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCategory(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCategory(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除证书分类编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCategory(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有证书分类数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCategory(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
