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
          <el-col :span="11">
            <el-form-item label="题型排序" prop="topicSort">
              <draggable v-model="typeOptions">
                  <transition-group>
                    <el-button  type="primary" size="small" v-for="element in typeOptions" :key="element.dictValue">{{element.dictLabel}}</el-button>
                  </transition-group>
              </draggable>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <span class="beizhu">（通过左右拖动进行排序）</span>
          </el-col>
          <el-col :span="24">
            <el-form-item label="单选题" prop="dan">
                  <el-row>
                    <el-col :span="1">
                      共
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="dan.sum" disabled=""  />
                    </el-col>
                    <el-col :span="2">
                        &nbsp;题，每题
                    </el-col>
                    <el-col :span="3">
                      <el-input-number v-model="dan.minute" :min="0" :controls="false" style="width: 100px;" />
                    </el-col>
                    <el-col :span="1">
                      分
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="info" size="small" @click="itemList(1)">看题</el-button>
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="primary" size="small" @click="innerVisibles(1)" >选题</el-button>
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="多选题" prop="duo">
                  <el-row>
                    <el-col :span="1">
                      共
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="duo.sum" disabled=""  />
                    </el-col>
                    <el-col :span="2">
                        &nbsp;题，每题
                    </el-col>
                    <el-col :span="3">
                      <el-input-number v-model="duo.minute"  :min="0" :controls="false" style="width: 100px;"   />
                    </el-col>
                    <el-col :span="1">
                      分
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="info" size="small" @click="itemList(2)" >看题</el-button>
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="primary" size="small" @click="innerVisibles(2)" >选题</el-button>
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="判断题" prop="pan">
                  <el-row>
                    <el-col :span="1">
                      共
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="pan.sum" disabled=""  />
                    </el-col>
                    <el-col :span="2">
                        &nbsp;题，每题
                    </el-col>
                    <el-col :span="3">
                      <el-input-number v-model="pan.minute"  :min="0" :controls="false" style="width: 100px;"  />
                    </el-col>
                    <el-col :span="1">
                      分
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="info" size="small" @click="itemList(0)" >看题</el-button>
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="primary" size="small" @click="innerVisibles(0)" >选题</el-button>
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="案例题" prop="an">
                  <el-row>
                    <el-col :span="1">
                      共
                    </el-col>
                    <el-col :span="3">
                      <el-input v-model="an.sum" disabled=""  />
                    </el-col>
                    <el-col :span="2">
                        &nbsp;题，每题
                    </el-col>
                    <el-col :span="3">
                      <el-input-number v-model="an.minute"  :min="0" :controls="false" style="width: 100px;"  />
                    </el-col>
                    <el-col :span="1">
                      分
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="info" size="small" @click="itemList(3)" >看题</el-button>
                    </el-col>
                    <el-col :span="2">
                     <el-button  type="primary" size="small" @click="innerVisibles(3)" >选题</el-button>
                    </el-col>
                  </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>

        <!-- 内层选题页面 -->
        <el-dialog width="60%" :title="wtitle" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
          <el-form :model="query" ref="queryForm" :inline="true" label-width="68px" v-show="totalType">
            <el-form-item label="题库">
              <el-select v-model="query.prefaceId" placeholder="请选择题库" @change="handleChange(query.prefaceId)" >
                <el-option
                  v-for="dict in selectCategory"
                  :key="dict.id"
                  :label="dict.title"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="筛选试卷" prop="examinationId">
              <el-select v-model="query.examinationId" placeholder="请选择试卷ID" filterable clearable size="small">
                <el-option
                  v-for="dict in selectExaminations"
                  :key="dict.id"
                  :label="dict.title"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目标题" prop="title">
              <el-input
                v-model="query.title"
                placeholder="请输入题目标题"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuerync">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuerync">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table ref="multipleTablenc" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangenc" :row-key="(row) => row.id" class="tableclass">
              <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
              <el-table-column label="ID" width="60" prop="id" />
              <el-table-column prop="title" label="题目标题" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                   <div v-html="scope.row.title"></div>
                  </template>
              </el-table-column>
          </el-table>

          <pagination
              v-show="totalcn>0"
              :total="totalcn"
              :page.sync="query.pageNum"
              :limit.sync="query.pageSize"
              @pagination="getquery"
            />

          <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitFormSt">确 定</el-button>
             <el-button @click="cancelnc">取 消</el-button>
            </div>
        </el-dialog>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSpecification, getSpecification, delSpecification, addSpecification, updateSpecification, exportSpecification, testQuestions } from "@/api/exam/specification";
