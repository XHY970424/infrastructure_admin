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
          v-hasPermi="['cms:feature:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:feature:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:feature:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:feature:export']"
        >导出</el-button> -->
<!--      </el-col>-->
    </el-row>

    <span style="font-size: 18px; color: red;display: block;padding-bottom: 10px;">温馨提示: 为不影响前台样式,前台最多会显示 3 条数据</span>
    <el-table v-loading="loading" :data="featureList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="排序" align="center" prop="sort" width="140">
        <template slot-scope="scope">
          <el-input :min="0" type="number" v-model="scope.row.sort" @change="updateSort(scope.row)" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" align="center" prop="sort" width="120px" /> -->
      <el-table-column label="ID" align="center" prop="indexFeatureId" width="120px" />
      <el-table-column label="标题图片" align="center" prop="titleImg">
        <template slot-scope="scope">
          <el-image
            style="width: 50px;"
            :src="scope.row.titleImg"
            :preview-src-list="[scope.row.titleImg]">
          </el-image >
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="描述" align="center" prop="description" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <span> {{scope.row.status == 0 ? '停用' : '启用'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="跳转地址" align="center" prop="url" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="putawayClick(scope.row)"
            v-hasPermi="['cms:feature:edit']"
          >启用</el-button>
          <el-button
            v-show="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-s-release"
            @click="soldOutClick(scope.row)"
            v-hasPermi="['cms:feature:edit']"
          >停用</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:feature:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:feature:remove']"
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

    <!-- 添加或修改首页平台特色对话框 -->
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" maxlength="20" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="标题字体大小" prop="titleFontSize" label-width="110px">
              <el-input-number v-model="form.titleFontSize" placeholder="标题字体大小" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字体大小演示" label-width="110px">
              <span :style="titleFontSizeShow">演示字体大小</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题字体颜色" prop="titleColor" label-width="110px">
              <el-color-picker v-model="form.titleColor" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div style="color: red;"><span>标题图片尺寸建议为66px*66px或84px*84px</span></div>
            <el-form-item label="标题图片" prop="titleImg">
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
            <el-image :preview-src-list="[form.titleImg]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.titleImg" :src="form.titleImg"/>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="form.description" placeholder="请输入描述" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="描述字体大小" prop="descriptionFontSize" label-width="110px">
              <el-input-number :min="1" v-model="form.descriptionFontSize" placeholder="请输入描述字体大小" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字体大小演示" label-width="110px">
              <span :style="descriptionFontSizeShow">描述字体大小演示</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述字体颜色" prop="descriptionColor" label-width="110px">
              <el-color-picker v-model="form.descriptionColor" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="背景颜色" prop="backgroundColor">
              <el-color-picker v-model="form.backgroundColor"></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number :min="0" v-model="form.sort" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">停用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跳转方式" prop="target">
              <el-radio-group v-model="form.target">
                <el-radio :label="0">当前页打开</el-radio>
                <el-radio :label="1">新标签页打开</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="跳转地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入跳转地址" />
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
import { listFeature, getFeature, delFeature, addFeature, updateFeature, exportFeature } from "@/api/cms/feature";
import { getToken } from '@/utils/auth'

export default {
  name: "Feature",
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
      // 首页平台特色表格数据
      featureList: [],
      // 上传图片地址 上传的图片服务器地址
      uploadBackgorundImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg',
      // 请求头
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      queryIndexColumnId: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        indexColumnId: undefined,
        titleImg: undefined,
        title: undefined,
        titleFontSize: undefined,
        description: undefined,
        descriptionFontSize: undefined,
        backgroundColor: undefined,
        sort: undefined,
        status: undefined,
        url: undefined,
        target: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        titleImg: [
          { required: true, message: "请上传标题图片", trigger: "blur" }
        ],
        titleFontSize: [
          { required: true, message: "标题字体大小(可不填)不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "描述不能为空", trigger: "blur" }
        ],
        url: [
          { required: true, message: "跳转地址不能为空", trigger: "blur" }
        ],
        target: [
          { required: true, message: "跳转方式不能为空", trigger: "blur" }
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
  computed: {
      // 标题字体大小
      titleFontSizeShow: function () {
        return "font-size: " + this.form.titleFontSize +"px";
      },
      // 详情字体大小
      descriptionFontSizeShow: function () {
        return "font-size: " + this.form.descriptionFontSize +"px";
      }
  },
  methods: {
    /** 查询首页平台特色列表 */
    getList() {
      this.loading = true;
      // 设置栏目id
      this.queryParams.indexColumnId = this.queryIndexColumnId
      listFeature(this.queryParams).then(response => {
        this.featureList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 更新排序
    updateSort(row){
      let updateData = {};
      updateData.indexFeatureId = row.indexFeatureId
      updateData.sort = row.sort
      updateFeature(updateData).then(res => {
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
      updateData.indexFeatureId = row.indexFeatureId
      updateData.status = 1
      this.$confirm('是否确定启用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateFeature(updateData);
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(function() {});
    },
    // 停用
    soldOutClick(row){
      let updateData = {};
      updateData.indexFeatureId = row.indexFeatureId
      updateData.status = 0
      this.$confirm('是否确定停用该数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateFeature(updateData);
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(function() {});
    },
    // 上传背景图片成功
    handleSealUploadSuccess(res) {
      if (res.code == 200) {
        this.form.titleImg = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        indexFeatureId: undefined,
        indexColumnId: this.queryIndexColumnId,
        titleImg: undefined,
        title: undefined,
        titleFontSize: 26,
        titleColor: '#4a4a4a',
        descriptionColor: '#4a4a4a',
        description: undefined,
        descriptionFontSize: 18,
        backgroundColor: undefined,
        sort: 100,
        status: 0,
        url: undefined,
        target: 0,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
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
      this.ids = selection.map(item => item.indexFeatureId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加首页平台特色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const indexFeatureId = row.indexFeatureId || this.ids
      getFeature(indexFeatureId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改首页平台特色";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.indexFeatureId != undefined) {
            updateFeature(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeature(this.form).then(response => {
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
      const indexFeatureIds = row.indexFeatureId || this.ids;
      this.$confirm('是否确认删除首页平台特色编号为"' + indexFeatureIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFeature(indexFeatureIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有首页平台特色数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFeature(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
