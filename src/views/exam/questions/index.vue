<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="题目标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入题目标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试题分类" prop="prefaceId" v-if="(Object.keys(this.dataParams).length<3) && !problemId">
        <el-select v-model="queryParams.prefaceId" placeholder="请选择题库" filterable clearable size="small"
                   @change="handleChange(1)">
          <el-option
            v-for="dict in selectCategory"
            :key="dict.id"
            :label="dict.title"
            :value="dict.id"
          ></el-option>
        </el-select>
        <el-select v-model="queryParams.examinationId" placeholder="请选择章节" filterable clearable size="small"
                   @change="handleChange(4)">
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
      <el-form-item label="题目类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择题目类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
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
          v-hasPermi="['exam:questions:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['exam:questions:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['exam:questions:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['exam:questions:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="questionsList" @selection-change="handleSelectionChange" border>

      <el-table-column :label="biaoti">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column type="text" label="排序" width="120" align="center">
          <template slot-scope="scope">
            <el-input-number size="medium" :min="0" :precision="0" controls-position="right" class="numbersz"
                             v-model="scope.row.sort" @change="gxpx(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="主键ID" align="center" prop="id" width="80"/>
        <el-table-column label="题目标题" align="center" prop="title" mim-width="650px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleUpdate(scope.row)" v-hasPermi="['exam:questions:edit']"
                       v-html="scope.row.title"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="题目类型" align="center" prop="type" :formatter="typeFormat"/>
        <el-table-column label="答案" align="center" prop="answer"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['exam:questions:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['exam:questions:remove']"
            >删除
            </el-button>
          </template>
        </el-table-column>

      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改试题管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1180px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12" v-if="!problemId && (Object.keys(this.dataParams).length<3)">
            <el-row>
              <el-col :span="10">
                <el-form-item label="试题分类">
                  <el-select v-model="form.prefaceId" placeholder="请选择题库" @change="handleChange(2)" filterable>
                    <el-option
                      v-for="dict in selectCategory"
                      :key="dict.id"
                      :label="dict.title"
                      :value="dict.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-select v-model="updExaminationId" placeholder="请选择章节" filterable @change="handleChange(3)">
                  <el-option
                    v-for="dict in selectExamination"
                    :key="dict.id"
                    :label="dict.title"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-select v-model="updPid" placeholder="请选择小节" filterable>
                  <el-option
                    v-for="dict in selectPid"
                    :key="dict.id"
                    :label="dict.title"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题目类型">
              <el-select v-model="form.type" placeholder="请选择试题类型" @change="pdtlx">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排序" prop="sort">
              <el-input-number :min="0" :precision="0" v-model="form.sort"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="题目标题" prop="title">
              <!-- <Editor id="title" v-model="form.title" class="fwbbj"  /> -->
              <EditorTow id="title" v-if="open" v-model="form.title" class="fwbbj"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选项数量" prop="questionNumber">
              <el-select v-model="form.questionNumber" placeholder="请选择选项数量">
                <el-option
                  v-for="dict in questionNumberxl"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="参考答案" prop="answer" v-if="form.type==0">
              <el-radio v-model="form.answer" label="A">A</el-radio>
              <el-radio v-model="form.answer" label="B">B</el-radio>
            </el-form-item>
            <el-form-item label="参考答案" prop="answer" v-if="form.type==1">
              <el-radio v-model="form.answer" label="A">A</el-radio>
              <el-radio v-model="form.answer" label="B">B</el-radio>
              <el-radio v-model="form.answer" label="C">C</el-radio>
              <el-radio v-model="form.answer" label="D">D</el-radio>
              <el-radio v-model="form.answer" label="E">E</el-radio>
              <el-radio v-model="form.answer" label="F">F</el-radio>
              <el-radio v-model="form.answer" label="G">G</el-radio>
              <el-radio v-model="form.answer" label="H">H</el-radio>
            </el-form-item>
            <el-form-item label="参考答案" prop="answer" v-if="form.type==2">
              <el-checkbox-group v-model="answer">
                <el-checkbox label="A"></el-checkbox>
                <el-checkbox label="B"></el-checkbox>
                <el-checkbox label="C"></el-checkbox>
                <el-checkbox label="D"></el-checkbox>
                <el-checkbox label="E"></el-checkbox>
                <el-checkbox label="F"></el-checkbox>
                <el-checkbox label="G"></el-checkbox>
                <el-checkbox label="H"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选项" prop="questionSelect">
              <!-- <Editor id="questionSelect" v-model="form.questionSelect" class="fwbbj" /> -->
              <EditorTow id="questionSelect" v-if="open" v-model="form.questionSelect" class="fwbbj"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="解析" prop="analysis">
              <!-- <Editor id="analysis" v-model="form.analysis" class="fwbbj"  /> -->
              <EditorTow id="analysis" v-if="open" v-model="form.analysis" class="fwbbj"/>
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
  import {
    addQuestions,
    delQuestions,
    exportQuestions,
    getQuestions,
    listQuestions,
    selectExamination,
    updateQuestions
  } from '@/api/exam/questions'
  import { selectCategory } from '@/api/exam/examination'
  import Editor from '@/components/Editor'
  import EditorTow from '@/components/Tinymce'

  export default {
    name: 'Questions',
    components: { Editor, EditorTow },
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
        // 试题管理表格数据
        questionsList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 题目类型字典
        typeOptions: [],
        //试卷ID判定是否是试卷跳转过来的
        examinationId: undefined,
        //案例ID判定是否是案例跳转过来的
        problemId: undefined,
        //答案默认参数
        answer: [],
        //题库下拉参数
        selectCategory: undefined,
        //筛选试卷下拉
        selectExaminations: undefined,
        //添加修改章节下拉
        selectExamination: undefined,
        //筛选小节下拉
        selectPids: undefined,
        //添加修改小节下拉
        selectPid: undefined,
        //跳转参数
        dataParams: undefined,
        //选项下拉
        questionNumberxl: [{
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '5',
          label: '5'
        }, {
          value: '6',
          label: '6'
        }, {
          value: '7',
          label: '7'
        }, {
          value: '8',
          label: '8'
        }],
        biaoti: '题库试题',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          prefaceId: undefined,
          examinationId: undefined,
          type: undefined,
          title: undefined,
          problemId: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          prefaceId: [
            { required: true, message: '题库不能为空', trigger: 'change' }
          ],
          examinationId: [
            { required: true, message: '试卷ID不能为空', trigger: 'change' }
          ],
          type: [
            { required: true, message: '题目类型不能为空', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '题目标题不能为空', trigger: 'blur' }
          ],
          questionSelect: [
            { required: true, message: '选项不能为空', trigger: 'blur' }
          ],
          questionNumber: [
            { required: true, message: '选项不能为空', trigger: 'blur' }
          ],
          answer: [
            { required: true, message: '答案不能为空', trigger: 'blur' }
          ]
        },
        //存储变量值(this.from.prefaceId、this.from.examinationId)
        updPrefaceId: undefined,
        updExaminationId: undefined,
        updPid: undefined
      }
    },
    created() {
      this.getDicts('question_types').then(response => {
        this.typeOptions = response.data
      })
      selectCategory().then(response => {
        this.selectCategory = response.data
      })
      this.problemId = this.$route.params && this.$route.params.problemId
      this.dataParams = this.$route.params
      if (Object.keys(this.dataParams).length >= 3) {
        this.queryParams.prefaceId = parseInt(this.$route.params.prefaceId)
        this.handleChange(1)
        this.queryParams.examinationId = parseInt(this.$route.params.pid)
        this.handleChange(4)
        this.queryParams.examinationPid = parseInt(this.$route.params.examinationPid)
        if (this.$route.params.btitle && this.$route.params.title && this.$route.params.atitle) {
          this.biaoti = this.$route.params.btitle + ' / ' + this.$route.params.title + ' / ' + this.$route.params.atitle + ' 题库试题'
        }
      } else if (this.problemId) {
        this.queryParams.problemId = this.problemId
      }
      this.getList()
    },
    methods: {
      /** 查询试题管理列表 */
      getList() {
        this.loading = true
        listQuestions(this.queryParams).then(response => {
          this.questionsList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 题目类型字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.type)
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
          prefaceId: undefined,
          examinationId: undefined,
          type: '1',
          title: undefined,
          questionSelect: undefined,
          questionNumber: 4,
          answer: undefined,
          analysis: undefined,
          sort: undefined,
          caseId: undefined
        }
        this.selectExamination = undefined
        this.resetForm('form')
        this.updPrefaceId = undefined
        this.updExaminationId = undefined
        this.updPid = undefined
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
      //更新排序
      gxpx(data) {
        updateQuestions(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加试题管理'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getQuestions(id).then(response => {
          this.form = response.data
          if (this.form.type == 2) {
            this.answer = this.form.answer.split('')
          }
          this.updPrefaceId = this.form.prefaceId
          this.updExaminationId = this.form.examinationId
          this.updPid = this.form.examinationPid
          this.handleChange(2)
          this.handleChange(3)
          this.open = true
          this.title = '修改试题管理'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        if (this.form.type == 2) {
          this.form.answer = this.answer.join('')
        }
        if (Object.keys(this.dataParams).length >= 3) {
          this.form.prefaceId = this.dataParams.prefaceId
          this.updExaminationId = this.dataParams.pid
          this.updPid = this.dataParams.examinationPid
        }
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (!this.problemId && (this.updExaminationId == undefined || this.form.prefaceId == undefined || this.updPid == undefined)) {
              this.msgError('请完善试题分类')
              return false
            } else {
              this.form.problemId = this.problemId
            }

            //赋值
            this.form.examinationId = this.updExaminationId
            this.form.examinationPid = this.updPid
            if (this.form.id != undefined) {
              updateQuestions(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addQuestions(this.form).then(response => {
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
        this.$confirm('是否确认删除试题管理编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delQuestions(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有试题管理数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportQuestions(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      },
      /** 筛选题库ID获取下属试卷 */
      handleChange(id) {
        if (id == 1) {
          var zsd = { id: this.queryParams.prefaceId }
          selectExamination(zsd).then(response => {
            this.selectExaminations = response.data
          })
        } else if (id == 2) {
          var zsd = { id: this.form.prefaceId }
          selectExamination(zsd).then(response => {
            this.selectExamination = response.data
            if (this.form.prefaceId != this.updPrefaceId) this.updExaminationId = undefined
            if (this.form.prefaceId == this.updPrefaceId) this.updExaminationId = this.form.examinationId
            if (this.form.examinationId != this.updExaminationId) this.updPid = undefined
            if (this.form.examinationId == this.updExaminationId) this.updPid = this.form.examinationPid
          })
        } else if (id == 3) {
          var zsd = { pid: this.updExaminationId }
          selectExamination(zsd).then(response => {
            this.selectPid = response.data
            if (this.form.examinationId != this.updExaminationId) this.updPid = undefined
            if (this.form.examinationId == this.updExaminationId) this.updPid = this.form.examinationPid
          })
        } else if (id == 4) {
          var zsd = { pid: this.queryParams.examinationId }
          selectExamination(zsd).then(response => {
            this.selectPids = response.data
          })
        }
      },
      pdtlx() {
        this.form.questionSelect = '';
        this.form.answer = undefined;
        if (this.form.type == 0) {
          this.form.questionSelect = "<p>A.对</p><p>B.错</p>";
          this.form.questionNumber = 2
        } else if (this.form.type == 1) {
          this.form.questionNumber = 4
        }else if(this.form.type == 2){
          this.answer = [];
        }
      },
      //富文本标题转标题
      formatter(row, column) {
        return this.ToText(row.title)
      },
      /** 富文本转纯文本 */
      ToText(HTML) {
        var input = HTML
        return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
      }
    }
  }
</script>
<style>
  .fwbbj {
    margin-bottom: 50px;
  }

  .numbersz {
    width: 50px;
  }

  .numbersz span {
    display: none;
  }

  .numbersz input {
    padding: 0 5px !important;
    text-align: center;
  }
</style>
