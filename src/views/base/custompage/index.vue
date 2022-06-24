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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="草稿" :value="0" />
          <el-option label="上线" :value="1" />
          <el-option label="下线" :value="2" />
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
          v-hasPermi="['eycode:custompage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eycode:custompage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:custompage:remove']"
        >删除</el-button>
      </el-col>
      <!-- el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:custompage:export']"
        >导出</el-button>
      </el-col -->
    </el-row>

    <el-table v-loading="loading" :data="custompageList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="customPageId" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="链接" align="center" >
        <template slot-scope="scope">
          <span v-show="scope.row.status == 1"> {{pageRoute + scope.row.customPageId}} </span>
        </template>
      </el-table-column>
      <el-table-column label="顶部导航栏" align="center" >
        <template slot-scope="scope">
          <span> {{scope.row.showHeadNav == 0 ? '不显示' : '显示'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="底部导航栏" align="center" >
        <template slot-scope="scope">
          <span> {{scope.row.showBottomNav == 0 ? '不显示' : '显示'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="侧边咨询栏" align="center" >
        <template slot-scope="scope">
          <span> {{scope.row.showSidebar == 0 ? '不显示' : '显示'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center" prop="img" >
        <!--显示图片-->
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.img"
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.img"
            :preview-src-list="[scope.row.img]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope" >
          <span v-if="scope.row.status == 0"> 草稿 </span>
          <span v-if="scope.row.status == 1"> 上线 </span>
          <span v-if="scope.row.status == 2"> 下线 </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:custompage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:custompage:remove']"
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

    <!-- 添加或修改自定义推广页对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="是否显示顶部导航栏" label-width="150px" prop="showHeadNav">
          <el-radio-group v-model="form.showHeadNav">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示底部导航栏" label-width="150px" prop="showBottomNav">
          <el-radio-group v-model="form.showBottomNav">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示侧边咨询栏" label-width="150px" prop="showSidebar">
          <el-radio-group v-model="form.showSidebar">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">上线</el-radio>
            <el-radio :label="2">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面图" prop="img">
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
            <!--            <div slot="tip" class="el-upload__tip">只能上传不超过 5MB 的image/*文件</div>-->
          </el-upload>
          <el-input v-model="form.img" v-show="false" />
          <el-image v-show="form.img!=null && form.img!=''" :z-index="2100"
                    style="max-width: 100px;max-height: 100px"
                    :src="form.img" :preview-src-list="[form.img]">
          </el-image>
        </el-form-item>
        <el-form-item label="页面内容" prop="content">
          <EditorTow id="contentEditor" v-if="open" v-model="form.content"/>
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
import { listCustompage, getCustompage, delCustompage, addCustompage, updateCustompage, exportCustompage, getRouteConfig } from "@/api/base/custompage";
import { fileUpload } from "@/api/base/website";
import EditorTow from "@/components/Tinymce";
import Template from "../../certificate/template/index";

export default {
  name: "Custompage",
  components: {Template, EditorTow },
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
      // 自定义推广页表格数据
      custompageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 自定义页面配置的前端跳转路由
      pageRoute: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        img: undefined,
        content: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "页面内容不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        showHeadNav: [
          { required: true, message: "请选择是否显示顶部导航", trigger: "blur" }
        ],
        showBottomNav: [
          { required: true, message: "请选择是否显示底部导航", trigger: "blur" }
        ],
        showSidebar: [
          { required: true, message: "请选择是否显示侧边咨询栏", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    getRouteConfig().then(res => {
      if (res.data) {
        this.pageRoute = res.data
      }
    })
    this.getList();
  },
  methods: {
    // 上传图片前校验
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //上传封面图片
    fileUploadLogo(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.img = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    /** 查询自定义推广页列表 */
    getList() {
      this.loading = true;
      listCustompage(this.queryParams).then(response => {
        this.custompageList = response.rows;
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
        customPageId: undefined,
        title: undefined,
        img: undefined,
        content: undefined,
        status: 0,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        showHeadNav: 1,
        showBottomNav: 1,
        showSidebar: 1,
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
      this.ids = selection.map(item => item.customPageId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加自定义推广页";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const customPageId = row.customPageId || this.ids
      getCustompage(customPageId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改自定义推广页";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.customPageId != undefined) {
            updateCustompage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCustompage(this.form).then(response => {
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
      const customPageIds = row.customPageId || this.ids;
      this.$confirm('是否确认删除自定义推广页编号为"' + customPageIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCustompage(customPageIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有自定义推广页数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCustompage(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
