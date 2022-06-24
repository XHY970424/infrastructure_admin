<template>
  <div class="app-container">
    <div style="line-height: 30px;text-align: center;color: red">证书类型:{{certCategoryName}}</div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="证书状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择证书状态" clearable size="small">
          <el-option label="已创建" :value="0"/>
          <el-option label="审核中 " :value="1"/>
          <el-option label="已发放 " :value="2"/>
          <el-option label="已过期 " :value="3"/>
          <el-option label="已作废 " :value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学员姓名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入学员姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="idCard">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证书编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入证书编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-receiving"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['certificate:userCertificate:uploadUserCertificate']"
        >发送证书
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="certificateList" border>
      <el-table-column label="学员姓名" align="center" prop="nickName"/>
      <el-table-column width="140px" label="学员身份证号" align="center" prop="idCard"/>
      <el-table-column width="140px" label="学员手机号" align="center" prop="phonenumber"/>
      <el-table-column label="单位名称" align="center" prop="company"/>
      <el-table-column width="170px" label="证书编号" align="center" prop="code"/>
      <el-table-column width="170px" label="证书有效期" align="center" prop="projectPlanEndDate">
        <template slot-scope="scope">
          <span v-show="scope.row.projectPlanEndDate == null">无限期</span>
          <span v-show="scope.row.projectPlanEndDate != null">{{scope.row.projectPlanEndDate}}</span>
        </template>
      </el-table-column >
      <el-table-column label="证书状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-show="scope.row.status == 0">已创建</span>
          <span v-show="scope.row.status == 1">审核中</span>
          <span v-show="scope.row.status == 2">已发放</span>
          <span v-show="scope.row.status == 3">已过期</span>
          <span v-show="scope.row.status == 4">已作废</span>
        </template>
      </el-table-column>
      <el-table-column label="证书生成类型" align="center" prop="createType">
        <template slot-scope="scope">
          <span>{{scope.row.createType==0 ? '系统生成' : '手动上传'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="170px" label="发证日期" align="center" prop="projectPlanStartDate"/>
      <el-table-column width="170px" label="作废时间" align="center" prop="updateTime">
        <template slot-scope="scope">
          <span>{{scope.row.status==4 ? scope.row.updateTime : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="certificateDetail(scope.row)"
            v-hasPermi="['certificate:userCertificate:query']"
            v-show="scope.row.status > 1"
          >查看证书
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="cancellation(scope.row)" v-show="scope.row.status < 3"
            v-hasPermi="['certificate:userCertificate:updateStatus']"
          >作废证书
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-thumb"
            @click="passCancellation(scope.row)"
            v-hasPermi="['certificate:userCertificate:updateStatus']" v-show="scope.row.status == 1"
          >通过审核
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

    <!-- 添加或修改用户证书对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="被发放人" prop="userId">
              <span>{{form.userName}}</span>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="userParams.pageNum=1,userParams.pageSize=10,userParams.userName=undefined,getUserList()"
              >发放学员
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发放证书" prop="certificateId">
              <span>{{form.certificateName}}</span>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="certificateParams.pageNum=1,certificateParams.pageSize=10,certificateParams.name=undefined,getCertificateList()"
              >发放证书
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="证书编号" prop="code">
              <el-input v-model="form.code" placeholder="请输入证书编号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="上传证书" prop="certificate">
              <el-upload
                class="avatar-uploader"
                :action="uploadInvoiceImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleCertificateUploadSuccess"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-image :preview-src-list="[form.certificate]"
                      style="max-width: 200px;max-height: 200px" :z-index="2200"
                      v-show="form.certificate" :src="form.certificate"/>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看证书 -->
    <el-dialog :close-on-click-modal="false" title="查看证书" :visible.sync="detailOpen" width="800px" append-to-body>
      <el-row style="margin-top: -20px">
        <el-col :span="12" class="detail">
          学员姓名： <span>{{userCertifcateDetail.nickName}}</span>
        </el-col>
        <el-col :span="12" class="detail">
          手机号：<span>{{userCertifcateDetail.phonenumber}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="detail">
          身份证号：<span>{{userCertifcateDetail.idCard}}</span>
        </el-col>
        <el-col :span="12" class="detail">
          单位名称：<span>{{userCertifcateDetail.company}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="detail">
          证书：
        </el-col>
        <el-col :span="22" class="detail">
          <el-image :preview-src-list="[userCertifcateDetail.certificate]" fit="contain"
                    :z-index="2200"
                    v-show="userCertifcateDetail.certificate" :src="userCertifcateDetail.certificate"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2" class="detail">
          培训：
        </el-col>
        <el-col :span="22" class="detail">
          <div class="scoreDiv">
            <el-row class="row">
              <el-col :span="12">
                成绩单
              </el-col>
<!--              <el-col :span="12" class="col">-->
<!--                考试 2/1-->
<!--              </el-col>-->
            </el-row>
            <div class="score" v-for="item in userCertifcateDetail.examScore">
              <el-row class="title">
                <el-col :span="12" style="text-align: left">
                  <span class="el-icon-edit-outline"></span>
                  <span>考试：{{item.name}}</span>
                </el-col>
                <el-col :span="12" class="number">
                  <span class="score-num">{{item.score}}<span class="score-title">分 / {{item.allScore}}分</span></span>
                </el-col>
              </el-row>
              <div v-for="(itemScore,index) in item.record">
                <el-row class="record">
                  <el-col :span="8">
                    第 {{index+1}} 次考试
                    <span style="margin-left: 20px">{{itemScore.examTime}}</span>
                  </el-col>
                  <el-col :span="14">
                    <span>---------------------------------------------------------- &nbsp;&nbsp;&nbsp;
                      {{itemScore.score}}
                    </span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 证书列表弹出框 -->
    <el-dialog :close-on-click-modal="false" title="选择证书" :visible.sync="certificateOpen" width="1000px"
               append-to-body>
      <el-form :model="certificateParams" :inline="true" label-width="68px" @submit.native.prevent>
        <el-form-item label="证书名称" prop="name">
          <el-input
            v-model="certificateParams.name"
            placeholder="请输入证书名称"
            clearable
            size="small"
            @keyup.enter.native="getCertificateList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getCertificateList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="certificateLoading" :data="certificateUserList" border>
        <el-table-column label="证书名称" align="center" prop="name"/>
        <el-table-column label="证书类型" align="center" prop="categoryName"/>
        <el-table-column label="创建人" align="center" prop="createByName"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="selectCertificate(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="certificateTotal>0"
        :total="certificateTotal"
        :page.sync="certificateParams.pageNum"
        :limit.sync="certificateParams.pageSize"
        @pagination="getCertificateList()"
      />
    </el-dialog>

    <!-- 学员列表弹出框 -->
    <el-dialog :close-on-click-modal="false" title="选择学员" :visible.sync="userOpen" width="1000px"
               append-to-body>
      <el-form :model="userParams" :inline="true" label-width="68px" @submit.native.prevent>
        <el-form-item label="">
          <el-input
            v-model="userParams.userName"
            placeholder="请输入学员名称/手机号/邮箱/身份证查询"
            clearable
            size="small"
            @keyup.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getUserList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="userLoading" :data="userList" border>
        <el-table-column label="用户名" align="center" prop="userName"/>
        <el-table-column label="用户姓名" align="center" prop="nickName"/>
        <el-table-column label="手机号" align="center" prop="phonenumber"/>
        <el-table-column label="邮箱" align="center" prop="email"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="selectUser(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="userTotal>0"
        :total="userTotal"
        :page.sync="userParams.pageNum"
        :limit.sync="userParams.pageSize"
        @pagination="getUserList()"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {
    getCertificate,
    listCertificate,
    updateStatus,
    uploadUserCertificate
  } from '@/api/certificate/userCertificate'
  import { listCertificate as certificateList } from '@/api/certificate/certificate'
  import { queryUserList } from '@/api/base/eyUsers'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Certificate',
    data() {
      return {
        certCategoryName: this.$route.query.certCategoryName,
        /** 学员列表弹出框start */
        userOpen: false,
        userLoading: true,
        userList: [],
        userTotal: 0,
        userParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined
        },
        /** 证书列表弹出框end */
        /** 证书列表弹出框start */
        certificateOpen: false,
        certificateLoading: true,
        certificateTotal:0,
        certificateUserList: [],
        certificateParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined
        },
        /** 证书列表弹出框end */
        // 请求头
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        // 上传图片地址
        uploadInvoiceImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg', // 上传的图片服务器地址
        userCertifcateDetail: {},
        detailOpen: false,
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
        // 用户证书表格数据
        certificateList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          certificateId: this.$route.query.id,
          code: undefined,
          status: undefined,
          nickname: undefined,
          phonenumber: undefined,
          idCard: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          userId: [
            { required: true, message: '被发放用户不能为空', trigger: 'blur' }
          ],
          certificateId: [
            { required: true, message: '发放证书不能为空', trigger: 'blur' }
          ],
          certificate: [
            { required: true, message: '发放证书文件不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '证书编号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      $route: {
        handler(newVal) {
          this.queryParams.certificateId = undefined
          this.queryParams.certificateId = newVal.query.id
          this.getList()
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 选择学员 */
      selectUser(item) {
        this.form.userId = item.userId
        this.form.userName = item.nickName
        this.userOpen = false
      },
      /** 查询学员列表 */
      getUserList() {
        this.userLoading = true
        queryUserList(this.userParams).then(response => {
          this.userList = response.rows
          this.userTotal = response.total
          this.userOpen = true
          this.userLoading = false
        })
      },
      /** 选择证书 */
      selectCertificate(item) {
        this.form.certificateId = item.id
        this.form.certificateName = item.name
        this.certificateOpen = false
      },
      /** 查询证书列表 */
      getCertificateList() {
        this.certificateLoading = true
        this.certificateParams.status = 1
        certificateList(this.certificateParams).then(response => {
          this.certificateUserList = response.rows
          this.certificateTotal = response.total
          this.certificateOpen = true
          this.certificateLoading = false
        })
      },
      /** 证书上传 */
      handleCertificateUploadSuccess(res) {
        if (res.code == 200) {
          this.form.certificate = res.url
        } else {
          this.$message.error(res.msg)
        }
      },
      /** 查看证书 */
      certificateDetail(item) {
        getCertificate(item.id).then(response => {
          this.userCertifcateDetail = response.data
          this.detailOpen = true
        })
      },
      /** 通过证书 */
      passCancellation(item) {
        this.$confirm('是否同意当前证书申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: item.id,
            status: 2
          }
          updateStatus(data).then(res => {
            if (res.code == 200) {
              this.$message.success('当前申请证书审核通过')
              this.getList()
            }
          })
        })
      },
      cancellation(item) {
        this.$confirm('是否作废当前证书?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: item.id,
            status: 4
          }
          updateStatus(data).then(res => {
            if (res.code == 200) {
              this.$message.success('当前证书已作废')
              this.getList()
            }
          })
        })
      },
      /** 查询用户证书列表 */
      getList() {
        this.loading = true
        listCertificate(this.queryParams).then(response => {
          this.certificateList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.detailOpen = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          userId: undefined,
          userName: undefined,
          certificateId: undefined,
          certificateName: undefined,
          certificate: undefined,
          code: undefined
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
        this.title = '添加用户证书'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getCertificate(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改用户证书'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.form.status = 2
            uploadUserCertificate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('上传成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除用户证书编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delCertificate(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有用户证书数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportCertificate(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
<style scoped>
  .detail {
    margin-top: 20px;
  }

  .detail span {
    margin-left: 5px;
  }

  .scoreDiv{
    border:1px solid #DADADA;
    box-shadow: darkgrey 0px 0px 5px 0px
  }
  .scoreDiv .row{
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    padding-left: 10px;
    border-left: 3px solid dodgerblue;
  }
  .scoreDiv .row .col{
    font-size: 12px;
    color: #8c939d;
    text-align: right;
    padding-right: 10px;
  }
  .scoreDiv .title{
    background-color: #FAFAFA;
    line-height: 40px;
    padding: 0 5px;
  }
  .scoreDiv .score{
    margin: 0 10px;
  }
  .scoreDiv .title .score-num{
    color: red;
    font-size: 16px;
  }
  .scoreDiv .title .score-title{
    font-size: 12px;
  }
  .scoreDiv .title .number{
    text-align: right;
    padding-right: 40px;
  }
  .scoreDiv .score .record{
    line-height: 30px;
    margin-left: 10px;
  }
  .scoreDiv .score .record span{
    color: gray;
    font-size: 12px;
  }
</style>
