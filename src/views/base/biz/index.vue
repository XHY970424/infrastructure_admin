<template>
  <div class="app-container">
    <div style="line-height: 30px;text-align: center;color: red">业务场景</div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="主题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入主题"
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
          v-hasPermi="['cms:biz:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:biz:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:biz:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:biz:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="bizList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主题" align="center" prop="title" />
      <el-table-column label="主题字体大小" align="center" prop="titleSize" />
      <el-table-column label="主题字体颜色" align="center" prop="titleColor" />
      <el-table-column label="主题背景颜色" align="center" prop="backgroundColor" />
      <el-table-column label="图片地址" align="center" prop="img" :show-overflow-tooltip="true"/>
      <el-table-column label="业务场景url" align="center" prop="url" :show-overflow-tooltip="true"/>
      <el-table-column label="描述" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{scope.row.status == 0 ? '停用' : '启用'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="statusUpdate(scope.row)"
            v-hasPermi="['cms:biz:edit']"
          >状态变更</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:biz:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:biz:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改业务场景对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="560px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="主题" prop="title">
              <el-input v-model="form.title" placeholder="请输入主题" />
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>-->
<!--          <el-col :span="24">-->
<!--            <el-form-item label="主题字体大小" label-width="110px" prop="titleSize">-->
<!--              <el-input-number :min="1" v-model="form.titleSize" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="24">-->
<!--            <el-form-item label="主题字体颜色" label-width="110px" prop="titleColor">-->
<!--              <el-color-picker v-model="form.titleColor" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="24">-->
<!--            <el-form-item label="主题背景颜色" label-width="110px" prop="backgroundColor">-->
<!--              <el-color-picker v-model="form.backgroundColor" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="跳转链接" prop="url">
              <el-input v-model="form.url" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div style="color: red;"><span>图片尺寸建议为385px*240px</span></div>
            <el-form-item label="图片地址" prop="img">
              <el-upload
                class="avatar-uploader"
                :action="uploadBackgorundImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleSealUploadSuccess"
                accept="image/png,image/jpeg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.img]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.img" :src="form.img"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">停用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input v-model="form.remark" placeholder="请输入描述,限定字数在250字" show-word-limit type="textarea" maxlength = "250" :rows="2"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBiz, getBiz, delBiz, addBiz, updateBiz, exportBiz } from "@/api/cms/biz";
import { getToken } from '@/utils/auth'

export default {
  name: "Biz",
  data() {
    return {
      // 请求头
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      // 上传图片地址
      uploadBackgorundImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg', // 上传的图片服务器地址
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
      // 业务场景表格数据
      bizList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // 栏目id
        indexColumnId: this.$route.query.indexColumnId,
        title: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        indexColumnId: [
          { required: true, message: "关联栏目id不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "主题不能为空", trigger: "blur" }
        ],
        titleSize: [
          { required: true, message: "主题字体大小不能为空", trigger: "blur" }
        ],
        titleColor: [
          { required: true, message: "主题字体颜色不能为空", trigger: "blur" }
        ],
        backgroundColor: [
          { required: true, message: "主题背景颜色不能为空", trigger: "blur" }
        ],
        img: [
          { required: true, message: "图片地址不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "0停用 1 启用不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 状态变更 */
    statusUpdate(row){
      let statusTxt = row.status==0 ? '启用' : '停用';
      this.$confirm('是否'+statusTxt+'当前内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          indexBizId: row.indexBizId,
          status: row.status == 0 ? 1 : 0
        }
        updateBiz(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      })
    },
    // 上传背景图片成功
    handleSealUploadSuccess(res) {
      if (res.code == 200) {
        this.form.img = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 查询业务场景列表 */
    getList() {
      this.loading = true;
      listBiz(this.queryParams).then(response => {
        this.bizList = response.rows;
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
        indexColumnId: undefined,
        indexBizId: undefined,
        title: undefined,
        img: undefined,
        url: undefined,
        remark: undefined,
        status: 0,
        sort:0,
        titleSize: 16,
        titleColor: '#FFFFFF',
        backgroundColor: '#FF7800',
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
      this.ids = selection.map(item => item.indexBizId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加业务场景";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const indexBizId = row.indexBizId || this.ids
      getBiz(indexBizId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改业务场景";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.indexBizId != undefined) {
            updateBiz(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {

            this.form.indexColumnId = this.queryParams.indexColumnId;
            console.log(this.indexColumnId)
            addBiz(this.form).then(response => {
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
      const indexBizIds = row.indexBizId || this.ids;
      this.$confirm('是否确认删除业务场景编号为"' + indexBizIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBiz(indexBizIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有业务场景数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBiz(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
