<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="停用" :value="0" />
          <el-option label="启用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="链接方式" prop="target">
        <el-select v-model="queryParams.target" placeholder="请选择链接方式">
          <el-option label="路由" :value="0" />
          <el-option label="外链" :value="1" />
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
          v-hasPermi="['cms:navbanner:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:navbanner:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:navbanner:remove']"
        >删除</el-button>
      </el-col>
      <!-- el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:navbanner:export']"
        >导出</el-button>
      </el-col -->
    </el-row>

    <el-table v-loading="loading" :data="navbannerList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="navBannerId" width="80"/>
      <el-table-column label="排序" align="center" prop="sort" width="110" >
        <template slot-scope="scope">
          <el-input :min="0" type="number" v-model="scope.row.sort" @change="updateSort(scope.row)"/>
        </template>
      </el-table-column>
      <!-- el-table-column label="顶部导航id" align="center" prop="indexTopNavId" / -->
      <el-table-column label="图片" align="center" prop="imgUrl" >
        <!--显示图片-->
        <template slot-scope="scope">
          <el-image
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.imgUrl"
            :preview-src-list="[scope.row.imgUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span> {{scope.row.status == 0 ? '停用' : '启用'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="跳转链接" align="center" prop="link" />
      <el-table-column label="链接方式" align="center" prop="target" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span> {{scope.row.target == 0 ? '路由' : '外链'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:navbanner:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:navbanner:remove']"
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

    <!-- 添加或修改内页轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <div style="color: red; padding-left: 20px">建议图片大小为1920px*280px</div>
        <el-form-item label="图片" prop="imgUrl">
<!--          <el-input v-model="form.imgUrl" placeholder="请输入图片地址" />-->
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
          <el-input v-model="form.imgUrl" v-show="false" />
          <el-image v-show="form.imgUrl!=null && form.imgUrl!=''" :z-index="2100"
                    style="max-width: 100px;max-height: 100px"
                    :src="form.imgUrl" :preview-src-list="[form.imgUrl]">
          </el-image>
        </el-form-item>
        <el-form-item label="链接方式" prop="target">
          <el-radio-group v-model="form.target">
            <el-radio :label="0">路由</el-radio>
            <el-radio :label="1">外链</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入跳转链接" />
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
import { listNavbanner, getNavbanner, delNavbanner, addNavbanner, updateNavbanner, exportNavbanner } from "@/api/cms/navbanner";
import Template from "../../certificate/template/index";
import { fileUpload } from "@/api/base/website";

export default {
  name: "Navbannera",
  components: {Template},
  data() {
    return {
      indexTopNavId: undefined,
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
      // 内页轮播图表格数据
      navbannerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        indexTopNavId: undefined,
        imgUrl: undefined,
        status: undefined,
        sort: undefined,
        title: undefined,
        link: undefined,
        target: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        indexTopNavId: [
          { required: true, message: "顶部导航id不能为空", trigger: "blur" }
        ],
        imgUrl: [
          { required: true, message: "状态 0-停用 1-启用不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态 0-停用 1-启用不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        link: [
          { required: true, message: "跳转链接不能为空", trigger: "blur" }
        ],
        target: [
          { required: true, message: "链接方式 0-路由 1-外链不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    // 路由获取顶部导航id
    const indexTopNavId = this.$route.query && this.$route.query.indexTopNavId;
    this.queryParams.indexTopNavId = indexTopNavId;
    this.indexTopNavId = indexTopNavId;
    this.getList();
  },
  methods: {
    //更新排序
    updateSort(data) {
      let updateData = {}
      updateData.sort = data.sort
      updateData.navBannerId = data.navBannerId
      updateNavbanner(updateData).then(response => {
        if (response.code === 200) {
          this.msgSuccess('修改成功')
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })
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
          this.form.imgUrl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    /** 查询内页轮播图列表 */
    getList() {
      this.loading = true;
      listNavbanner(this.queryParams).then(response => {
        this.navbannerList = response.rows;
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
        navBannerId: undefined,
        indexTopNavId: undefined,
        imgUrl: undefined,
        status: 0,
        sort: 100,
        title: undefined,
        link: undefined,
        target: 0,
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
      this.ids = selection.map(item => item.navBannerId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加内页轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const navBannerId = row.navBannerId || this.ids
      getNavbanner(navBannerId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改内页轮播图";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.indexTopNavId = this.indexTopNavId
          if (this.form.navBannerId != undefined) {
            updateNavbanner(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addNavbanner(this.form).then(response => {
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
      const navBannerIds = row.navBannerId || this.ids;
      this.$confirm('是否确认删除内页轮播图编号为"' + navBannerIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNavbanner(navBannerIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有内页轮播图数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportNavbanner(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
