<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="链接标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入友情链接标题"
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
          v-hasPermi="['cms:link:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:link:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:link:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="linkList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="排序" align="center" prop="sort" width="140">
        <template slot-scope="scope">
          <el-input :min="0" type="number" v-model="scope.row.sort" @change="updateSort(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="indexLinkId" width="140"/>
      <el-table-column label="友情链接名称" align="center" prop="title" />
      <el-table-column label="友情链接url地址" align="center" prop="url" />
      <el-table-column label="友情链接图片" align="center" prop="imgUrl" />
      <el-table-column label="友情链接图片" align="center" prop="imgUrl">
        <template slot-scope="scope">
          <el-image
            style="width: 50px;"
            :src="scope.row.imgUrl"
            :preview-src-list="[scope.row.imgUrl]">
          </el-image >
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span> {{scope.row.status == 0 ? '停用' : '启用'}} </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="putawayClick(scope.row)"
            v-hasPermi="['cms:link:edit']"
          >启用</el-button>
          <el-button
            v-show="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-s-release"
            @click="soldOutClick(scope.row)"
            v-hasPermi="['cms:link:edit']"
          >停用</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:link:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:link:remove']"
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

    <!-- 添加或修改友情链接栏目对话框 -->
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="友情链接名称" prop="title" label-width="130px">
          <el-input v-model="form.title" placeholder="请输入友情链接名称" />
        </el-form-item>
        <el-form-item label="友情链接url地址" prop="url" label-width="130px">
          <el-input v-model="form.url" placeholder="请输入友情链接url地址" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <div style="color: red; margin-left: 30px"><span>友情链接图片尺寸建议为291px*80px</span></div>
            <el-form-item label="友情链接图片" prop="imgUrl"  label-width="130px">
              <el-upload
                class="avatar-uploader"
                :action="uploadBackgorundImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleSealUploadSuccess"
                accept="image/png,image/jpeg,image/jpg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.imgUrl]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.imgUrl" :src="form.imgUrl"/>
          </el-col>
        </el-row>
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
import { listLink, getLink, delLink, addLink, updateLink, exportLink } from "@/api/cms/link";
import { getToken } from '@/utils/auth'

export default {
  name: "Link",
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
      // 友情链接栏目表格数据
      linkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 栏目id
      queryIndexColumnId: undefined,
      // 上传图片地址 上传的图片服务器地址
      uploadBackgorundImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg',
      // 请求头
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        indexColumnId: undefined,
        title: undefined,
        url: undefined,
        imgUrl: undefined,
        status: undefined,
        sort: undefined,
        tenantId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "友情链接名称不能为空", trigger: "blur" }
        ],
        url: [
          { required: true, message: "友情链接url地址不能为空", trigger: "blur" }
        ],
        imgUrl: [
          { required: true, message: "请上传友情链接图片", trigger: "blur" }
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
    this.queryIndexColumnId = this.$route.query.indexColumnId;
    this.getList();
  },
  methods: {
    /** 查询友情链接栏目列表 */
    getList() {
      this.loading = true;
      this.queryParams.indexColumnId = this.queryIndexColumnId
      listLink(this.queryParams).then(response => {
        this.linkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上传图片成功
    handleSealUploadSuccess(res) {
      if (res.code == 200) {
        this.form.imgUrl = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    // 更新排序
    updateSort(row){
      let updateData = {};
      updateData.indexLinkId = row.indexLinkId
      updateData.sort = row.sort
      updateLink(updateData).then(res => {
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
      updateData.indexLinkId = row.indexLinkId
      updateData.status = 1
      this.$confirm('是否确定启用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateLink(updateData);
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(function() {});
    },
    // 停用
    soldOutClick(row){
      let updateData = {};
      updateData.indexLinkId = row.indexLinkId
      updateData.status = 0
      this.$confirm('是否确定停用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateLink(updateData);
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
        indexLinkId: undefined,
        indexColumnId: this.queryIndexColumnId,
        title: undefined,
        url: undefined,
        imgUrl: undefined,
        status: 0,
        sort: 100,
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
      this.ids = selection.map(item => item.indexLinkId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加友情链接栏目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const indexLinkId = row.indexLinkId || this.ids
      getLink(indexLinkId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改友情链接栏目";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.indexLinkId != undefined) {
            updateLink(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addLink(this.form).then(response => {
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
      const indexLinkIds = row.indexLinkId || this.ids;
      this.$confirm('是否确认删除友情链接栏目编号为"' + indexLinkIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLink(indexLinkIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有友情链接栏目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLink(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
