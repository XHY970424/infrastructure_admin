<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="试题分类" prop="prefaceId" >
        <el-select v-model="queryParams.prefaceId" placeholder="请选择题库" filterable clearable size="small"  @change="handleChange(1)">
          <el-option
            v-for="dict in selectCategory"
            :key="dict.id"
            :label="dict.title"
            :value="dict.id"
          ></el-option>
        </el-select>
        <el-select v-model="queryParams.examinationId" placeholder="请选择章节" filterable clearable size="small"  @change="handleChange(4)">
          <el-option
            v-for="dict in selectExaminations"
            :key="dict.id"
            :label="dict.title"
            :value="dict.id"
          ></el-option>
        </el-select>
        <el-select v-model="queryParams.examinationPid" placeholder="请选择小节" filterable clearable size="small">
          <el-option
            v-for="dict in selectPids"
            :key="dict.id"
            :label="dict.title"
            :value="dict.id"
          ></el-option>
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
          v-hasPermi="['exam:problem:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['exam:problem:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['exam:problem:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['exam:problem:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="problemList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="55" />
      <el-table-column type="text" label="分类名称" align="center" width="200px" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        <span>{{scope.row.ctitle + " / " +scope.row.btitle + " / " +scope.row.dtitle }}</span>
      </template>
      </el-table-column>
      <el-table-column label="案例标题" align="center" prop="title" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-order">
            <router-link :to="'/problem/problem/'+scope.row.id" class="link-type">
              <span>小题</span>
            </router-link>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['exam:problem:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['exam:problem:remove']"
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

    <!-- 添加或修改案例题对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="试题分类">
              <el-select v-model="form.prefaceId" placeholder="请选择题库" @change="handleChange(2)" filterable >
                <el-option
                  v-for="dict in selectCategory"
                  :key="dict.id"
                  :label="dict.title"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-select v-model="updExaminationId" placeholder="请选择章节" @change="handleChange(3)" filterable >
              <el-option
                v-for="dict in selectExamination"
                :key="dict.id"
                :label="dict.title"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            <el-select v-model="updPid" placeholder="请选择小节" filterable >
              <el-option
                v-for="dict in selectPid"
                :key="dict.id"
                :label="dict.title"
                :value="dict.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="24">
            <el-form-item label="案例标题" prop="title">
              <!-- <Editor id="title" v-model="form.title" class="fwbbj"  /> -->
              <EditorTow id="title" v-model="form.title" class="fwbbj"  />
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProblem, getProblem, delProblem, addProblem, updateProblem, exportProblem } from "@/api/exam/problem";
import Editor from '@/components/Editor';
import EditorTow from "@/components/Tinymce";
import { selectCategory } from "@/api/exam/examination";
import {selectExamination } from "@/api/exam/questions";

export default {
  name: "Problem",
  components: {Editor,EditorTow},
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
      // 案例题表格数据
      problemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //题库下拉参数
      selectCategory:undefined,
      //筛选试卷下拉
      selectExaminations:undefined,
      //添加修改试卷下拉
      selectExamination:undefined,
      //筛选小节下拉
      selectPids:undefined,
      //添加修改小节下拉
      selectPid:undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        prefaceId: undefined,
        examinationId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "案例标题不能为空", trigger: "blur" }
        ],
        prefaceId: [
          { required: true, message: "题库ID不能为空", trigger: "blur" }
        ],
        examinationId: [
          { required: true, message: "试卷ID不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      },
      //存储变量值(this.from.prefaceId、this.from.examinationId)
      updPrefaceId: undefined,
      updExaminationId: undefined,
      updPid:undefined,
    };
  },
  created() {
    this.getList();
    selectCategory().then(response => {
      this.selectCategory = response.data;
    });
  },
  methods: {
    /** 查询案例题列表 */
    getList() {
      this.loading = true;
      listProblem(this.queryParams).then(response => {
        this.problemList = response.rows;
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
        id: undefined,
        title: undefined,
        prefaceId: undefined,
        examinationId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.updPrefaceId=undefined;
      this.updExaminationId=undefined;
      this.updPid=undefined;
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
      this.title = "添加案例题";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProblem(id).then(response => {
        this.form = response.data;
        this.updPrefaceId = this.form.prefaceId;
        this.updExaminationId = this.form.examinationId;
        this.updPid = this.form.examinationPid
        this.handleChange(2);
        this.handleChange(3);
        this.open = true;
        this.title = "修改案例题";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.updExaminationId == undefined || this.form.prefaceId == undefined || this.updPid == undefined){
             this.msgError('请完善试题分类');
             return false;
          }
          //赋值
          this.form.examinationId = this.updExaminationId;
          this.form.examinationPid = this.updPid;
          if (this.form.id != undefined) {
            updateProblem(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProblem(this.form).then(response => {
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
      this.$confirm('是否确认删除案例题编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProblem(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有案例题数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProblem(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 筛选题库ID获取下属试卷 */
    handleChange(id){
      if(id == 1){
        var zsd = {id:this.queryParams.prefaceId};
        selectExamination(zsd).then(response => {
          this.queryParams.examinationId = undefined;
          this.selectExaminations = response.data;
        });
      }else if(id == 2){
        var zsd = {id:this.form.prefaceId};
        selectExamination(zsd).then(response => {
          this.selectExamination = response.data;
          if (this.form.prefaceId != this.updPrefaceId) this.updExaminationId = undefined;
          if (this.form.prefaceId == this.updPrefaceId) this.updExaminationId = this.form.examinationId;
          if (this.form.examinationId != this.updExaminationId) this.updPid = undefined;
          if (this.form.examinationId == this.updExaminationId) this.updPid = this.form.examinationPid;
        });
      }else if(id == 3){
        var zsd = {pid:this.updExaminationId};
        selectExamination(zsd).then(response => {
          this.selectPid = response.data;
          if (this.form.examinationId != this.updExaminationId) this.updPid = undefined;
          if (this.form.examinationId == this.updExaminationId) this.updPid = this.form.examinationPid;
        });
      }else if(id == 4){
        var zsd = {pid:this.queryParams.examinationId};
        selectExamination(zsd).then(response => {
          this.selectPids = response.data;
        });
      }
    },
  }
};
</script>
<style>
  .fwbbj{
    margin-bottom: 50px;
  }
</style>
