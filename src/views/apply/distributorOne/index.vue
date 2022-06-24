<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="分销商名" prop="distributorName">
        <el-input
          v-model="queryParams.distributorName"
          placeholder="请输入分销商名称"
          show-word-limit
          :maxlength="30"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="禁用" :value="0"/>
          <el-option label="启用" :value="1"/>
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
          v-hasPermi="['apply:distributorOne:add']"
        >新增分销商(一级)
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['apply:distributorOne:edit']"-->
      <!--        >修改</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['apply:distributorOne:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['apply:distributorOne:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="distributorOneList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="分销商名称" align="center" prop="distributorName"/>
      <el-table-column label="用户名" align="center" prop="nickName"/>
      <el-table-column label="手机号" align="center" prop="phonenumber"/>
      <el-table-column label="关联课题数" align="center" prop="topicNum"/>
      <el-table-column label="分销报名数" align="center" prop="directApplyNum"/>
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
      <el-table-column label="创建人" align="center" prop="createBy"/>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['apply:distributorOne:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
          >结算管理
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['apply:distributorOne:remove']"-->
          <!--          >删除</el-button>-->
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

    <!-- 添加或修改分销商(一级)对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div style="color: red;margin-bottom: 5px" v-if="form.distributorId">注:手机号修改后登陆账户同步修改</div>
        <el-form-item label="分销商名" prop="distributorName">
          <el-input v-model="form.distributorName" show-word-limit :maxlength="30" placeholder="请输入分销商名称"/>
        </el-form-item>
        <el-form-item label="账号管理" prop="account" v-if="!form.distributorId">
          <el-radio-group v-model="form.account">
            <el-radio :label="0">创建新账号</el-radio>
            <el-radio :label="1">绑定已有账号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-show="form.account==1">
          <el-button type="primary" icon="el-icon-user-solid" round @click="bindingUser">绑定用户</el-button>
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户名" :disabled="form.account==1"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号" :disabled="form.account==1"/>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-show="!form.distributorId">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 学员列表弹出框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择用户"
      :visible.sync="userOpen"
      width="800px"
      append-to-body
    >
      <el-form
        :model="userParams"
        :inline="true"
        label-width="68px"
        @submit.native.prevent
      >
        <el-form-item label="">
          <el-input
            v-model="userParams.userName"
            placeholder="请输入用户名称"
            clearable
            size="small"
            @keyup.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getUserList"
          >搜索
          </el-button
          >
        </el-form-item>
      </el-form>
      <el-table v-loading="userLoading" :data="userList" border>
        <el-table-column label="用户名" align="center" prop="userName"/>
        <el-table-column label="用户姓名" align="center" prop="nickName"/>
        <el-table-column label="手机号" align="center" prop="phonenumber"/>
        <el-table-column label="邮箱" align="center" prop="email"/>
        <el-table-column label="是否为二级分销商" align="center" prop="remark">
          <template slot-scope="scope">
            <span>{{scope.row.remark == '0' ? '否' : '是'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="confirmSelect(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="userTotal > 0"
        :total="userTotal"
        :page.sync="userParams.pageNum"
        :limit.sync="userParams.pageSize"
        @pagination="getUserList()"
      />
    </el-dialog>

    <!-- 分销商(一级)详情对话框 -->
    <el-dialog title="分销商(一级)详情" :visible.sync="detailOpen" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分销商名" prop="distributorName">
          <el-input v-model="form.distributorName" placeholder="请输入分销商名称" disabled/>
        </el-form-item>
        <el-form-item label="用户名" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户名" disabled/>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号" disabled/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addDistributorOne,
    delDistributorOne,
    exportDistributorOne,
    getDistributorOne,
    listDistributorOne,
    updateDistributorOne,
    updateStatus
  } from '@/api/apply/distributorOne'
  import { queryUserList } from '@/api/system/user'
  import Template from '../../certificate/template/index'

  export default {
    name: 'DistributorOne',
    components: { Template },
    data() {
      return {
        detailOpen: false,
        userOpen: false,
        userLoading: true,
        userList: [],
        userTotal: 0,
        userParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined
        },
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
        // 分销商(一级)表格数据
        distributorOneList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          distributorName: undefined,
          parentDistributorId: undefined,
          parentDistributorName: undefined,
          uid: undefined,
          nickName: undefined,
          phonenumber: undefined,
          topicNum: undefined,
          directApplyNum: undefined,
          indirectApplyNum: undefined,
          extractMoney: undefined,
          lastExtractTime: undefined,
          extractNum: undefined,
          status: undefined,
          isDeleted: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          distributorName: [
            { required: true, message: '分销商名称不能为空', trigger: 'blur' }
          ],
          uid: [
            { required: true, message: '后台用户id不能为空', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          phonenumber: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          topicNum: [
            { required: true, message: '课题数不能为空', trigger: 'blur' }
          ],
          directApplyNum: [
            { required: true, message: '直接分销报名数不能为空', trigger: 'blur' }
          ],
          indirectApplyNum: [
            { required: true, message: '间接分销报名数不能为空', trigger: 'blur' }
          ],
          extractMoney: [
            { required: true, message: '已提现金额不能为空', trigger: 'blur' }
          ],
          extractNum: [
            { required: true, message: '提现次数不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态{0:禁用,1:启用}不能为空', trigger: 'blur' }
          ],
          isDeleted: [
            { required: true, message: '逻辑删除{0:否,2:是}不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 详情 */
      handleDetail(row) {
        getDistributorOne(row.distributorId).then(response => {
          this.form = response.data
          this.detailOpen = true
        })
      },
      // 状态修改
      handleStatusChange(row) {
        let text = row.status === 1 ? '启用' : '停用'
        this.$confirm(
          '确认要"' + text + '""' + row.distributorName + '"分销商吗?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(function() {
            return updateStatus({ ids: [row.distributorId], status: row.status })
          })
          .then(() => {
            this.msgSuccess(text + '成功')
          })
          .catch(function() {
            row.status = row.status === 0 ? 1 : 0
          })
      },
      /** 选择用户 */
      confirmSelect(row) {
        this.form.uid = row.userId
        this.form.nickName = row.nickName
        this.form.phonenumber = row.phonenumber
        this.userOpen = false
      },
      /** 查询用户列表 */
      getUserList() {
        this.userLoading = true
        queryUserList(this.userParams).then((response) => {
          this.userList = response.rows
          this.userTotal = response.total
          this.userOpen = true
          this.userLoading = false
        })
      },
      /** 绑定用户点击 */
      bindingUser() {
        this.getUserList()
      },
      /** 查询分销商(一级)列表 */
      getList() {
        this.loading = true
        listDistributorOne(this.queryParams).then(response => {
          this.distributorOneList = response.rows
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
          distributorId: undefined,
          distributorName: undefined,
          parentDistributorId: undefined,
          parentDistributorName: undefined,
          uid: undefined,
          nickName: undefined,
          phonenumber: undefined,
          topicNum: undefined,
          directApplyNum: undefined,
          indirectApplyNum: undefined,
          extractMoney: undefined,
          lastExtractTime: undefined,
          extractNum: undefined,
          status: 0,
          isDeleted: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          account: 0
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
        this.ids = selection.map(item => item.distributorId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加分销商(一级)'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const distributorId = row.distributorId || this.ids
        getDistributorOne(distributorId).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改分销商(一级)'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.distributorId != undefined) {
              updateDistributorOne(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addDistributorOne(this.form).then(response => {
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
        const distributorIds = row.distributorId || this.ids
        this.$confirm('是否确认删除分销商(一级)编号为"' + distributorIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delDistributorOne(distributorIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有分销商(一级)数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportDistributorOne(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
