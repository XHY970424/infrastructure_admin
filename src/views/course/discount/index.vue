<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!-- <el-form-item label="折扣" prop="discount">
        <el-input
          v-model="queryParams.discount"
          placeholder="请输入折扣"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="是否启用" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择是否启用" clearable size="small">
          <el-option label="停用" :value="0" />
          <el-option label="启用" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="折扣名称" prop="discountName">
        <el-input
          v-model="queryParams.discountName"
          placeholder="请输入折扣名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- el-form-item label="折扣开始时间" label-width="120" prop="startTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择折扣开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="折扣结束时间" label-width="120" prop="endTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择折扣结束时间">
        </el-date-picker>
      </el-form-item -->
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
          v-hasPermi="['eycode:discount:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eycode:discount:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:discount:remove']"
        >删除</el-button>
      </el-col>
      <!-- el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:discount:export']"
        >导出</el-button>
      </el-col -->
    </el-row>

    <el-table v-loading="loading" :data="discountList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="discountId" width="100" />
      <el-table-column label="折扣名称" align="center" prop="discountName" width="180" />
      <el-table-column label="折扣" align="center" prop="discount" width="140" />
      <el-table-column label="折扣开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" prop="status" width="120">
        <template slot-scope="scope">
          <span> {{ scope.row.status == 0 ? '已停用' : '已启用' }} </span>
        </template>
      </el-table-column>
      <el-table-column label="已关联产品数" align="center" prop="countProduct" :show-overflow-tooltip="true" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-order" v-hasPermi="['eycode:discountrelevance:list']">
            <router-link :to="'/discountrelevance/discountrelevance/'+scope.row.discountId" class="link-type">
              <span>关联产品</span>
            </router-link>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:discount:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:discount:remove']"
          >删除</el-button>
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

    <!-- 添加或修改折扣对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="折扣名称" prop="discountName">
          <el-input v-model="form.discountName" placeholder="请输入折扣名称" />
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input v-model="form.discount" placeholder="请输入折扣,如打8折则填写 0.80, 保留两位小数" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0"> 停用 </el-radio>
            <el-radio :label="1"> 启用 </el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="!isEdit"><span style="color: red">新增后不可修改折扣时间</span></div>
<!--        :disabled="isEdit"  -->
        <el-form-item label="折扣开始时间" label-width="120" prop="startTime">
          <el-date-picker clearable size="small" style="width: 200px"
            :disabled="isEdit"
            v-model="form.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择折扣开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="折扣结束时间" label-width="120" prop="endTime">
          <el-date-picker clearable size="small" style="width: 200px"
            :disabled="isEdit"
            v-model="form.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择折扣结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="备注" />
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
import { listDiscount, getDiscount, delDiscount, addDiscount, updateDiscount, exportDiscount } from "@/api/course/discount";

export default {
  name: "Discount",
  components: {},
  data() {
    return {
      // 是否修改
      isEdit: false,
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
      // 折扣表格数据
      discountList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        discount: undefined,
        type: undefined,
        status: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        discountName: [
          { required: true, message: "折扣名称不能为空", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "折扣不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择是否启用", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "折扣开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "折扣结束时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询折扣列表 */
    getList() {
      this.loading = true;
      listDiscount(this.queryParams).then(response => {
        this.discountList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        discountId: undefined,
        discountName: undefined,
        discount: undefined,
        type: undefined,
        status: 0,
        startTime: undefined,
        endTime: undefined,
        remark: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
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
      this.ids = selection.map(item => item.discountId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加折扣";
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const discountId = row.discountId || this.ids

      getDiscount(discountId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改折扣";
        this.isEdit = true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 验证折扣填写是否正确
          if (this.form.discount <= 0) {
            this.msgError("折扣不能为0");
            return;
          }
          let reg = /^0\.\d{1,2}$/;
          if (!reg.test(this.form.discount)) {
            this.msgError("折扣格式不正确,正确格式可为: 0.8, 0.85等");
            return;
          }
          // 结束时间不能小于开始时间
          if (this.form.startTime > this.form.endTime) {
            this.msgError("结束时间不能小于开始时间");
            return;
          }
          if (this.form.discountId != undefined) {
            updateDiscount(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDiscount(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
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
      const discountIds = row.discountId || this.ids;
      this.$confirm('是否确认删除折扣编号为"' + discountIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDiscount(discountIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有折扣数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDiscount(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
