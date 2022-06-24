<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="是否测试" prop="isExercises">
        <el-select v-model="queryParams.isExercises" placeholder="请选择是否测试" clearable size="small">
          <el-option
            v-for="dict in isExercisesOptions"
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
          v-hasPermi="['course:chapter:add']"
          v-show="courseStatus==2"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['course:chapter:remove']"
          v-show="courseStatus==2"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['course:chapter:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <span style="color: red;font-size: 12px;position: relative;top: 5px">（提醒：课程发布上线后，章节顺序和章节试卷都不可修改）</span>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="chapterList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" width="80" align="center" prop="id" /><el-table-column type="number" label="排序"  width="95" align="center" >
      <template slot-scope="scope">
        <el-input :min="0" type="number" v-model="scope.row.sort" @change="updateSort(scope.row)" :disabled="courseStatus!=2"/>
      </template>
      </el-table-column>
      <el-table-column label="课程主题" align="center" prop="subjectTitle" />
      <el-table-column label="章节标题" align="center" prop="title" />
      <el-table-column label="章节介绍" align="center" prop="detail" :show-overflow-tooltip="true" />
      <el-table-column label="是否测试" align="center" prop="isExercises" :formatter="isExercisesFormat" />
      <!-- <el-table-column label="是否上架" align="center" prop="status" :formatter="statusFormat" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-order">
            <router-link :to="'/courseSection/section/'+scope.row.id" class="link-type">
              <span>小节</span>
            </router-link>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['course:chapter:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['course:chapter:remove']"
            v-show="courseStatus==2"
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

    <!-- 添加或修改课程大章对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="章节名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入课程名称" maxlength="20" show-word-limit />
        </el-form-item>

        <el-form-item label="章节介绍" prop="detail">
          <el-input v-model="form.detail" type="textarea" placeholder="请输入内容"  maxlength="200" show-word-limit class="textareaclass"  />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number :min="0"  v-model="form.sort" placeholder="请输入排序" :disabled="courseStatus!=2"/>
        </el-form-item>
        <el-form-item label="是否测试">
          <el-radio-group v-model="form.isExercises" :disabled="courseStatus!=2">
            <el-radio
              v-for="dict in isExercisesOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>



          <!-- <transition name="el-zoom-in-top">
              <el-form-item label="试题规则" v-show="form.isExercises==1" prop="specificationId">
                <el-select v-model="form.specificationId" filterable clearable placeholder="请选择试题测试" style="width: 100%;">

                  <el-option-group
                      v-for="group in specifications"
                      :key="group.label"
                      :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
          </transition> -->

        <!-- <el-form-item label="是否上架">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-col v-show="form.isExercises==1" >
          <el-form-item label="测试试卷">
            <div v-for="(item, index) in paperInfo" style="margin-bottom: 10px;">
              <el-select v-model="item.paperId" clearable filterable :disabled="courseStatus!=2 || paperDisabled">

                <el-option
                  v-for="item in paperOptions"
                  :key="item.id"
                  :label="item.examName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <!-- <el-input-number v-model="item.sort" :min="0" :max="10000"/> -->
              <!-- <el-button type="danger" @click="deleteElement(item,index)">-</el-button> -->
            </div>
            <!-- <el-button type="primary" @click="addElement">+</el-button> -->
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listChapter, getChapter, delChapter, addChapter, updateChapter, exportChapter, getPreface } from "@/api/course/chapter";
import { specification } from "@/api/course/subject";

export default {
  name: "Chapter",
  data() {
    return {
      paperDisabled: false,
      courseStatus:2,
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
      // 课程大章表格数据
      chapterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否测试(0否1是)字典
      isExercisesOptions: [],
      //试题规则
      specifications: [],
      // 是否上架字典
      statusOptions: [],
      //接收页面课程主题ID
      subjectId:undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        detail: undefined,
        sort: undefined,
        isExercises: undefined,
        status: undefined,
        subjectId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{
          required: true,
          message: "请填写章节名称",
          trigger: "blur"
        }],
        sort: [{
          required: true,
          message: "请填写排序",
          trigger: "blur"
        }],
      },
      // 多选试卷数据
      paperInfo: [{
        paperId: undefined,
        sort: 100,
      }],
      // 试卷选项数据
      paperOptions: [],
    };
  },
  created() {
    this.subjectId = this.$route.params && this.$route.params.subjectId;
    if(this.subjectId){
      this.queryParams.subjectId = this.subjectId;
    }
    this.getList();
    this.getDicts("subject_test").then(response => {
      this.isExercisesOptions = response.data;
    });
    this.getDicts("putway_status").then(response => {
      this.statusOptions = response.data;
    });
    //试题规则列表
    specification().then(response => {
      this.specifications = response.data;
    });
    // 获取试卷选项
    this.getPapers();
  },
  methods: {
    // 删除一个试卷组
    deleteElement(item,index){
    		if(this.paperInfo.length<=1){//如果只有一个输入框则不可以删除
    		return false
    	}
    	this.paperInfo.splice(index,1)//删除了数组中对应的数据也就将这个位置的输入框删除
    },
    // 添加一个试卷组
    addElement(item){
    	this.paperInfo.push({
    		paperId: undefined,
    		sort: 100,
    	})
    },
    //更新排序
    updateSort(data){
      updateChapter(data).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    // 获取试卷选项
    getPapers(){
      getPreface(this.subjectId).then(res => {
        if (res.code == 200){
          this.paperOptions = res.data
        }else{
          this.msgError(res.msg)
        }
      })
    },
    /** 查询课程大章列表  */
    getList() {
      this.loading = true;
      listChapter(this.queryParams).then(response => {
        this.chapterList = response.rows;
        this.total = response.total;
        if(this.total > 0){
          this.courseStatus = response.rows[0].courseStatus;
        }
        this.loading = false;
      });
    },
    // 是否测试(0否1是)字典翻译
    isExercisesFormat(row, column) {
      return this.selectDictLabel(this.isExercisesOptions, row.isExercises);
    },
    // 是否上架字典翻译
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
        title: undefined,
        detail: undefined,
        sort: undefined,
        isExercises: "0",
        specificationId:undefined,
        status: "0",
        subjectId: this.subjectId,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
      };
      this.resetForm("form");
      this.paperInfo = [{
        paperId: undefined,
        sort: 100,
      }]
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
      this.paperDisabled = false
      this.title = "添加课程章节";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChapter(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改课程章节";
        if (response.data.papersVos.length > 0){
          this.paperInfo = response.data.papersVos
          if (response.data.papersVos != undefined && response.data.papersVos.length > 0){
            this.paperDisabled = true
          }else{
            this.paperDisabled = false
          }
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 处理试卷数据
          this.form.papersVos = this.paperInfo
          if (this.form.isExercises == "1"){
            if(!this.paperInfo[0].paperId){
              this.msgError("请选择试卷!");
              return
            }
          }
          if (this.form.id != undefined) {
            updateChapter(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addChapter(this.form).then(response => {
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
      this.$confirm('是否确认删除课程大章编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delChapter(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有课程大章数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportChapter(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
