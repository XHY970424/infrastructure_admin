<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
      <el-form-item label="渠道来源邀请码" prop="sourceCode">
        <el-input
          v-model="queryParams.sourceCode"
          placeholder="请输入渠道来源邀请码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道来源名称" prop="sourceName">
        <el-input
          v-model="queryParams.sourceName"
          placeholder="请输入渠道来源名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="正常" value="1"/>
          <el-option label="停用" value="0"/>
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
          v-hasPermi="['system:source:add']"
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
          v-hasPermi="['system:source:edit']"
        >修改
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:source:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="sourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="channelSourceId"/>
      <el-table-column label="渠道来源邀请码" align="center" prop="sourceCode"/>
      <el-table-column label="渠道来源名称" align="center" prop="sourceName"/>
      <el-table-column label="绑定用户Id" align="center" prop="userId"/>
      <el-table-column label="绑定用户名" align="center" prop="username"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope"><span> {{ scope.row.status == 0 ? '停用' : '启用' }} </span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:source:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCopy(scope.row)"
          >复制邀请码
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

    <!-- 添加或修改渠道来源对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="渠道来源名称" prop="sourceName">
          <el-input v-model="form.sourceName" placeholder="请输入渠道来源名称"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名" prop="userName" v-if="form.id == undefined">
              <el-input :disabled="true" v-model="form.userName" placeholder="请输入用户名"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        type="warning"
        icon="el-icon-delete"
        @click="handleUserSelect()"
        v-if="form.id == undefined"
      >选择绑定用户
      </el-button>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="copyDialogRow.sourceName" :visible.sync="copyDialog" width="680px" append-to-body>
      <el-row type="flex" align="middle" justify="center">
        <span>邀请码格式: https://www.bbazxw.com/xxx/xx?<span style="color: #00AFFF">sourceCode=<span style="color: red">xxxxx</span></span><span style="color: #00AFFF">&sign=<span style="color: red">xxxxx</span></span></span>
      </el-row>
      <el-divider/>
      <el-row type="flex" align="middle">
        <el-col :span="20">
          <span>https://www.bbazxw.com?sourceCode={{ copyDialogRow.sourceCode }}&sign={{copyDialogRow.signature}}</span>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-document-copy" @click="copy('https://www.bbazxw.com?sourceCode=')">复制</el-button>
        </el-col>
      </el-row>
      <el-divider/>
    </el-dialog>

    <!--  绑定用户  -->
    <el-dialog title="选择绑定用户" :visible.sync="useropen" width="1200px" append-to-body>
      <user-select-component @updatebindUser="updatebindUser"></user-select-component>
    </el-dialog>

  </div>
</template>

<script>
import { listSource, getSource, delSource, addSource, updateSource, exportSource } from '@/api/channel/source'
import Template from '@/views/certificate/template'
import UserSelectComponent from '@/components/user/UserSelectComponent'

export default {
  name: 'Source',
  components: { Template , UserSelectComponent},
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
      useropen: false,
      // 总条数
      total: 0,
      // 渠道来源表格数据
      sourceList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      copyDialog: false,
      copyDialogRow: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sourceCode: undefined,
        sourceName: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        status: 1
      },
      // 表单校验
      rules: {
        sourceName: [
          { required: true, message: '渠道来源名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询渠道来源列表 */
    getList() {
      this.loading = true
      listSource(this.queryParams).then(response => {
        this.sourceList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    handleUserSelect() {

      this.useropen = true
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    }, copy(data) {
      let url = data + this.copyDialogRow.sourceCode + '&sign=' + this.copyDialogRow.signature
      let oInput = document.createElement('input')
      oInput.value = url
      document.body.appendChild(oInput)
      oInput.select() // 选择对象;
      console.log(oInput.value)
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      oInput.remove()
    },
    // 表单重置
    reset() {
      this.form = {
        channelSourceId: undefined,
        sourceName: undefined,
        status: '0',
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      }
      this.resetForm('form')
    },
    updatebindUser(data) {
      console.log(data)
      this.form.userName = data.userName
      this.form.userId = data.userId
      this.form.nickName = data.nickName
      this.form.phonenumber = data.phonenumber
      this.useropen = false
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleCopy(row) {
      this.copyDialog = true
      this.copyDialogRow = row
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.channelSourceId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加渠道来源'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const channelSourceId = row.channelSourceId || this.ids
      getSource(channelSourceId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改渠道来源'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.channelSourceId != undefined) {
            updateSource(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addSource(this.form).then(response => {
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
      const channelSourceIds = row.channelSourceId || this.ids
      this.$confirm('是否确认删除渠道来源编号为"' + channelSourceIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSource(channelSourceIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有渠道来源数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportSource(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {
      })
    }
  }
}
</script>
