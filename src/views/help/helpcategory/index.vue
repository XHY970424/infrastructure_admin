<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="类别名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入类别名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['help:helpcategory:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="helpcategoryList" border :row-class-name="tableRowClassName"
              row-key="helpCategoryId"
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column label="类别名称" header-align="center" prop="title" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" style="color: #00AFFF">启用</span>
          <span v-if="scope.row.status === 0" style="color: red">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['help:helpcategory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['help:helpcategory:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改帮助中心常见问题类别对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="form.pid" >
            <el-option key="0" value="0" label="顶级结点"/>
            <el-option
              v-for="item in helpcategoryOptions"
              :key="item.helpCategoryId"
              :label="item.title"
              :value="item.helpCategoryId" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入类别名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
import { listHelpcategory, getHelpcategory, delHelpcategory, addHelpcategory, updateHelpcategory, exportHelpcategory } from "@/api/help/helpcategory";

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "Helpcategory",
  components: { Treeselect },
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
      helpcategoryOptions: [],
      // 帮助中心常见问题类别表格数据
      helpcategoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        status: undefined,
        sort: undefined,
        pid: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "类别名称不能为空", trigger: "blur" }
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
    this.getList();
    this.getOptions();
  },
  methods: {
    /** 转换专题分类 数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.helpCategoryId,
        label: node.title,
        children: node.children
      }
    },
    // 样式
    tableRowClassName({ row, rowIndex }) {
      if (row.pid === 0) {
        return 'alert-row'
      } else if (row.pid !== 10000) {
        /* return 'success-row';*/
        return 'warning-row'
      }
    },
    /** 查询帮助中心常见问题类别列表 */
    getList() {
      this.loading = true;
      listHelpcategory(this.queryParams).then(response => {
        this.helpcategoryList = this.handleTree(response.data, 'helpCategoryId', 'pid');
        this.loading = false;
      });
    },
    // 获取类别选项
    getOptions(){
      listHelpcategory({"pid": 0}).then(response => {
        this.helpcategoryOptions = response.data;
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
        helpCategoryId: undefined,
        title: undefined,
        status: 0,
        sort: 100,
        remark: undefined,
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
      this.ids = selection.map(item => item.helpCategoryId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加常见问题类别";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const helpCategoryId = row.helpCategoryId || this.ids
      getHelpcategory(helpCategoryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改常见问题类别";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.helpCategoryId != undefined) {
            updateHelpcategory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addHelpcategory(this.form).then(response => {
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
      const helpCategoryIds = row.helpCategoryId || this.ids;
      this.$confirm('是否确认删除常见问题类别编号为"' + helpCategoryIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delHelpcategory(helpCategoryIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有常见问题类别数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHelpcategory(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
