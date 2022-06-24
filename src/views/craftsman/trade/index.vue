<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="行业编码" prop="tradeNo">
        <el-input
          v-model="queryParams.tradeNo"
          placeholder="请输入行业编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行业名称" prop="tradeName">
        <el-input
          v-model="queryParams.tradeName"
          placeholder="请输入行业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="tradeStatus">
        <el-select v-model="queryParams.tradeStatus" placeholder="请选择状态" clearable size="small">
          <el-option label="正常" value=1 />
          <el-option label="禁用" value=0 />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="父级行业" prop="parentId">
        <treeselect clearable size="small" v-model="queryParams.parentId" :options="tradeOptions" :normalizer="normalizer" placeholder="请选择父级行业" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eycode:trade:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:trade:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tradeList"
      row-key="tradeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="行业编码" align="center" prop="tradeNo" />
      <el-table-column label="行业名称" align="center" prop="tradeName" />
      <el-table-column label="状态" align="center" prop="tradeStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.tradeStatus == 1">正常</span>
          <span v-if="scope.row.tradeStatus == 0">禁用</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="父级行业" align="center" prop="parentId" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:trade:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:trade:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改企业行业对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="行业名称" prop="tradeName">
          <el-input v-model="form.tradeName" placeholder="请输入行业名称" />
        </el-form-item>
        <el-form-item label="父级行业" prop="parentId">
          <treeselect v-model="form.parentId" :options="tradeOptions" :normalizer="normalizer" placeholder="请选择父级行业" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.tradeStatus">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
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
import { listTrade, getTrade, delTrade, addTrade, updateTrade, exportTrade } from "@/api/craftsman/trade";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Trade",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 企业行业表格数据
      tradeList: [],
      // 企业行业树选项
      tradeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        tradeNo: undefined,
        tradeName: undefined,
        tradeStatus: undefined,
        parentId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tradeNo: [
          { required: true, message: "行业编码不能为空", trigger: "blur" }
        ],
        tradeName: [
          { required: true, message: "行业名称不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "父级行业id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询企业行业列表 */
    getList() {
      this.loading = true;
      listTrade(this.queryParams).then(response => {
        this.tradeList = this.handleTree(response.data, "tradeId", "parentId");
        this.loading = false;
      });
    },
    /** 转换企业行业数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.tradeId,
        label: node.tradeName,
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      listTrade().then(response => {
        this.tradeOptions = [];
        const data = { tradeId: 0, tradeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "tradeId", "parentId");
        this.tradeOptions.push(data);
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
        tradeId: undefined,
        tradeNo: undefined,
        tradeName: undefined,
        tradeStatus: 1,
        parentId: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加企业行业";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.tradeId;
      }
      getTrade(row.tradeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改企业行业";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('确认导出所有的行业数据(仅会导出筛选的正常数据,禁用数据不会导出)?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTrade(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.tradeId != undefined) {
            updateTrade(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTrade(this.form).then(response => {
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
      this.$confirm('是否确认删除企业行业编号为"' + row.tradeId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTrade(row.tradeId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>
