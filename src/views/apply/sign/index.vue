<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="企业名称" prop="platformUserName">
        <el-input
          v-model="queryParams.platformUserName"
          placeholder="请输入企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="allow">
        <el-select v-model="queryParams.allow" placeholder="请选择状态" clearable size="small">
          <el-option label="待确认" :value="-1"/>
          <el-option label="不同意" :value="0"/>
          <el-option label="同意" :value="1"/>
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
          v-hasPermi="['apply:sign:sendAuthoritySign']"
        >发送邀请
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['apply:sign:edit']"-->
      <!--        >修改</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['apply:sign:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          icon="el-icon-download"-->
      <!--          size="mini"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['apply:sign:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="signList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="企业名称" align="center" prop="platformUserName"/>
      <el-table-column label="平台用户类型" align="center" prop="platformUserType">
        <template slot-scope="scope">
          <span>{{ scope.row.platformUserType == 1 ? '个人用户注册' : scope.row.platformUserType == 2 ? '公司注册' : scope.row.platformUserType == 3 ? '班组注册' : '其他'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联状态" align="center" prop="allow">
        <template slot-scope="scope">
          <span>{{ scope.row.allow == -1 ? '待确认' : scope.row.allow == 0 ? '不同意' : '同意' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请时间" align="center" prop="createTime"/>
      <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-edit"-->
      <!--            @click="handleUpdate(scope.row)"-->
      <!--            v-hasPermi="['apply:sign:edit']"-->
      <!--          >修改</el-button>-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-delete"-->
      <!--            @click="handleDelete(scope.row)"-->
      <!--            v-hasPermi="['apply:sign:remove']"-->
      <!--          >删除</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改分销-企业关联对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="搜索关键词">
          <el-input v-model="keyword" placeholder="请输入搜索关键词" style="width: 80%"/>
          <el-button icon="el-icon-search" type="primary" @click="searchCompany">搜索</el-button>
        </el-form-item>
        <el-form-item label="发送企业" prop="platformUserName">
          <el-select v-model="form.platformUserId" placeholder="请选择发送企业" filterable @change="selectCompany">
            <el-option
              v-for="item in companyList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">发送邀请</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { delSign, exportSign, getSign, listSign, sendAuthoritySign, updateSign } from '@/api/apply/sign'
  import { queryCompanyList } from '@/api/offline/company'
  import Template from '../../certificate/template/index'

  export default {
    name: 'Sign',
    components: { Template },
    data() {
      return {
        companyList: [],
        keyword: undefined,
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
        // 分销-企业关联表格数据
        signList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          channelUserId: undefined,
          channelUserName: undefined,
          platformUserId: undefined,
          platformUserName: undefined,
          platformUserType: undefined,
          authorityItem: undefined,
          allow: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          channelUserId: [
            { required: true, message: '渠道用户id不能为空', trigger: 'blur' }
          ],
          channelUserName: [
            { required: true, message: '渠道用户名不能为空', trigger: 'blur' }
          ],
          platformUserId: [
            { required: true, message: '平台用户id不能为空', trigger: 'blur' }
          ],
          platformUserName: [
            { required: true, message: '平台用户名不能为空', trigger: 'blur' }
          ],
          platformUserType: [
            { required: true, message: '平台用户类型{1：个人用户注册，2：公司注册，3：班组注册，4：其他}不能为空', trigger: 'blur' }
          ],
          authorityItem: [
            { required: true, message: '授权项{PA:推送报名表}不能为空', trigger: 'blur' }
          ],
          allow: [
            { required: true, message: '是否同意{-1:待确认,0:不同意,1同意}不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 下拉框改变 */
      selectCompany(companyId) {
        let obj = this.companyList.find((item) => {
          return item.userId === companyId
        })
        this.form.platformUserId = obj.userId
        this.form.platformUserName = obj.nickName
        this.form.platformUserType = 2
        this.form.authorityItem = 'PA'
      },
      /** 搜索企业列表 */
      searchCompany() {
        if (!this.keyword) {
          this.$message.warning('请输入搜索词~')
          return
        }
        let param = {
          keyword: this.keyword
        }
        queryCompanyList(param).then(res => {
          this.companyList = res.data
        })
      },
      /** 查询分销-企业关联列表 */
      getList() {
        this.loading = true
        listSign(this.queryParams).then(response => {
          this.signList = response.rows
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
          signId: undefined,
          channelUserId: undefined,
          channelUserName: undefined,
          platformUserId: undefined,
          platformUserName: undefined,
          platformUserType: undefined,
          authorityItem: undefined,
          allow: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined
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
        this.ids = selection.map(item => item.signId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '发送邀请-企业关联'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const signId = row.signId || this.ids
        getSign(signId).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改分销-企业关联'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.signId != undefined) {
              updateSign(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              sendAuthoritySign(this.form).then(response => {
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
        const signIds = row.signId || this.ids
        this.$confirm('是否确认删除分销-企业关联编号为"' + signIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delSign(signIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有分销-企业关联数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportSign(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
