<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="链接类型" prop="target">
        <el-select v-model="queryParams.target" placeholder="请选择链接类型" clearable size="small">
          <el-option label="路由" :value="0"/>
          <el-option label="外链" :value="1"/>
          <el-option label="下载文件" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="停用" :value="0"/>
          <el-option label="启用" :value="1"/>
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
          v-hasPermi="['help:helpself:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['help:helpself:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['help:helpself:remove']"
        >删除</el-button>
      </el-col>
      <!-- el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['help:helpself:export']"
        >导出</el-button>
      </el-col -->
    </el-row>

    <el-table v-loading="loading" :data="helpselfList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="helpSelfId" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="图标" align="center" prop="icon" >
        <!--显示图片-->
        <template slot-scope="scope">
          <el-image
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.icon"
            :preview-src-list="[scope.row.icon]">
          </el-image>
        </template>
      </el-table-column>
      <!-- el-table-column label="背景颜色" align="center" prop="background" / -->
      <el-table-column label="链接类型" align="center" prop="target">
        <template slot-scope="scope">
          <span v-if="scope.row.target === 1" style="color: #00AFFF">外链</span>
          <span v-if="scope.row.target === 0" style="color: #1ab394">路由</span>
          <span v-if="scope.row.target === 2" style="color: #7a6df0">下载文件</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" align="center" prop="link" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" style="color: #00AFFF">启用</span>
          <span v-if="scope.row.status === 0" style="color: red">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['help:helpself:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['help:helpself:remove']"
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

    <!-- 添加或修改帮助中心自助服务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <div style="color: red">图标大小不超过2M, 建议尺寸为64*64px</div>
        <el-form-item label="上传图标" prop="icon">
          <el-upload
            ref="logo"
            :show-file-list="false"
            action=""
            :http-request="fileUploadLogo"
            :auto-upload="true"
            list-type="picture"
            accept="image/*"
            name="logo_file"
            :before-upload="handleBeforeUpload"
          >
            <el-button size="small" type="primary" icon="el-icon-upload"
            >点击上传</el-button
            >
          </el-upload>
          <el-input v-model="form.icon" v-show="false" />
          <el-image v-show="form.icon!=null && form.icon!=''" :z-index="2100"
                    style="max-width: 100px;max-height: 100px"
                    :src="form.icon" :preview-src-list="[form.icon]">
          </el-image>
        </el-form-item>
        <!-- el-form-item label="背景颜色" prop="background">
          <div class="block">
            <el-color-picker v-model="form.background"></el-color-picker>
          </div>
        </el-form-item -->
        <el-form-item label="链接类型" prop="target">
          <el-radio-group v-model="form.target">
            <el-radio :label="0">路由</el-radio>
            <el-radio :label="1">外链</el-radio>
            <el-radio :label="2">下载文件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接地址" prop="link">
          <el-input v-model="form.link" style="width: 400px" placeholder="请输入链接地址" />
          <el-upload
            style="display: inline-block;"
            v-show="form.target == 2"
            ref="link"
            :show-file-list="false"
            action=""
            :http-request="fileUpload"
            :auto-upload="true"
            name="link_file"
            :before-upload="handleBeforeUploadFile"
          >
            <el-button size="small" type="primary" icon="el-icon-upload"
            >点击上传文件</el-button
            >
          </el-upload>
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
import { listHelpself, getHelpself, delHelpself, addHelpself, updateHelpself, exportHelpself } from "@/api/help/helpself";
import { fileUpload, fileAnyUpload } from "@/api/base/website";

export default {
  name: "Helpself",
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
      // 帮助中心自助服务表格数据
      helpselfList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        icon: undefined,
        background: undefined,
        target: undefined,
        link: undefined,
        status: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        icon: [
          { required: true, message: "图标不能为空", trigger: "blur" }
        ],
        target: [
          { required: true, message: "链接类型", trigger: "blur" }
        ],
        link: [
          { required: true, message: "链接地址不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 上传前台下载文件
    fileUpload(file) {
      fileAnyUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.link = res.url;
        } else {
          this.$message.error("上传文件异常");
        }
      });
    },
    // 上传文件前校验
    handleBeforeUploadFile(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 上传图片前校验
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 上传图片
    fileUploadLogo(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.icon = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    /** 查询帮助中心自助服务列表 */
    getList() {
      this.loading = true;
      listHelpself(this.queryParams).then(response => {
        this.helpselfList = response.rows;
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
        helpSelfId: undefined,
        title: undefined,
        icon: undefined,
        background: undefined,
        target: undefined,
        link: undefined,
        status: 0,
        sort: 100,
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
      this.ids = selection.map(item => item.helpSelfId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加帮助中心自助服务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const helpSelfId = row.helpSelfId || this.ids
      getHelpself(helpSelfId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改帮助中心自助服务";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.helpSelfId != undefined) {
            updateHelpself(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addHelpself(this.form).then(response => {
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
      const helpSelfIds = row.helpSelfId || this.ids;
      this.$confirm('是否确认删除帮助中心自助服务编号为"' + helpSelfIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delHelpself(helpSelfIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有帮助中心自助服务数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHelpself(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
