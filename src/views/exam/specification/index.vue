<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="规则名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="出题方式" prop="setQuestion">
        <el-select v-model="queryParams.setQuestion" placeholder="请选择出题方式" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
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
          v-hasPermi="['exam:specification:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['exam:specification:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['exam:specification:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="specificationList" @selection-change="handleSelectionChange" border="">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" width="55" align="center" prop="id" />
      <el-table-column label="规则名称" align="center" prop="title" />
<!--      <el-table-column label="测试时长(分)" align="center" prop="testTime" />
      <el-table-column label="总分" align="center" prop="totalPoints" />
      <el-table-column label="及格分" align="center" prop="passMark" />
      <el-table-column label="出题方式" align="center" prop="setQuestion" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['exam:specification:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['exam:specification:remove']"
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

    <!-- 添加或修改试题规则设立对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="规则名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入规则名称" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">
            <el-form-item label="总分" prop="totalPoints">
              <el-input-number :min="0" v-model="form.totalPoints" placeholder="请输入总分" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="及格分" prop="passMark">
              <el-input-number :min="0" v-model="form.passMark" placeholder="请输入及格分" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="测试时长" prop="testTime">
              <el-input-number :min="0" v-model="form.testTime" placeholder="单位:分" />
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-row>
              <el-col :span="10">
                <el-form-item label="题型排序" prop="topicSort">
                  <draggable v-model="typeOptions"  @start="start" @end="end">
                      <transition-group>
                        <el-button  type="primary" size="small" v-for="element in typeOptions" :key="element.dictValue">{{element.dictLabel}}</el-button>
                      </transition-group>
                  </draggable>
                </el-form-item>
              </el-col>
              <el-col :span="14"><span class="beizhu">（通过左右拖动进行排序）</span></el-col>
             </el-row>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="出题方式">
                <el-radio-group v-model="form.setQuestion" size="medium">
                  <el-radio border label="0">随机抽取</el-radio>
                  <el-radio border label="1">手工选择</el-radio>
                </el-radio-group>
              </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="单选题" prop="dan">
                  <el-row>
                    <el-col :span="2">
                      &nbsp;&nbsp;共
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="dan.sum" :min="0" :controls="false" style="width: 80px;" />
<!--                      <el-input v-model="dan.sum" type="number" :min="0" /> -->
                    </el-col>
                    <el-col :span="5">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题，每题
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="dan.minute" :min="0" :controls="false" style="width: 80px;" />
                    </el-col>
                    <el-col :span="1">
                      &nbsp;&nbsp;&nbsp;分
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item label="多选题" prop="duo">
                  <el-row>
                    <el-col :span="2">
                      &nbsp;&nbsp;共
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="duo.sum" :min="0" :controls="false" style="width: 80px;" />
                    </el-col>
                    <el-col :span="5">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题，每题
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="duo.minute" :min="0" :controls="false" style="width: 80px;" />
                    </el-col>
                    <el-col :span="1">
                      &nbsp;&nbsp;&nbsp;分
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="判断题" prop="pan">
                  <el-row>
                    <el-col :span="2">
                      &nbsp;&nbsp;共
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="pan.sum" :min="0" :controls="false" style="width: 80px;" />
                    </el-col>
                    <el-col :span="5">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题，每题
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="pan.minute" :min="0" :controls="false" style="width: 80px;" />
                    </el-col>
                    <el-col :span="1">
                      &nbsp;&nbsp;&nbsp;分
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="案例题" prop="an">
                  <el-row>
                    <el-col :span="2">
                      &nbsp;&nbsp;共
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="an.sum" :min="0" :controls="false" style="width: 80px;" />
                    </el-col>
                    <el-col :span="5">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题，每题
                    </el-col>
                    <el-col :span="5">
                      <el-input-number v-model="an.minute" :min="0" :controls="false" style="width: 80px;" />
                    </el-col>
                    <el-col :span="1">
                      &nbsp;&nbsp;&nbsp;分
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
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
import { listSpecification, getSpecification, delSpecification, addSpecification, updateSpecification, exportSpecification } from "@/api/exam/specification";
import draggable from 'vuedraggable'

export default {
  name: "Specification",
  components: {draggable},
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
      // 试题规则设立表格数据
      specificationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        setQuestion: undefined,
        createTime: undefined,
      },
      //单选题
      dan:{},
      //多选题
      duo:{},
      //判断题
      pan:{},
      //案例题
      an:{},
      // 表单参数
      form: {

      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: "规则名称不能为空", trigger: "blur" }
        ],
        // testTime: [
        //   { required: true, message: "测试时长(分)不能为空", trigger: "blur" }
        // ],
        // totalPoints: [
        //   { required: true, message: "总分不能为空", trigger: "blur" }
        // ],
        // passMark: [
        //   { required: true, message: "及格分不能为空", trigger: "blur" }
        // ],
        // setQuestion: [
        //   { required: true, message: "出题方式不能为空", trigger: "blur" }
        // ],
      },
      //试题类型排序参数
      topicSort:[],
      // 题目类型字典
      typeOptions: [],
    };
  },
  created() {
    this.txpxcsh();
    this.getList();
  },
  methods: {
    /** 题型排序初始化 */
    txpxcsh(){
      this.getDicts("question_types").then(response => {
      const typelist = [];
        response.data.forEach(function (item, index) {
          typelist.push({dictLabel:item.dictLabel,dictValue:item.dictValue})
        })
         typelist.push({dictLabel:"案例题",dictValue:"4"})
         this.typeOptions=typelist;
      });
    },
    /** 查询试题规则设立列表 */
    getList() {
      this.loading = true;
      listSpecification(this.queryParams).then(response => {
        this.specificationList = response.rows;
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
        testTime: undefined,
        totalPoints: undefined,
        passMark: undefined,
        topicSort: undefined,
        setQuestion: "0",
        setting: {},
      };
      this.an = {};
      this.dan = {};
      this.duo = {};
      this.pan = {};
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
      this.txpxcsh();
      this.reset();
      this.open = true;
      this.title = "添加试题规则设立";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSpecification(id).then(response => {
        this.form = response.data;
        this.typeOptions = JSON.parse(this.form.topicSort);
        const setting = JSON.parse(this.form.setting);
        this.dan = {sum:setting[0].sum,minute:setting[0].minute};
        this.duo = {sum:setting[1].sum,minute:setting[1].minute};
        this.pan = {sum:setting[2].sum,minute:setting[2].minute};
        this.an  = {sum:setting[3].sum,minute:setting[3].minute};
        this.open = true;
        this.title = "修改试题规则设立";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if(this.dan.minute == undefined || this.dan.sum == undefined){
        this.msgError("请填写完整单选题");
        return false;
      }else if(this.duo.minute == undefined || this.dan.sum == undefined){
        this.msgError("请填写完整多选题");
        return false;
      }else if(this.pan.minute == undefined || this.dan.sum == undefined){
        this.msgError("请填写完整判断题");
        return false;
      }else if(this.an.minute == undefined || this.dan.sum == undefined){
        this.msgError("请填写完整案例题");
        return false;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.topicSort = JSON.stringify(this.typeOptions);
          this.form.setting = [];
          this.form.setting.push(this.dan);
          console.log(this.form.setting);
          this.form.setting.push(this.duo);
          this.form.setting.push(this.pan);
          this.form.setting.push(this.an);
          this.form.setting = JSON.stringify(this.form.setting);
          if (this.form.id != undefined) {
            updateSpecification(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSpecification(this.form).then(response => {
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
      this.$confirm('是否确认删除试题规则设立编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSpecification(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有试题规则设立数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSpecification(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //拖拽开始事件
    start (e) {
        console.log(e)
    },
    //拖拽结束事件
    end (e) {
        console.log(e)
        console.log(this.typeOptions)
    },
  }
};
</script>
<style>
  .beizhu{
    line-height: 40px;
    color: red;
    opacity: 0.8;
  }
</style>
