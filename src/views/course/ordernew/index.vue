<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item prop="orderSn">
        <el-input
          style="width: 260px;"
          v-model="queryParams.orderSn"
          placeholder="订单编号/用户名/用户手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" cflearable size="small">
          <el-option label="未支付" :value="0"/>
          <el-option label="提交转账信息未审核" :value="1"/>
          <el-option label="已支付" :value="2"/>
          <el-option label="已失效" :value="3"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable size="small">
          <el-option label="个人" :value="1"/>
          <el-option label="企业" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择支付方式" clearable size="small">
          <el-option label="支付宝" :value="0"/>
          <el-option label="微信" :value="1"/>
          <el-option label="线下转账" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="支付审核状态" prop="payAuditStatus">
        <el-select v-model="queryParams.payAuditStatus" placeholder="请选择订单支付审核状态" clearable size="small">
          <el-option label="待审核" :value="0"/>
          <el-option label="审核通过" :value="1"/>
          <el-option label="审核不通过" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间" prop="payAuditStatus">
        <el-date-picker
          v-model="placeDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eycode:neworder:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eycode:neworder:edit']"
        >修改</el-button> -->
      <!-- </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:neworder:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:neworder:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="neworderList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="ID" align="center" prop="id" width="80" fixed="left" />-->
      <el-table-column label="订单编号" align="center" prop="orderSn" fixed="left" width="190"/>
      <el-table-column label="订单状态" align="center" prop="status" fixed="left" width="110">
        <template slot-scope="scope">
          <span v-show="scope.row.status == 0" style="color: #FFA960">未支付</span>
          <span v-show="scope.row.status == 1" style="color: red">提交转账信息未审核</span>
          <span v-show="scope.row.status == 2" style="color: #AFE7C5;">已支付</span>
          <span v-show="scope.row.status == 3" style="color: gray">已失效</span>
          <a href="javascript:;" v-show="scope.row.status == 4">已退款</a>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="100" fixed="left"/>
      <el-table-column label="折后价" align="center" prop="discountPrice" width="100" fixed="left"/>
      <el-table-column label="实付金额" align="center" prop="amount" fixed="left" width="100"/>
      <el-table-column label="支付方式" align="center" prop="payType" width="110" fixed="left">
        <template slot-scope="scope">
          <span v-show="scope.row.payType == 0">支付宝</span>
          <span v-show="scope.row.payType == 1">微信</span>
          <span v-show="scope.row.payType == 2">线下转账</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="createTime" width="160" fixed="left">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付完成时间" align="center" prop="payTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" align="center" prop="userType">
        <template slot-scope="scope">
          <span v-show="scope.row.userType == 1">个人</span>
          <span v-show="scope.row.userType == 2">企业</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="nickName">
        <template slot-scope="scope">
          <a href="javascript:;" @click="userClick(scope.row)">{{scope.row.nickName}}</a>
        </template>
      </el-table-column>
      <!-- <el-table-column label="折扣价(暂未使用)" align="center" prop="discountPrice" /> -->
      <el-table-column label="支付审核状态" align="center" prop="payAuditStatus" width="120">
        <template slot-scope="scope">
          <div v-show="scope.row.payType == 2">
            <span v-show="scope.row.payAuditStatus == 0" style="color: red">待审核</span>
            <a href="javascript:;" @click="auditClick(scope.row)" v-show="scope.row.payAuditStatus == 1">审核通过</a>
            <a href="javascript:;" @click="auditClick(scope.row)" v-show="scope.row.payAuditStatus == 2">审核不通过</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付流水号" align="center" prop="paySn" width="240"/>
      <el-table-column label="订单备注" align="center" prop="remark" width="240"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="260" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.payType == 2 && scope.row.payAuditStatus == 0 && scope.row.status != 2"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="payAuditBtn(scope.row)"
            v-hasPermi="['eycode:neworder:audit']"
          >支付审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="orderDetaileBtn(scope.row)"
            v-hasPermi="['eycode:neworderdetail:list']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="orderRemark(scope.row)"
            v-hasPermi="['eycode:neworder:setRemark']"
          >备注
          </el-button>
          <el-button
            v-show="scope.row.orderInvoiceId != null"
            size="mini"
            type="text"
            icon="el-icon-takeaway-box"
            @click="invoiceDetail(scope.row)"
            v-hasPermi="['eycode:orderinvoice:query']"
          >查看发票
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

    <!-- 支付审核弹窗 -->
    <el-dialog :close-on-click-modal="false" v-loading="auditLoading" title="线下转账审核" :visible.sync="orderPayAuditOpen"
               width="620px" append-to-body>
      <div class="order-money">订单金额: <span>￥{{orderPayInfo.amount}}</span></div>
      <div class="order-money">订单号: <span>{{orderPayInfo.orderNumber}}</span></div>
      <!-- <div class="order-money">订单金额 <span>￥{{orderPayInfo.amount}}</span></div> -->
      <div>
        <hr/>
        <div class="order-money">用户转账信息 <span>(信息为空时则表示用户未上传信息)</span>:</div>
        <el-form :inline="true" label-width="68px">
          <div>
            <el-form-item label="线下转账信息ID" style="display: none;">
              <el-input v-model="orderPayInfo.data.id"/>
            </el-form-item>
            <el-form-item label="转账卡号">
              <el-input width="100%" v-model="orderPayInfo.data.cardNumber" style="width: 260px"/>
            </el-form-item>
            <br/>
            <el-form-item label="户名">
              <el-input width="100%" v-model="orderPayInfo.data.cardName" style="width: 260px"/>
            </el-form-item>
            <br/>
            <el-form-item label="开户行">
              <el-input width="100%" v-model="orderPayInfo.data.cardBank" style="width: 260px"/>
            </el-form-item>
            <br/>
            <el-form-item label="转账时间">
              <el-input width="100%" v-model="orderPayInfo.data.transferTimeFormat" style="width: 260px"/>
            </el-form-item>
            <el-form-item label="实付金额">
              <el-input width="100%" v-model="orderPayInfo.data.amount" style="width: 260px"/>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-radio-group v-model="orderPayInfo.data.status">
                <el-radio label="1">待审核</el-radio>
                <el-radio label="2">财务已确认到账</el-radio>
                <el-radio label="3">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核备注">
              <el-input type="textarea" v-model="orderPayInfo.data.remark"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePayAudit">保存修改</el-button>
        <el-button @click="closePayAudit">取消</el-button>
      </div>
    </el-dialog>

    <!-- 订单详情弹窗 -->
    <el-dialog title="订单详情" :visible.sync="orderDetailsOpen" width="85%" append-to-body :close-on-click-modal="false"
               @close="closeDetail">
      <el-table v-loading="orderDetailsLoading" :data="orderDetailsList" border>
        <!-- <el-table-column type="selection" width="55" align="center"/> -->
        <el-table-column label="ID" align="center" prop="id" fixed="left" width="80px" :show-overflow-tooltip="true"/>
        <el-table-column label="用户名称" align="center" prop="userName" width="100px" fixed="left"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="身份证号码" align="center" prop="userIdCard" fixed="left" width="210px"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="手机号码" align="center" prop="userPhone" fixed="left" width="210px"
                         :show-overflow-tooltip="true"/>
        <el-table-column label="课程/专题" align="center" prop="tableType" fixed="left" width="100px"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-show="scope.row.tableType == 0">课程</span>
            <span v-show="scope.row.tableType == 1">专题</span>
          </template>
        </el-table-column>
        <el-table-column label="课程/专题名称" align="center" prop="courseName" fixed="left" :show-overflow-tooltip="true"/>
        <el-table-column label="金额(元)" align="center" prop="price" fixed="left" :show-overflow-tooltip="true"/>
        <el-table-column label="折扣" align="center" prop="discount" fixed="left" :show-overflow-tooltip="true"/>
        <el-table-column label="折扣金额(元)" align="center" fixed="left" :show-overflow-tooltip="true">
          <template slot-scope="scope" >
            <span> {{scope.row.discount == 1 ? scope.row.price : scope.row.discountPrice}} </span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="orderDetailsTotal>0"
        :total="orderDetailsTotal"
        :page.sync="orderDetailsQueryParams.pageNum"
        :limit.sync="orderDetailsQueryParams.pageSize"
        @pagination="getOrderDetailPage"
      />
    </el-dialog>

    <!-- 用户详情 -->
    <el-dialog :close-on-click-modal="false" title="用户信息" :visible.sync="userAuditOpen" width="400px" append-to-body>
      <div class="user-detail">用户名: <span>{{userDetail.nickName}}</span></div>
      <div class="user-detail">手机号: <span>{{userDetail.phonenumber}}</span></div>
      <div class="user-detail">用户类型:
        <span v-show="userDetail.userType == 1">个人</span>
        <span v-show="userDetail.userType == 2">企业</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAuditOpen=false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 审核详情 -->
    <el-dialog :close-on-click-modal="false" title="审核信息" :visible.sync="auditOpen" width="400px" append-to-body>
      <div class="user-detail">审核人: <span>{{userDetail.payAuditUserName}}</span></div>
      <div class="user-detail">审核原因: <span>{{userDetail.payAuditCause}}</span></div>
      <div class="user-detail">审核时间: <span>{{ parseTime(userDetail.payAuditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditOpen=false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 订单备注 -->
    <el-dialog :close-on-click-modal="false" title="订单备注" :visible.sync="remarkOpen" width="400px" append-to-body>
      <el-form label-width="70px">
        <el-form-item label="订单备注">
          <el-input type="textarea" :rows="4" v-model="remarkDetail.remark" placeholder="请输入订单备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top: -20px">
        <el-button type="primary" @click="addRemark">确定</el-button>
        <el-button @click="remarkOpen=false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 查看发票 -->
    <el-dialog :close-on-click-modal="false" title="发票信息" :visible.sync="invoiceOpen" width="620px" append-to-body>
      <div class="invoice">订单金额: <span>￥{{invoiceInfo.price}}</span></div>
      <div class="invoice">订单号: <span>{{invoiceInfo.orderSn}}</span></div>
      <div class="invoice">发票类型:<span>{{invoiceInfo.invoiceType == 0 ? '个人' : '企业'}}</span></div>
      <div class="invoice">发票抬头:<span>{{invoiceInfo.invoiceSn}}</span></div>
      <div class="invoice" v-show="invoiceInfo.invoiceType == 1">单位税号:<span>{{invoiceInfo.code}}</span></div>
      <div class="invoice">邮箱地址:<span>{{invoiceInfo.email}}</span></div>
      <hr/>
      <div v-show="invoiceInfo.invoiceAudit != null">
        <div class="invoice">发票状态:
          <span v-show="invoiceInfo.invoiceAudit == 0">拒绝开发票</span>
          <span v-show="invoiceInfo.invoiceAudit == 1">同意开发票</span>
          <span v-show="invoiceInfo.invoiceAudit == 2">已邮箱发送</span>
        </div>
        <div class="invoice" v-show="invoiceInfo.invoiceAudit == 1">发票:
          <el-image :preview-src-list="[invoiceInfo.invoiceUrl]" :z-index="2100"
                    style="max-width: 100px;max-height: 100px;margin-left: 80px"
                    v-show="invoiceInfo.invoiceUrl" :src="invoiceInfo.invoiceUrl"/>
          <span v-show="!invoiceInfo.invoiceUrl">待上传...</span>
        </div>
        <div class="invoice">审核备注:<span>{{invoiceInfo.invoiceCause}}</span></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="invoiceOpen=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addNeworder,
    auditInvoiceInfo,
    auditPay,
    delNeworder,
    exportNeworder,
    getNeworder,
    getPayInfo,
    listNeworder,
    listNeworderDetail,
    setRemark,
    updateNeworder
  } from '@/api/course/ordernew'
  import { getOrderinvoice } from '@/api/eycode/orderinvoice'
  import { getToken } from '@/utils/auth'
  import Template from "../../certificate/template/index";

  export default {
    name: 'Ordernew',
    components: {Template},
    data() {
      return {
        invoiceOpen: false,
        invoiceInfo: {},
        remarkDetail: {
          id: undefined,
          remark: undefined
        },
        remarkOpen: false,
        // 下单时间
        placeDate: undefined,
        // 审核弹出框
        auditOpen: false,
        // 用户弹出框
        userAuditOpen: false,
        // 点击用户详情
        userDetail: {},
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
        // 新订单表格数据
        neworderList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          orderSn: undefined,
          userId: undefined,
          userType: undefined,
          price: undefined,
          discountPrice: undefined,
          amount: undefined,
          status: undefined,
          payType: undefined,
          invoiceStatus: undefined,
          payAuditStatus: undefined,
          payAuditCause: undefined,
          payAuditUser: undefined,
          payAuditTime: undefined,
          payTime: undefined,
          deptId: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          orderSn: [
            { required: true, message: '订单编号不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '下单用户id不能为空', trigger: 'blur' }
          ],
          userType: [
            { required: true, message: '用户类型 1-个人用户 2-企业用户不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '价格不能为空', trigger: 'blur' }
          ],
          discountPrice: [
            { required: true, message: '折扣价(暂未使用)不能为空', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '实付金额不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态0-未支付 1-提交信息未审核 2-已支付(包含审核通过) 3-已失效不能为空', trigger: 'blur' }
          ],
          payAuditStatus: [
            { required: true, message: '订单支付审核状态(用于线下转账) 0-待审核 1-审核通过 2-审核不通过不能为空', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '租户id不能为空', trigger: 'blur' }
          ]
        },
        // 上传图片地址
        uploadInvoiceImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg', // 上传的图片服务器地址
        // 请求头
        headers: {
          Authorization: 'Bearer ' + getToken()
        },

        /**============== 支付审核 参数 ========================**/
        // 加载层
        auditLoading: false,
        // 是否显示支付审核 弹出层
        orderPayAuditOpen: false,
        // 要显示的支付参数
        orderPayInfo: {
          data: {
            id: undefined,
            cardName: undefined,
            cardBank: undefined,
            cardNumber: undefined,
            transferTime: undefined,
            amount: undefined,
            status: 1,
            remark: ''
          }
        },
        /**============== 订单详情 参数 ========================**/
        // 是否显示订单详情 弹出层
        orderDetailsOpen: false,
        // 加载层
        orderDetailsLoading: false,
        // 订单详情数据列表
        orderDetailsList: [],
        // 订单详情-列表总条数
        orderDetailsTotal: 0,
        // 订单详情-列表查询参数
        orderDetailsQueryParams: {
          pageNum: 1,
          pageSize: 10,
          orderId: undefined
        }
      }
    },
    created() {
      this.getList()
    },
    watch: {
      $route: {
        handler: function(route) {
          if (route.name == 'Ordernew' && route.query.orderSn) {
            this.queryParams.orderSn = route.query.orderSn
            this.getList()
          } else if (route.name == 'Ordernew') {
            this.queryParams.orderSn = undefined
            this.getList()
          }
        },
        immediate: true
      }
    },
    methods: {
      /** 查看发票 */
      invoiceDetail(item) {
        // 发送请求获取申请的发票信息
        getOrderinvoice(item.orderInvoiceId).then(res => {
          if (res.code == 200) {
            this.invoiceInfo = res.data
            this.invoiceInfo.price = item.price
            this.invoiceInfo.orderSn = item.orderSn
            this.invoiceOpen = true
            console.log(this.invoiceInfo)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      /** 添加订单备注 */
      addRemark() {
        if (this.remarkDetail.remark == null || this.remarkDetail.remark == '') {
          this.$message.error('请填写备注！')
          return false
        }
        setRemark(this.remarkDetail).then(res => {
          if (res.code == 200) {
            this.$message.success('操作成功!')
            this.remarkOpen = false
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      orderRemark(item) {
        this.remarkDetail = {
          id: item.id,
          remark: item.remark
        }
        this.remarkOpen = true
      },
      /** 审核状态点击事件 */
      auditClick(data) {
        this.userDetail = data
        this.auditOpen = true
      },
      /** 用户名点击事件 */
      userClick(data) {
        this.userDetail = data
        this.userAuditOpen = true
      },
      /** 查询新订单列表 */
      getList() {
        if (this.placeDate != undefined && this.placeDate != null && this.placeDate != '') {
          let startTime = this.placeDate[0]
          let endTime = this.placeDate[1]
          this.queryParams.startTime = this.parseTime(startTime, '{y}-{m}-{d} {h}:{i}:{s}')
          this.queryParams.endTime = this.parseTime(endTime, '{y}-{m}-{d} {h}:{i}:{s}')
        } else {
          this.queryParams.startTime = null
          this.queryParams.endTime = null
        }
        this.loading = true
        listNeworder(this.queryParams).then(response => {
          this.neworderList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 保存发票审核信息
      saveInvoiceAudit() {
        // 发送请求保存数据
        auditInvoiceInfo(this.invoiceInfo.data)
          .then(res => {
            console.log(res)
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
      // 关闭发票信息窗口
      closeInvoiceAudit() {
        this.invoiceAuditOpen = false
      },
      // 上传发票成功
      handleUploadSuccess(res) {
        if (res.code == 200) {
          this.invoiceInfo.data.invoiceUrl = res.url
        } else {
          this.$message.error(res.msg)
        }
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
      // 显示订单详情列表弹窗
      orderDetaileBtn(row) {
        this.orderDetailsList = []
        // 订单详情-列表总条数
        this.orderDetailsTotal = 0
        this.orderDetailsOpen = true
        this.orderDetailsQueryParams.orderId = row.id
        listNeworderDetail(this.orderDetailsQueryParams)
          .then(res => {
            if (res.code == 200) {
              this.orderDetailsList = res.rows
              this.orderDetailsTotal = res.total
            } else {
              this.$message.error(res.msg)
            }

            this.orderDetailsLoading = false
          })
          .catch()
      },
      /*监听关闭订单详情*/
      closeDetail() {
        this.orderDetailsOpen = false
      },
      // 重置支付审核数据
      resetPayInfo() {
        let data = {
          id: undefined,
          cardName: undefined,
          cardBank: undefined,
          cardNumber: undefined,
          transferTime: undefined,
          status: 1,
          remark: ''
        }
        this.orderPayInfo.data = data
        this.orderPayInfo.amount = undefined
        this.orderPayInfo.orderNumber = undefined
      },
      // 支付审核按钮
      payAuditBtn(row) {
        // 显示弹出
        this.orderPayAuditOpen = true
        this.auditLoading = true
        this.orderPayInfo.amount = row.price
        this.orderPayInfo.orderNumber = row.orderSn
        // 发送请求获取提交的信息
        getPayInfo(row.id).then(res => {
          if (res.code == 200) {
            this.orderPayInfo.data = res.data
          } else {
            this.$message.error(res.msg)
          }
          this.auditLoading = false
        }).catch(() => {
          this.auditLoading = false
        })
      },
      // 支付审核 保存修改
      savePayAudit() {
        this.$confirm('此操作不可撤销,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {}
          // 订单id
          postData.id = this.orderPayInfo.data.orderId
          // 支付审核状态
          postData.payAuditStatus = this.orderPayInfo.data.status - 1
          // 支付审核备注
          postData.payAuditCause = this.orderPayInfo.data.remark
          postData.offlineInfoId = this.orderPayInfo.data.id
          postData.amount = this.orderPayInfo.data.amount
          auditPay(postData).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.orderPayAuditOpen = false
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          }).catch(() => {
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      // 订单详情-列表分页
      getOrderDetailPage() {
        this.orderDetailsLoading = true //笼罩层
        listNeworderDetail(this.orderDetailsQueryParams).then(response => {
          if (response.code == 200) {
            this.orderDetailsList = response.rows
            this.orderDetailsTotal = response.total
          } else {
            this.$message.error(res.msg)
          }

          this.orderDetailsLoading = false
        })
      },
      // 关闭 支付审核
      closePayAudit() {
        this.orderPayAuditOpen = false
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
          orderSn: undefined,
          userId: undefined,
          userType: undefined,
          price: undefined,
          discountPrice: undefined,
          amount: undefined,
          status: '0',
          payAuditStatus: '0',
          payAuditCause: undefined,
          payAuditUser: undefined,
          payAuditTime: undefined,
          createTime: undefined,
          updateTime: undefined,
          payTime: undefined,
          remark: undefined,
          deptId: undefined
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
        this.title = '添加新订单'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getNeworder(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改新订单'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateNeworder(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addNeworder(this.form).then(response => {
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
        this.$confirm('是否确认删除新订单编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delNeworder(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        if (this.placeDate != undefined && this.placeDate != null && this.placeDate != '') {
          let startTime = this.placeDate[0]
          let endTime = this.placeDate[1]
          this.queryParams.startTime = this.parseTime(startTime, '{y}-{m}-{d} {h}:{i}:{s}')
          this.queryParams.endTime = this.parseTime(endTime, '{y}-{m}-{d} {h}:{i}:{s}')
        } else {
          this.queryParams.startTime = null
          this.queryParams.endTime = null
        }
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有新订单数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          exportNeworder(queryParams).then(response => {
            const link = document.createElement('a')
            let blob = new Blob([response], {
              type: 'application/vnd.ms-excel'
            })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.download = new Date().getTime() + '订单数据列表'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          })
        }).catch(function() {
        })
      }
    }
  }
</script>

<style>
  .order-money {
    font-size: 16px;
    padding-bottom: 16px;
  }

  .order-money span {
    font-size: 16px;
    display: inline-block;
    height: 18px;
    padding-left: 16px;
    color: red;
  }

  a {
    color: #00afff;
  }

  .user-detail {
    font-size: 16px;
    padding-bottom: 16px;
  }

  .user-detail span {
    font-size: 16px;
    display: inline-block;
    height: 18px;
    padding-left: 16px;
  }

  .order-money-small {
    padding-bottom: 12px;
  }

  .order-money-small span {
    font-size: 16px;
    display: inline-block;
    height: 18px;
    padding-left: 16px;
    color: red;
  }

  .audit {
    padding-bottom: 16px;
    font-size: 16px;
  }
  .invoice {
    font-size: 16px;
    padding-bottom: 16px;
  }

  .invoice span {
    font-size: 16px;
    display: inline-block;
    height: 18px;
    padding-left: 16px;
    color: gray;
  }
</style>
