<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="开票状态" prop="invoiceAudit">
        <el-select v-model="queryParams.invoiceAudit" placeholder="请选择开票状态" clearable size="small">
          <el-option label="拒绝" :value="0"/>
          <el-option label="通过" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="发票类型" prop="invoiceType">
        <el-select v-model="queryParams.invoiceType" placeholder="请选择发票类型" clearable size="small">
          <el-option label="个人" :value="0"/>
          <el-option label="单位" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入申请人名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderSn">
        <el-input
          v-model="queryParams.orderSn"
          placeholder="请输入订单编号"
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
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          icon="el-icon-plus"-->
      <!--          size="mini"-->
      <!--          @click="handleAdd"-->
      <!--          v-hasPermi="['eycode:orderinvoice:add']"-->
      <!--        >新增</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['eycode:orderinvoice:edit']"-->
      <!--        >修改</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['eycode:orderinvoice:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:orderinvoice:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="orderinvoiceList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="订单编号" align="center" prop="orderSn" width="200">
        <template slot-scope="scope">
          <a href="javascript:;" style="color: #00afff" @click="toOrderList(scope.row)">{{scope.row.orderSn}}</a>
        </template>
      </el-table-column>
      <el-table-column label="发票类型" align="center" prop="invoiceType">
        <template slot-scope="scope">
          <span v-show="scope.row.invoiceType == 0">个人</span>
          <span v-show="scope.row.invoiceType == 1">单位</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="userName"/>
      <el-table-column label="发票抬头" align="center" prop="invoiceSn" width="180"/>
      <el-table-column label="单位税号" align="center" prop="code" width="180"/>
      <el-table-column label="发票状态" align="center" prop="invoiceAudit">
        <template slot-scope="scope">
          <a href="javascript:;" v-show="scope.row.invoiceAudit == 0" style="color: #00afff" @click="auditOpen=true,auditData=scope.row">拒绝</a>
          <a href="javascript:;" v-show="scope.row.invoiceAudit == 1" style="color: #00afff" @click="auditOpen=true,auditData=scope.row">通过</a>
          <a href="javascript:;" v-show="scope.row.invoiceAudit == 2" style="color: #00afff" @click="auditOpen=true,auditData=scope.row">已发送邮箱</a>
        </template>
      </el-table-column>
      <el-table-column label="发票金额" align="center" prop="price"/>
      <el-table-column label="邮箱地址" align="center" prop="email" width="180"/>
      <el-table-column label="审核备注" align="center" prop="invoiceCause" width="180"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="invoiceAuditBtn(scope.row)"
            v-hasPermi="['eycode:orderinvoice:query']"
          >发票审核
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

    <!-- 添加或修改订单发票申请对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="下单用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入下单用户id"/>
        </el-form-item>
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id"/>
        </el-form-item>
        <el-form-item label="发票类型 0-个人 1-单位">
          <el-select v-model="form.invoiceType" placeholder="请选择发票类型 0-个人 1-单位">
            <el-option label="请选择字典生成" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头/单位税号" prop="invoiceSn">
          <el-input v-model="form.invoiceSn" placeholder="请输入发票抬头/单位税号"/>
        </el-form-item>
        <el-form-item label="企业名称(申请的发票类型为单位时必填)" prop="invoiceCompany">
          <el-input v-model="form.invoiceCompany" placeholder="请输入企业名称(申请的发票类型为单位时必填)"/>
        </el-form-item>
        <el-form-item label="发票地址(后台上传)" prop="invoiceUrl">
          <el-input v-model="form.invoiceUrl" placeholder="请输入发票地址(后台上传)"/>
        </el-form-item>
        <el-form-item label="是否拒开发票0-拒绝 1-正常" prop="invoiceAudit">
          <el-input v-model="form.invoiceAudit" placeholder="请输入是否拒开发票0-拒绝 1-正常"/>
        </el-form-item>
        <el-form-item label="拒开发票原因" prop="invoiceCause">
          <el-input v-model="form.invoiceCause" placeholder="请输入拒开发票原因"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核发票 -->
    <el-dialog :close-on-click-modal="false" v-loading="invoiceLoading" title="发票信息" :visible.sync="invoiceAuditOpen" width="620px" append-to-body>
      <div class="order-money">订单金额: <span>￥{{invoiceInfo.amount}}</span></div>
      <div class="order-money">订单号: <span>{{invoiceInfo.orderSn}}</span></div>
      <div>
        <hr/>
        <el-form :inline="true" label-width="80px">
          <div>
            <el-form-item label="发票类型">
              <el-input width="100%" disabled v-model="invoiceInfo.data.invoiceType == 0 ? '个人' : '企业'"
                        style="width: 260px"/>
            </el-form-item>
            <br/>
            <el-form-item label="发票抬头">
              <el-input width="100%" disabled v-model="invoiceInfo.data.invoiceSn" style="width: 260px"/>
            </el-form-item>
            <br/>
            <el-form-item label="单位税号" v-show="invoiceInfo.data.invoiceType == 1">
              <el-input width="100%" disabled v-model="invoiceInfo.data.code" style="width: 260px"/>
            </el-form-item>
            <el-form-item label="邮箱地址">
              <el-input width="100%" disabled v-model="invoiceInfo.data.email" style="width: 260px"/>
            </el-form-item>
            <br/>
            <el-form-item label="是否同意">
              <el-radio-group v-model="invoiceInfo.data.invoiceAudit">
                <el-radio :label="0">拒绝开发票</el-radio>
                <el-radio :label="1">同意开发票</el-radio>
                <el-radio :label="2">已邮箱发送</el-radio>
              </el-radio-group>
            </el-form-item>
            <br/>
            <el-row v-show="invoiceInfo.data.invoiceAudit == 1">
              <el-col :span="12">
                <el-form-item label="上传发票">
                  <el-input v-model="invoiceInfo.data.invoiceUrl" placeholder="请上传发票"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadInvoiceImgUrl"
                  :show-file-list="false"
                  :headers="headers"
                  :on-success="handleUploadSuccess"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-col>
            </el-row>
            <el-row v-show="invoiceInfo.data.invoiceAudit == 1">
              <el-col>
                <el-image :preview-src-list="[invoiceInfo.data.invoiceUrl]" :z-index="2100"
                          style="max-width: 100px;max-height: 100px;margin-left: 80px"
                          v-if="invoiceInfo.data.invoiceUrl" :src="invoiceInfo.data.invoiceUrl"/>
              </el-col>
            </el-row>
            <el-form-item label="审核备注">
              <el-input type="textarea" v-model="invoiceInfo.data.invoiceCause"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveInvoiceAudit">保存修改</el-button>
        <el-button @click="closeInvoiceAudit">取消</el-button>
      </div>
    </el-dialog>

    <!-- 审核详情 -->
    <el-dialog :close-on-click-modal="false" title="审核详情" :visible.sync="auditOpen" width="500px" append-to-body>
      <div class="audit-detail">审核人: <span>{{auditData.auditor}}</span></div>
      <div class="audit-detail">审核时间: <span>{{auditData.updateTime}}</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addOrderinvoice,
    delOrderinvoice,
    exportOrderinvoice,
    getOrderinvoice,
    listOrderinvoice,
    updateOrderinvoice
  } from '@/api/eycode/orderinvoice'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Orderinvoice',
    data() {
      return {
        auditData:{},
        auditOpen: false,
        // 请求头
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        // 上传图片地址
        uploadInvoiceImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg', // 上传的图片服务器地址
        // 发票实体
        invoiceInfo: {
          data: {
            id: undefined,
            invoiceType: undefined,
            invoiceTypeStr: undefined,
            invoiceSn: undefined,
            code: undefined,
            invoiceUrl: undefined,
            invoiceAudit: 1,
            invoiceCause: undefined,
            remark: undefined,
            createTime: undefined
          }
        },
        // 发票信息弹出框
        invoiceLoading: false,
        invoiceAuditOpen: false,
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
        // 订单发票申请表格数据
        orderinvoiceList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined,
          orderId: undefined,
          invoiceType: undefined,
          invoiceSn: undefined,
          invoiceCompany: undefined,
          invoiceUrl: undefined,
          invoiceAudit: undefined,
          invoiceCause: undefined,
          orderSn: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          userId: [
            { required: true, message: '下单用户id不能为空', trigger: 'blur' }
          ],
          orderId: [
            { required: true, message: '订单id不能为空', trigger: 'blur' }
          ],
          invoiceType: [
            { required: true, message: '发票类型 0-个人 1-单位不能为空', trigger: 'blur' }
          ],
          invoiceSn: [
            { required: true, message: '发票抬头/单位税号不能为空', trigger: 'blur' }
          ],
          invoiceCompany: [
            { required: true, message: '企业名称(申请的发票类型为单位时必填)不能为空', trigger: 'blur' }
          ],
          invoiceUrl: [
            { required: true, message: '发票地址(后台上传)不能为空', trigger: 'blur' }
          ],
          invoiceCause: [
            { required: true, message: '拒开发票原因不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 跳转订单列表
      toOrderList(item){
        this.$router.push({
          path: '/order/ordernew',
          query: {
            orderSn: item.orderSn
          }
        })
      },
      // 显示发票上传窗口
      invoiceAuditBtn(row) {
        // 重置信息
        this.resetInvoiceInfo()
        // 是否显示发票上传 弹出层
        this.invoiceAuditOpen = true
        // 加载层
        this.invoiceLoading = true
        // 发送请求获取申请的发票信息
        getOrderinvoice(row.id)
          .then(res => {
            if (res.code == 200) {
              this.invoiceInfo.data = res.data
              this.invoiceInfo.amount = row.price
              this.invoiceInfo.orderSn = row.orderSn
              this.invoiceLoading = false
            } else {
              this.invoiceLoading = false
              this.$message.error(res.msg)
            }
          }).catch(() => {
          this.invoiceLoading = false
        })
      },
      // 保存发票审核信息
      saveInvoiceAudit() {
        // 发送请求保存数据
        updateOrderinvoice(this.invoiceInfo.data)
          .then(res => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.invoiceAuditOpen = false
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
          })
      },
      // 重置发票上传数据
      resetInvoiceInfo() {
        let data = {
          id: undefined,
          invoiceType: undefined,
          invoiceTypeStr: undefined,
          invoiceSn: undefined,
          invoiceComapany: undefined,
          invoiceUrl: undefined,
          invoiceAudit: 1,
          invoiceCause: undefined,
          remark: undefined,
          createTime: undefined
        }
        this.invoiceInfo.data = data
        this.invoiceInfo.amount = undefined
        this.invoiceInfo.orderSn = undefined
      },
      // 上传发票成功
      handleUploadSuccess(res) {
        if (res.code == 200) {
          this.invoiceInfo.data.invoiceUrl = res.url
        } else {
          this.$message.error(res.msg)
        }
      },
      // 关闭发票信息窗口
      closeInvoiceAudit() {
        this.invoiceAuditOpen = false
      },
      /** 查询订单发票申请列表 */
      getList() {
        this.loading = true
        listOrderinvoice(this.queryParams).then(response => {
          this.orderinvoiceList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.auditOpen = false;
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          userId: undefined,
          orderId: undefined,
          invoiceType: undefined,
          invoiceSn: undefined,
          invoiceCompany: undefined,
          invoiceUrl: undefined,
          invoiceAudit: undefined,
          invoiceCause: undefined,
          remark: undefined,
          createTime: undefined,
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
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加订单发票申请'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getOrderinvoice(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改订单发票申请'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateOrderinvoice(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addOrderinvoice(this.form).then(response => {
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
        this.$confirm('是否确认删除订单发票申请编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delOrderinvoice(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有订单发票申请数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportOrderinvoice(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
<style>
  .audit-detail {
    font-size: 16px;
    padding-bottom: 16px;
  }

  .audit-detail span {
    font-size: 16px;
    display: inline-block;
    height: 18px;
    padding-left: 16px;
  }
</style>
