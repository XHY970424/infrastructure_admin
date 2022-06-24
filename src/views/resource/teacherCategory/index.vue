<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
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
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['resource:teachercategory:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['resource:teachercategory:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['resource:teachercategory:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['resource:teachercategory:export']"
          >导出</el-button
        >
      </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="teacherCategoryList"
      border
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" v-if="false" />
      <el-table-column label="类别名称" align="center" prop="title" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" style="color: #00afff">启用</span>
          <span v-if="scope.row.status === 0" style="color: red">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center" prop="iconNotBright">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.iconNotBright"
            style="width: 30px; height: 30px"
            :src="scope.row.iconNotBright"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="图标高亮" align="center" prop="iconBright">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.iconBright"
            style="width: 30px; height: 30px"
            :src="scope.row.iconBright"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
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
            v-hasPermi="['resource:teacherCategory:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['resource:teacherCategory:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改名师专区分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="form.pid">
            <el-option key="0" value="0" label="顶级结点" />
            <el-option
              v-for="item in helpcategoryOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类别名称" prop="title">
          <el-input v-model="form.title" :maxlength="8" placeholder="请输入类别名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="图标" prop="iconNotBright" v-show="form.pid == 0">
          <el-upload
            class="avatar-uploader"
            :action="uploadBackgroundImgUrl"
            :headers="headers"
            :show-file-list="false"
            accept="image/png,image/jpeg,image/jpg"
            :on-success="handleIconNotBrightSuccess"
            :before-upload="beforeIconUpload"
          >
            <img
              v-if="form.iconNotBright"
              :src="form.iconNotBright"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="图标高亮" prop="iconBright" v-show="form.pid == 0">
          <el-upload
            class="avatar-uploader"
            :action="uploadBackgroundImgUrl"
            :headers="headers"
            :show-file-list="false"
            accept="image/png,image/jpeg,image/jpg"
            :on-success="handleIconBrightSuccess"
            :before-upload="beforeIconUpload"
          >
            <img v-if="form.iconBright" :src="form.iconBright" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTeacherCategory,
  getTeacherCategory,
  delTeacherCategory,
  addTeacherCategory,
  updateTeacherCategory,
} from "@/api/resource/teacherCategory";
import { getToken } from "@/utils/auth";
export default {
  name: "TeacherCategory",
  data() {
    return {
      // 请求头
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      // 上传图片地址 上传的图片服务器地址
      uploadBackgroundImgUrl: process.env.VUE_APP_BASE_API + "/file/uploadFile",
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      helpcategoryOptions: [],
      // 名师专区分类表格数据
      teacherCategoryList: [],
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
        tenantId: undefined,
        pid: undefined,
        ancestors: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "类别名称不能为空", trigger: "blur" },
        ],
        status: [
          {
            required: true,
            message: "状态 0-停用 1-启用不能为空",
            trigger: "blur",
          },
        ],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        tenantId: [
          { required: true, message: "租户id不能为空", trigger: "blur" },
        ],
        pid: [{ required: true, message: "上级分类不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getOptions();
  },
  methods: {
    //上传图片前
    beforeIconUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传分类图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //上传图标成功事件
    handleIconNotBrightSuccess(res) {
      if (res.code == 200) {
        this.form.iconNotBright = res.url;
      } else {
        this.$message.error(res.msg);
      }
    },
    //上传高亮图标成功事件
    handleIconBrightSuccess(res) {
      if (res.code == 200) {
        this.form.iconBright = res.url;
      } else {
        this.$message.error(res.msg);
      }
    },
    /** 查询名师专区分类列表 */
    getList() {
      this.loading = true;
      listTeacherCategory(this.queryParams).then((response) => {
        this.teacherCategoryList = response.rows;
        this.total = response.total;
        this.teacherCategoryList = this.handleTree(response.rows, "id", "pid");
        this.loading = false;
      });
    },
    // 获取类别选项
    getOptions() {
      listTeacherCategory({ pid: 0 }).then((response) => {
        this.helpcategoryOptions = response.rows;
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
        title: undefined,
        status: 0,
        sort: undefined,
        remark: undefined,
        tenantId: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        pid: undefined,
        ancestors: undefined,
        iconBright: undefined,
        iconNotBright: undefined,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加名师专区分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getTeacherCategory(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改名师专区分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateTeacherCategory(this.form)
              .then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addTeacherCategory(this.form)
              .then((response) => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除名师专区分类编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          return delTeacherCategory(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.msgSuccess("删除成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.downLoadExcel("/resource/teachercategory/export", this.queryParams);
    },
  },
};
</script>


<style scoped lang="scss">
.avatar-uploader /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
