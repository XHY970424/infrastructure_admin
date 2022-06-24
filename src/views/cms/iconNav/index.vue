<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.style" @tab-click="handleClick">
      <el-tab-pane label="底部导航" name="0"/>
      <el-tab-pane label="侧边导航" name="1"/>
    </el-tabs>
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
          <el-option label="停用" :value="0"/>
          <el-option label="启用" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="图标类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择图标类型" clearable size="small">
          <el-option label="跳转链接" :value="0"/>
          <el-option label="二维码" :value="1"/>
          <el-option label="弹出消息框" :value="2"/>
        </el-select>
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入排序"
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
          v-hasPermi="['cms:iconNav:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:iconNav:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:iconNav:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:iconNav:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="iconNavList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="首页图标导航id" align="center" prop="indexIconNavId"/>
      <el-table-column label="标题" align="center" prop="title"/>
      <el-table-column label="图标地址" align="center" prop="icon"/>
      <el-table-column label="背景颜色" align="center" prop="background">
        <template slot-scope="scope">
          <div :style="{background : scope.row.background}"
               style="width: 40px; height : 40px; left : 10px;position: relative"
          >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
         <span :style="{color: (scope.row.status == 0? 'red' : 'green')}">{{
             scope.row.status == 0 ? '停用' : '启用'
           }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标类型" align="center" prop="type">

        <template slot-scope="scope">
          <el-select v-model="scope.row.type" disabled clearable size="small">
            <el-option label="跳转链接" :value="0"/>
            <el-option label="二维码" :value="1"/>
            <el-option label="弹出消息框" :value="2"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="内容/链接/二维码图片地址" align="center" prop="content"/>
      <el-table-column label="排序" align="center" prop="sort"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:iconNav:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:iconNav:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改首页图标导航对话框 -->
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <!-- el-form-item label="图标地址" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标地址"/>
        </el-form-item -->
        <el-row>
          <el-col :span="17">
            <div v-if="queryParams.style == 0" style="margin-left: 12px; color: red">图标比例建议为1:1,尺寸建议为25px*25px,图片大小不超过2M</div>
            <div v-if="queryParams.style == 1" style="margin-left: 12px; color: red">图标比例建议为1:1,尺寸建议为42px*42px,图片大小不超过2M</div>
            <el-form-item label="图标地址" prop="icon"  label-width="80px">
              <el-upload
                class="avatar-uploader"
                :action="uploadBackgroundImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleSealUploadSuccess"
                :before-upload="handleBeforeUpload"
                accept="image/png,image/jpeg,image/jpg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.icon]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.icon" :src="form.icon"/>
          </el-col>
        </el-row>
        <el-form-item label="背景颜色" prop="background">
          <div class="block">
            <el-color-picker v-model="form.background"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标类型">
          <el-select v-model="form.type" placeholder="请选择图标类型">
            <el-option label="跳转链接" :value="0"/>
            <el-option label="二维码" :value="1"/>
            <el-option label="弹出消息框" :value="2"/>
          </el-select>
        </el-form-item>
        <el-row v-show="form.type == 1">
          <el-col :span="18">
            <div style="margin-left: 12px; color: red">建议二维码比例为1:1,尺寸建议为95px*99px,图片大小不超过2M</div>
            <el-form-item label="二维码" prop="content"  label-width="80px">
              <el-upload
                class="avatar-uploader"
                :action="uploadBackgroundImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleQrCodeUploadSuccess"
                :before-upload="handleBeforeUpload"
                accept="image/png,image/jpeg,image/jpg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.content]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.content" :src="form.content"/>
          </el-col>
        </el-row>
        <el-form-item :label="typeName" prop="content" v-show="form.type != 1">
          <el-input v-show="form.type == 0" v-model="form.content" :placeholder="'请输入' + typeName"/>
          <el-input type="textarea" v-show="form.type == 2" maxlength="50" show-word-limit v-model="form.content" :placeholder="'请输入' + typeName"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
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
import { listIconNav, getIconNav, delIconNav, addIconNav, updateIconNav, exportIconNav } from '@/api/cms/iconNav'
import { getToken } from '@/utils/auth'

export default {
  name: 'IconNav',
  data() {
    return {
      // 上传图片地址 上传的图片服务器地址
      uploadBackgroundImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg',
      // 请求头
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      typeName: '',
      // 总条数
      total: 0,
      // 首页图标导航表格数据
      iconNavList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        icon: undefined,
        style: undefined,
        background: undefined,
        status: undefined,
        content: undefined,
        sort: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '图标地址不能为空', trigger: 'blur' }
        ],
        style: [
          { required: true, message: '图标类型不能为空', trigger: 'blur' }
        ],
        background: [
          { required: true, message: '背景颜色不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '图标类型不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容/链接/二维码图片地址不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  }, watch: {
    form: {
      handler: function(newV, oldV) {
        if (this.form.type === 0) {
          this.typeName = '跳转链接'
        } else if (this.form.type === 1) {
          this.typeName = '二维码'
        } else {
          this.typeName = '弹出消息'
        }
      },
      deep: true
    }
  },
  methods: {
    handleClick(tab, event) {
      this.queryParams.style = tab.name
      this.handleQuery()
    }
    ,
    /** 查询首页图标导航列表 */
    getList() {
      this.loading = true
      listIconNav(this.queryParams).then(response => {
        this.iconNavList = response.rows
        this.total = response.total
        this.loading = false
      })
    }
    ,
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    }
    ,
    // 表单重置
    reset() {
      this.form = {
        indexIconNavId: undefined,
        title: undefined,
        icon: undefined,
        style: this.queryParams.style,
        background: undefined,
        status: 0,
        type: 0,
        content: undefined,
        sort: 100,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
      }
      this.resetForm('form')
    }
    ,
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    }
    ,
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    }
    ,
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.indexIconNavId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    }
    ,
    // 上传图片前校验
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 图标上传成功
    handleSealUploadSuccess(res) {
      if (res.code == 200) {
        this.form.icon = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    // 二维码图片上传成功
    handleQrCodeUploadSuccess(res) {
      if (res.code == 200) {
        this.form.content = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加首页图标导航'
    }
    ,
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const indexIconNavId = row.indexIconNavId || this.ids
      getIconNav(indexIconNavId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改首页图标导航'
        this.$forceUpdate()
      })
    }
    ,
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 判断类型为弹出消息框时字数是否超过50字
          if (this.form.type == 2) {
            if (this.form.content.length > 50) {
              this.msgError("弹出消息不能超过50个字!");
              return false;
            }
          }
          if (this.form.indexIconNavId != undefined) {
            updateIconNav(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addIconNav(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    }
    ,
    /** 删除按钮操作 */
    handleDelete(row) {
      const indexIconNavIds = row.indexIconNavId || this.ids
      this.$confirm('是否确认删除首页图标导航编号为"' + indexIconNavIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delIconNav(indexIconNavIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
    ,
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有首页图标导航数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportIconNav(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {
      })
    }
  }
}
</script>
