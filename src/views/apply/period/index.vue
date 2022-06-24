<template>
  <div class="app-container">
    <el-form ref="form" label-width="90px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="当前项目：">{{ projectName }}</el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="当前课题：">{{
            queryParams.topicName
          }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="期次名称" prop="periodName">
        <el-input
          v-model="queryParams.periodName"
          placeholder="请输入期次名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="期次状态"
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
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['apply:period:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="recoveryStation"
          >{{ queryParams.isDeleted == 0 ? "回收站" : "退出回收站" }}</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="periodList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="期次名称" align="center" prop="periodName" />
      <el-table-column label="计划开始时间" align="center" prop="startTime">
        <template slot-scope="scope">
          <span>{{ formatTime(Number(scope.row.startTime)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center" prop="endTime">
        <template slot-scope="scope">
          <span>{{ formatTime(Number(scope.row.endTime)) }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        v-if="queryParams.isDeleted == 0"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInfo(scope.row)"
            v-hasPermi="['apply:period:query']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['apply:period:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['apply:period:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        v-else
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRecover(scope.row)"
            v-hasPermi="['apply:period:recover']"
            >恢复</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改报名期次对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="期次名称" prop="periodName">
          <el-input v-model="form.periodName" show-word-limit :maxlength="30" placeholder="请输入期次名称" />
        </el-form-item>
        <el-form-item label="计划时间" prop="date">
          <!-- {{form.date}}-123123 -->
          <el-date-picker
            v-model="form.date"
            value-format="yyyy-MM-dd HH:mm:ss"
            @blur="dateChange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="选择计划开始时间"
            end-placeholder="选择计划结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" v-if="isAdd">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      title="期次详情"
      :visible.sync="infoOpen"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="期次名称：">{{
              info.periodName
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划开始时间：">{{
              formatTime(Number(info.startTime))
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划结束时间：">{{
              formatTime(Number(info.endTime))
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创建人：">{{ info.createBy }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="创建时间：">{{
              formatTime(info.createTime)
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情end -->
  </div>
</template>

<script>
import {
  listPeriod,
  getPeriod,
  delPeriod,
  addPeriod,
  updatePeriod,
  exportPeriod,
  updateStatus,
  recover,
} from "@/api/apply/period";

export default {
  name: "Period",
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
      // 报名期次表格数据
      periodList: [],
      // 弹出层标题
      title: "",
      //是否新增
      isAdd: true,
      // 是否显示弹出层
      open: false,
      //是否显示详情弹出层
      infoOpen: false,
      //项目名称
      projectName: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        periodName: undefined,
        topicId: undefined,
        topicName: undefined,
        status: undefined,
        isDeleted: 0,
      },
      // 表单参数
      form: {},
      //期次详情
      info: {},
      // 表单校验
      rules: {
        periodName: [
          { required: true, message: "期次名称不能为空", trigger: "blur" },
        ],
        date: [
          { required: true, message: "计划时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (
          this.$route.query &&
          this.$route.query.topicName &&
          this.$route.query.topicId
        ) {
          this.projectName = this.$route.query && this.$route.query.projectName;
          this.queryParams.topicName =
            this.$route.query && this.$route.query.topicName;
          this.queryParams.topicId =
            this.$route.query && this.$route.query.topicId;
          this.getList();
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  created() {
    this.projectName = this.$route.query && this.$route.query.projectName;
    this.queryParams.topicName =
      this.$route.query && this.$route.query.topicName;
    this.queryParams.topicId = this.$route.query && this.$route.query.topicId;
    this.getDicts("apply_project_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getList();
  },
  methods: {
    dateChange(){
      this.$forceUpdate()
    },
    /**查看详情 */
    handleInfo(row) {
      const periodId = row.periodId || this.ids;
      getPeriod(periodId).then((response) => {
        this.info = response.data;
        this.infoOpen = true;
      });
    },
    //恢复操作
    handleRecover(row) {
      const periodIds = row.periodId || this.ids;
      this.$confirm(
        '是否确认恢复期次名为"' + row.periodName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return recover(periodIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("恢复成功");
        })
        .catch(function () {});
    },
    //进入退出回收站
    recoveryStation() {
      if (this.queryParams.isDeleted == 0) {
        this.queryParams.isDeleted = 2;
      } else {
        this.queryParams.isDeleted = 0;
      }
      this.getList();
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.periodName + '"期次吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateStatus({ ids: [row.periodId], status: row.status });
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
    /** 查询报名期次列表 */
    getList() {
      this.loading = true;
      listPeriod(this.queryParams).then((response) => {
        this.periodList = response.rows;
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
        periodName: undefined,
        topicId: this.queryParams.topicId,
        topicName: this.queryParams.topicName,
        startTime: undefined,
        endTime: undefined,
        date:[],
        status: "0",
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
      this.ids = selection.map((item) => item.periodId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.isAdd = true;
      this.open = true;
      this.title = "添加报名期次";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.isAdd = false;
      const periodId = row.periodId || this.ids;
      getPeriod(periodId).then((response) => {
        this.form = response.data;
        this.form.startTime = this.formatTime(Number(row.startTime));
        this.form.endTime = this.formatTime(Number(row.endTime));
        // this.form.date = ['Thu Mar 17 2022 00:00:00 GMT+0800 (中国标准时间)', Wed Apr 13 2022 00:00:00 GMT+0800 (中国标准时间)]
        this.form.date = [this.form.startTime,this.form.endTime]
        this.open = true;
        this.title = "修改报名期次";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        this.form.startTime = new Date(this.form.date[0]).getTime();
        this.form.endTime = new Date(this.form.date[1]).getTime();
        if (valid) {
          if (this.form.periodId != undefined) {
            updatePeriod(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPeriod(this.form).then((response) => {
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
      const periodIds = row.periodId || this.ids;
      this.$confirm(
        '是否确认删除报名期次名为"' + row.periodName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPeriod(periodIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有报名期次数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPeriod(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
