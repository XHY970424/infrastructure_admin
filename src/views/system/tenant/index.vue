<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="租户名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入租户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="租户ip" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入租户访问ip"
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
          v-hasPermi="['system:tenant:add']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="tenantList" @selection-change="handleSelectionChange" border>
      <el-table-column label="租户名称" align="center" prop="name"/>
      <el-table-column label="租户访问ip" align="center" prop="url"/>
      <el-table-column label="租户封面图" align="center" prop="img" :show-overflow-tooltip="true"/>
      <el-table-column label="租户状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 0 ? '停用' : '启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户初始管理员" align="center">
        <el-table-column label="用户名" align="center" prop="userName"/>
        <el-table-column label="昵称" align="center" prop="nickName"/>
        <el-table-column label="手机号码" align="center" prop="phonenumber"/>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:tenant:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleSync(scope.row)"
            v-hasPermi="['system:tenant:sync']"
          >同步资源
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

    <!-- 添加或修改租户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="租户名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入租户名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="租户访问ip" prop="url">
              <el-input v-model="form.url" placeholder="请输入租户访问ip"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="form.img ? 12 : 24">
            <el-form-item label="租户封面图" prop="seal">
              <el-upload
                class="avatar-uploader"
                :action="uploadTenantImgUrl"
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
            <el-image :preview-src-list="[form.img]"
                      style="max-width: 100px;max-height: 100px" :z-index="2200"
                      v-show="form.img" :src="form.img"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名" prop="userName" v-if="form.id == undefined">
              <el-input :disabled="true" v-model="form.userName" placeholder="请输入用户名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="昵称" prop="nickName" v-if="form.id == undefined">
              <el-input :disabled="true" v-model="form.nickName" placeholder="请输入昵称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="手机号码" prop="phonenumber" v-if="form.id == undefined">
              <el-input :disabled="true" v-model="form.phonenumber" placeholder="请输入手机号码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="租户状态" prop="status" v-if="form.id != undefined">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">停用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="warning"
          icon="el-icon-delete"
          @click="handleUserSelect()"
          v-if="form.id == undefined"
        >选择绑定用户
        </el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open=false">取 消</el-button>
      </div>
    </el-dialog>

    <!--  绑定用户  -->
    <el-dialog :title="title" :visible.sync="useropen" width="1200px" append-to-body>
      <user-list-component @updatebindUser="updatebindUser"></user-list-component>
    </el-dialog>

    <!--   租户数据同步  -->
    <el-dialog title="数据同步" :visible.sync="resourceSysn" width="800px" append-to-body>

      <tenant-resource :tenantId="tenantId"/>

    </el-dialog>


  </div>
</template>

<script>
import { addTenant, delTenant, exportTenant, getTenant, listTenant, updateTenant } from '@/api/system/tenant'
import UserListComponent from '@/views/system/tenant/userListComponent'
import TenantResource from '@/views/system/tenant/tenantResource'
import Template from '../../certificate/template/index'
import { getToken } from '@/utils/auth'

export default {
  name: 'Tenant',
  components: { Template, UserListComponent, TenantResource },
  data() {
    return {
      // 请求头
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      // 上传图片地址
      uploadTenantImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg', // 上传的图片服务器地址
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
      // 租户信息表格数据
      tenantList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        url: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '租户名称不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '租户访问ip不能为空', trigger: 'blur' }
        ]
      },
      // dialog用户
      userList: [],
      useropen: false,
      resourceSysn: false,
      tenantId: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 上传证书印章成功
    handleSealUploadSuccess(res) {
      if (res.code == 200) {
        this.form.img = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 查询租户信息列表 */
    getList() {
      this.loading = true
      listTenant(this.queryParams).then(response => {
        this.tenantList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        url: undefined,
        status: 1,
        img: ''
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加租户信息'
    },
    handleUserSelect() {

      this.useropen = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getTenant(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改租户信息'
      })
    },
    /** 提交按钮 */
    submitForm: function() {

      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTenant(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addTenant(this.form).then(response => {
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
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除租户信息编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delTenant(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有租户信息数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportTenant(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {
      })
    },
    updatebindUser(data) {
      console.log(data)
      this.form.userName = data.userName
      this.form.userId = data.userId
      this.form.nickName = data.nickName
      this.form.phonenumber = data.phonenumber
      this.useropen = false
    },
    handleSync(row) {
      this.tenantId = row.id
      this.resourceSysn = true
    }

  }
}
</script>
