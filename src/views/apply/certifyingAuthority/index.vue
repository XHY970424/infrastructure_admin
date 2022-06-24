<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="发证机构名称" prop="authorityName">
        <el-input
          v-model="queryParams.authorityName"
          placeholder="请输入发证机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="机构状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['apply:certifyingAuthority:add']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="certifyingAuthorityList" @selection-change="handleSelectionChange" border>
      <el-table-column label="发证机构名称" align="center" prop="authorityName"/>
      <el-table-column label="联系人" align="center" prop="contactName"/>
      <el-table-column label="联系电话" align="center" prop="contacPhone"/>
      <el-table-column label="关联课题数" align="center" prop="subjectNum"/>
      <el-table-column label="报名总人数" align="center" prop="applyNum"/>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="createBy"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
      >
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInfo(scope.row)"
            v-hasPermi="['apply:certifyingAuthority:query']"
          >查看详情
          </el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['apply:certifyingAuthority:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['apply:certifyingAuthority:remove']"
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

    <!-- 添加或修改发证机构对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="发证机构名称" prop="authorityName">
          <el-input v-model="form.authorityName" :maxlength="30" show-word-limit placeholder="请输入发证机构名称"/>
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人"/>
        </el-form-item>
        <el-form-item label="联系人手机号" prop="contacPhone">
          <el-input v-model="form.contacPhone" placeholder="请输入联系人手机号"/>
        </el-form-item>
        <el-form-item label="状态" v-if="isAdd">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog title="机构详情" :visible.sync="infoOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发证机构名称：">{{info.authorityName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人：">{{info.contactName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人手机号：">{{info.contacPhone}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人：">{{info.createBy}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创建时间：">{{formatTime(info.createTime)}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoOpen=false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情end -->
  </div>
</template>

<script>
  import {
    listCertifyingAuthority,
    getCertifyingAuthority,
    updateStatus,
    delCertifyingAuthority,
    addCertifyingAuthority,
    updateCertifyingAuthority,
    exportCertifyingAuthority
  } from '@/api/apply/certifyingAuthority'

  export default {
    name: 'CertifyingAuthority',
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
        // 状态数据字典
        statusOptions: [],
        //是否新增
        isAdd: true,
        // 发证机构表格数据
        certifyingAuthorityList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        //是否显示详情弹出层
        infoOpen: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          authorityName: undefined,
          status: undefined,
          isDeleted: 0
        },
        //机构详情
        info: {},
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          authorityName: [
            { required: true, message: '发证机构名称不能为空', trigger: 'blur' }
          ],
          contactName: [
            { required: true, message: '联系人不能为空', trigger: 'blur' }
          ],
          contacPhone: [
            { required: true, message: '联系人手机号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
      this.getDicts('apply_certificate_status').then(response => {
        this.statusOptions = response.data
      })
    },
    methods: {
      // 状态修改
      handleStatusChange(row) {
        let text = row.status === 1 ? '启用' : '停用'
        this.$confirm('确认要"' + text + '""' + row.authorityName + '"机构吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return updateStatus({ ids: [row.authorityId], status: row.status })
        }).then(() => {
          this.msgSuccess(text + '成功')
        }).catch(function() {
          row.status = row.status === 0 ? 1 : 0
        })
      },
      /** 查询发证机构列表 */
      getList() {
        this.loading = true
        listCertifyingAuthority(this.queryParams).then(response => {
          this.certifyingAuthorityList = response.rows
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
          authorityId: undefined,
          authorityName: undefined,
          contactName: undefined,
          contacPhone: undefined,
          subjectNum: undefined,
          applyNum: undefined,
          status: '0',
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          isDeleted: undefined
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
        this.ids = selection.map(item => item.authorityId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.isAdd = true
        this.open = true
        this.title = '添加发证机构'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const authorityId = row.authorityId || this.ids
        getCertifyingAuthority(authorityId).then(response => {
          this.form = response.data
          this.open = true
          this.isAdd = false
          this.title = '修改发证机构'
        })
      },
      /**查看详情 */
      handleInfo(row) {
        const authorityId = row.authorityId || this.ids
        getCertifyingAuthority(authorityId).then((response) => {
          this.info = response.data
          this.infoOpen = true
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.authorityId != undefined) {
              updateCertifyingAuthority(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addCertifyingAuthority(this.form).then(response => {
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
        const authorityIds = row.authorityId || this.ids
        this.$confirm('是否确认删除发证机构名为"' + row.authorityName + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delCertifyingAuthority(authorityIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有发证机构数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportCertifyingAuthority(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
