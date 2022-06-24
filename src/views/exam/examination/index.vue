<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="题库" prop="prefaceId">
        <el-select v-model="queryParams.prefaceId" filterable placeholder="请选择所属题库" clearable size="small">
          <el-option
            v-for="dict in selectCategory"
            :key="dict.id"
            :label="dict.title"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否开放" prop="tryAndSee">
        <el-select v-model="queryParams.tryAndSee" placeholder="请选择是否开放" clearable size="small">
          <el-option
            v-for="dict in tryAndSeeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
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
          v-hasPermi="['exam:examination:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['exam:examination:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['exam:examination:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['exam:examination:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="examinationList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection"  align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="题库名称" align="center" prop="btitle" />
      <el-table-column label="章节名称" align="center" prop="title" />
      <el-table-column label="是否开放" align="center" prop="tryAndSee" :formatter="tryAndSeeFormat" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-order" @click="toChdas(scope.row)">
              <span>小节管理</span>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['exam:examination:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['exam:examination:remove']"
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

    <!-- 添加或修改试卷管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题库" prop="prefaceId">
          <el-select v-model="form.prefaceId" filterable placeholder="请选择题库" :disabled="zzxg">
            <el-option
              v-for="dict in selectCategory"
              :key="dict.id"
              :label="dict.title"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="章节名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入章节名称" />
        </el-form-item>
        <el-form-item label="是否开放">
          <el-radio-group v-model="form.tryAndSee">
            <el-radio
              v-for="dict in tryAndSeeOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
import { listExamination, getExamination, delExamination, addExamination, updateExamination, exportExamination, selectCategory, } from "@/api/exam/examination";

export default {
  name: "Examination",
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
      // 试卷管理表格数据
      examinationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否开放字典
      tryAndSeeOptions: [],
      // 状态字典
      statusOptions: [],
      //题库默认参数
      selectCategory:undefined,
      //判断是否可以修改题库
      zzxg:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        prefaceId: undefined,
        title: undefined,
        tryAndSee: undefined,
        status: undefined,
        pid: 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        prefaceId: [
          { required: true, message: "请选择关联的题库", trigger: "blur" }
        ],
        title: [
          { required: true, message: "章节名称不能为空", trigger: "blur" }
        ],
        tryAndSee: [
          { required: true, message: "是否开放不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.queryParams.prefaceId = this.$route.params && this.$route.params.prefaceId;
    this.getList();
    this.getDicts("cust_yes_no").then(response => {
      this.tryAndSeeOptions = response.data;
    });
    this.getDicts("putway_status").then(response => {
      this.statusOptions = response.data;
    });
    selectCategory().then(response => {
      this.selectCategory = response.data;
    });
  },
  methods: {
    /** 查询试卷管理列表 */
    getList() {
      this.loading = true;
      listExamination(this.queryParams).then(response => {
        this.examinationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否开放字典翻译
    tryAndSeeFormat(row, column) {
      return this.selectDictLabel(this.tryAndSeeOptions, row.tryAndSee);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        prefaceId: undefined,
        title: undefined,
        tryAndSee: 0,
        status: 1,
        createTime: undefined,
        createBy: undefined,
        pid : 0,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.zzxg = false;
      this.title = "添加章节管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExamination(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.zzxg = true;
        this.title = "修改章节管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateExamination(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addExamination(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除试卷管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delExamination(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有试卷管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportExamination(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //带参数跳转小节
    toChdas(row){
      this.$router.push({
        name:'Xiaojie',
        params:{
          pid:row.id,//本身父ID
          prefaceId:row.prefaceId,//题库ID
          btitle:row.btitle,//题库标题
          title:row.title//章节名称
        }
      })
    }
  }
};
</script>