import draggable from 'vuedraggable';
import { selectCategory } from "@/api/exam/examination";
import { selectExamination } from "@/api/exam/questions";

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
      //内层总条数
      totalcn: 0,
      // 试题规则设立表格数据
      specificationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示选题内层弹出层
      innerVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        setQuestion: 1,
        createTime: undefined,
      },
      //内层查询参数
      query:{
        pageNum: 1,
        pageSize: 10,
        examinationId:undefined,
        title:undefined,
        type:undefined,
        prefaceId:undefined,
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
      form: {},
      //题库
      selectCategory:[],
      // 表单校验
      rules: {
        title: [
          { required: true, message: "规则名称不能为空", trigger: "blur" }
        ],
      },
      //试题类型排序参数
      topicSort:[],
      // 题目类型字典
      typeOptions: [],
      //试卷参数
      selectExaminations:[],
      //试题列表
      tableData: [],
      //内层多选框试题选中数据
      multipleSelection:[],
      //内层试题标题
      wtitle:undefined,
      //判断内层试题是否需要搜索
      totalType:false,
    };
  },
  created() {
    this.txpxcsh();
    this.getList();
    selectCategory().then(response => {
      this.selectCategory = response.data;
    });
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
    // 内层取消按钮
    cancelnc() {
      this.innerVisible = false;
      this.query.type = undefined;
      this.totalType = false;
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
        setQuestion: "1",
        setting: {},
      };
      this.an = {sum:0,};
      this.dan = {sum:0,};
      this.duo = {sum:0,};
      this.pan = {sum:0,};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 内层搜索按钮操作 */
    handleQuerync() {
      this.query.pageNum = 1;
      this.getquery();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 内层重置按钮操作 */
    resetQuerync() {
      this.query.title=undefined;
      this.query.examinationId=undefined;
      this.query.prefaceId=undefined;
      this.handleQuerync();
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
      this.title = "添加自定义选题";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSpecification(id).then(response => {
        this.form = response.data;
        this.typeOptions = JSON.parse(this.form.topicSort);
        const setting = JSON.parse(this.form.setting);
        this.dan = {sum:setting[0].sum,minute:setting[0].minute,query:setting[0].query};
        this.duo = {sum:setting[1].sum,minute:setting[1].minute,query:setting[1].query};
        this.pan = {sum:setting[2].sum,minute:setting[2].minute,query:setting[2].query};
        this.an  = {sum:setting[3].sum,minute:setting[3].minute,query:setting[3].query};
        this.open = true;
        this.title = "修改自定义选题";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if(this.dan.minute == undefined){
        this.msgError("请填写单选题分数");
        return false;
      }else if(this.duo.minute == undefined){
        this.msgError("请填写多选题分数");
        return false;
      }else if(this.pan.minute == undefined){
        this.msgError("请填写判断题分数");
        return false;
      }else if(this.an.minute == undefined){
        this.msgError("请填写案例题分数");
        return false;
      }
        if(
        (this.dan.query==undefined || this.dan.query.length==0)
         && (this.duo.query==undefined || this.duo.query.length==0)
         && (this.pan.query==undefined || this.pan.query.length==0)
         && (this.an.query==undefined || this.an.query.length==0)
         ){
          this.msgError("没有选择任何试题，无法提交");
          return false;
        }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.topicSort = JSON.stringify(this.typeOptions);
          this.form.setting = [];
          this.form.setting.push(this.dan);
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
    /** 筛选题库ID获取试卷 */
    handleChange(prefaceId){
      this.query.prefaceId = prefaceId;
        var zsd = {id:prefaceId};
        selectExamination(zsd).then(response => {
          this.selectExaminations = response.data;
        });
    },
    /** 内层弹窗查看已选试题 */
    itemList(value){
      this.totalType = false;
      this.innerVisible = true;
      this.query.type = value;
      if(this.multipleSelection != undefined && this.multipleSelection.length>0){
         this.$refs.multipleTablenc.clearSelection();
      }
      switch(value){
        case 0:this.wtitle = "已选判断题列表";this.multipleSelection = this.pan.query;
        break;
        case 1:this.wtitle = "已选单选题列表";this.multipleSelection = this.dan.query;
        break;
        case 2:this.wtitle = "已选多选题列表";this.multipleSelection = this.duo.query;
        break;
        case 3:this.wtitle = "已选案例题列表";this.multipleSelection = this.an.query;
        break;
      }
      this.tableData = this.multipleSelection;
      this.totalcn = 0;
      //必须要在$nextTick里面执行，否则toggleRowSelection无效
      if(this.multipleSelection != undefined && this.multipleSelection.length>0){
      this.$nextTick(function(){
        this.multipleSelection.forEach(row => {
          this.$refs.multipleTablenc.toggleRowSelection(row,true);
        })
      })
      }
    },
    /** 内层试题确定操作 */
    submitFormSt: function() {
      switch(this.query.type){
        case 0:this.pan.query = this.multipleSelection;this.pan.sum = this.multipleSelection?this.multipleSelection.length:0;
        break;
        case 1:this.dan.query = this.multipleSelection;this.dan.sum = this.multipleSelection?this.multipleSelection.length:0;
        break;
        case 2:this.duo.query = this.multipleSelection;this.duo.sum = this.multipleSelection?this.multipleSelection.length:0;
        break;
        case 3:this.an.query = this.multipleSelection;this.an.sum = this.multipleSelection?this.multipleSelection.length:0;
        break;
      }
      this.innerVisible = false;
      this.query.type = undefined;
    },
    /** 内层弹窗和获取选题事件 */
    innerVisibles(value){
      this.innerVisible = true;
      this.query.type = value;
      this.totalType = true;
      this.getquery();
      if(this.multipleSelection != undefined && this.multipleSelection.length>0){
         this.$refs.multipleTablenc.clearSelection();
      }
      switch(this.query.type){
        case 0:this.multipleSelection = this.pan.query;this.wtitle = "判断题列表";
        break;
        case 1:this.multipleSelection = this.dan.query;this.wtitle = "单选题列表";
        break;
        case 2:this.multipleSelection = this.duo.query;this.wtitle = "多选题列表";
        break;
        case 3:this.multipleSelection = this.an.query;this.wtitle = "案例题列表";
        break;
      }
      //必须要在$nextTick里面执行，否则toggleRowSelection无效
      if(this.multipleSelection != undefined && this.multipleSelection.length>0){
      this.$nextTick(function(){
        this.multipleSelection.forEach(row => {
          this.$refs.multipleTablenc.toggleRowSelection(row,true);
        })
      })
      }
    },
    //获取试题列表
    getquery(){
      testQuestions(this.query).then(response => {
          this.tableData = response.rows;
          this.totalcn = response.total;
        });
    },
    // 内层试题多选框选中数据
    handleSelectionChangenc(selection) {
      this.multipleSelection = selection;
    },
  }
};
</script>
<style>
  .tableclass  td{
    padding: 0!important;
  }
  .beizhu{
    line-height: 40px;
    color: red;
    opacity: 0.8;
  }
</style>
