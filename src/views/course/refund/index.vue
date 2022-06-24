<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户姓名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退课单号" prop="refundSn">
        <el-input
          v-model="queryParams.refundSn"
          placeholder="请输入退课申请单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原订单号" prop="orderSn">
        <el-input
          v-model="queryParams.orderSn"
          placeholder="请输入原订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="退课状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择退课单状态" clearable size="small">
          <el-option label="待审核" :value="0" />
          <el-option label="审核通过且已退款" :value="1" />
          <el-option label="审核不通过" :value="2" />
          <el-option label="取消退课" :value="3" />
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:newrefund:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="newrefundList" @selection-change="handleSelectionChange" border>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="ID" align="center" prop="refundId" /> -->
      <el-table-column label="用户姓名" align="center" prop="nickName" fixed="left"/>
      <el-table-column label="退课申请单号" align="center" prop="refundSn" fixed="left" width="200" />
      <el-table-column label="原订单号" align="center" prop="orderSn" fixed="left" width="200" />
      <el-table-column label="退款金额(元)" align="center" prop="refundMoney" width="100"/>
      <el-table-column label="退课原因" align="center" prop="refundCause" width="145">
        <template slot-scope="scope">
          <span v-if="scope.row.refundCause == 0">课程不喜欢/不想要</span>
          <span v-if="scope.row.refundCause == 1">课程与专业不对口</span>
          <span v-if="scope.row.refundCause == 2">误点/报错课程</span>
          <span v-if="scope.row.refundCause == 3">课程质量差</span>
          <span v-if="scope.row.refundCause == 4">其他</span>
        </template>
      </el-table-column>
      <el-table-column label="退课原因描述" align="center" prop="refundCauseDesc" width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #00AFFF;" @click="showRefundCause(scope.row.refundCauseDesc)"> {{scope.row.refundCauseDesc}} </span>
        </template>
      </el-table-column>
      <el-table-column label="退课单状态" align="center" prop="status" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">待审核</span>
          <span v-if="scope.row.status == 1">审核通过且已退款</span>
          <span v-if="scope.row.status == 2">审核不通过</span>
          <span v-if="scope.row.status == 3">取消退课</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="auditName" />
      <el-table-column label="审核备注" align="center" prop="auditRemark" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="取消时间" align="center" prop="cancelTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.cancelTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="140" >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:newrefund:query']"
          >审核</el-button>
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:newrefund:audit']"
          >详情</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:newrefund:edit']"
          >修改</el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:newrefund:remove']"
          >删除</el-button> -->
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

    <!-- 显示退课原因描述 -->
    <el-dialog title="退课原因描述" :visible.sync="descOpen" width="300px" append-to-body>
      <span>{{causeDesc}}</span>
    </el-dialog>

    <!-- 添加或修改退课对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item style="display: none;">
          <el-input v-model="form.refundId"></el-input>
        </el-form-item>
        <el-form-item label="退款人" >
          <!-- <el-input v-model="form.nickName" disabled="disabled"/> -->
          <span> {{ form.nickName }} </span>
        </el-form-item>
        <el-form-item label="申请单号" >
          <!-- <el-input v-model="form.refundSn" disabled="disabled" /> -->
          <span> {{ form.refundSn }} </span>
        </el-form-item>
        <el-form-item label="申请时间" >
          <span> {{ parseTime(form.createTime, '{y}-{m}-{d}  {h}:{i}:{s}') }} </span>
        </el-form-item>
        <el-form-item label="退课原因" prop="refundCause">
          <span v-if="form.refundCause == 0">课程不喜欢/不想要</span>
          <span v-if="form.refundCause == 1">课程与专业不对口</span>
          <span v-if="form.refundCause == 2">误点/报错课程</span>
          <span v-if="form.refundCause == 3">课程质量差</span>
          <span v-if="form.refundCause == 4">其他</span>
        </el-form-item>
        <el-form-item label="原因描述" prop="refundCauseDesc">
          <span> {{form.refundCauseDesc}} </span>
        </el-form-item>
        <el-form-item label="实付金额" prop="payMoney">
          <!-- <el-input v-model="form.refundMoney" placeholder="请输入退款金额" /> -->
          <span> {{form.payMoney}} </span>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundMoney">
          <!-- <el-input v-model="form.refundMoney" placeholder="请输入退款金额" /> -->
          <span> {{form.refundMoney}} </span>
        </el-form-item>
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1" >通过</el-radio>
            <el-radio :label="2" >不通过</el-radio>
            <el-radio :label="4" >已退款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注" prop="auditRemark">
          <el-input type="textarea" v-model="form.auditRemark" placeholder="请输入审核备注" />
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
import { listNewrefund, getNewrefund, delNewrefund, addNewrefund, updateNewrefund, exportNewrefund } from "@/api/course/refund";

export default {
  name: "refund",
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
      // 退课表格数据
      newrefundList: [],
      // 退课原因描述是否显示弹出层
      descOpen: false,
      // 退课原因
      causeDesc: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        refundSn: undefined,
        orderSn: undefined,
        refundMoney: undefined,
        refundCause: undefined,
        refundCauseDesc: undefined,
        status: undefined,
        auditBy: undefined,
        auditRemark: undefined,
        auditTime: undefined,
        cancelTime: undefined,
        deptId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [
          { required: true, message: "请选择审核结果", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询退课列表 */
    getList() {
      this.loading = true;
      listNewrefund(this.queryParams).then(response => {
        this.newrefundList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 显示退课原因描述
    showRefundCause(causeDesc){
      this.descOpen = true
      this.causeDesc = causeDesc;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        refundId: undefined,
        userId: undefined,
        nickName: undefined,
        refundSn: undefined,
        orderSn: undefined,
        payMoney: undefined,
        refundMoney: undefined,
        refundCause: undefined,
        refundCauseDesc: undefined,
        status: undefined,
        auditBy: undefined,
        auditRemark: undefined,
        auditTime: undefined,
        createTime: undefined,
        updateTime: undefined,
        cancelTime: undefined,
        deptId: undefined
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
      this.ids = selection.map(item => item.refundId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加退课";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const refundId = row.refundId || this.ids
      getNewrefund(refundId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改退课";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.refundId != undefined) {
            updateNewrefund(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
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
      const refundIds = row.refundId || this.ids;
      this.$confirm('是否确认删除退课编号为"' + refundIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNewrefund(refundIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有退课数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportNewrefund(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>

<style scoped lang="scss">
  .el-dialog__body{
    padding: 0 20px;
  }
  .el-form-item {
      margin-bottom: 6px;
  }
</style>
