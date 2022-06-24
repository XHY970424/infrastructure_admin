<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="" prop="testPaperName">
        <el-input
          v-model="queryParams.testPaperName"
          placeholder="请输入试卷分类名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eycode:paperClassification:add']"
        >新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-table border
              v-loading="loading"
              :data="testPaperList"
              :row-class-name="tableRowClassName"
              row-key="id"
              default-expand-all

              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="试卷分类名" align="center" prop="testPaperName" width="300px"/>
      <el-table-column label="排序" align="center" prop="sort"/>
      <el-table-column label="是否显示" prop="status" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.status == 1">显示</span>
          <span v-show="scope.row.status == 0">不显示</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:paperClassification:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:paperClassification:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改专题分类 对话框 -->
    <paperClassification @cancelCourseCategory="open=false" @getList="getList" :categoryTitle="title" :categoryOpen="open"
                    :dataForm="form"
                    v-if="open"></paperClassification>
<!--    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false" append-to-body>-->
<!--      <el-form ref="form" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="上级分类" prop="pid">-->
<!--          <treeselect v-model="form.pid" :options="categoryOptions" :normalizer="normalizer" placeholder="请选择父ID"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="分类名" prop="testPaperName">-->
<!--          <el-input v-model="form.testPaperName" placeholder="请输入试卷分类名"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="显示排序" prop="sort">-->
<!--          <el-input-number v-model="form.sort" :max="100" controls-position="right" :min="0"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="是否上架">-->
<!--          <el-radio-group v-model="form.status">-->
<!--            <el-radio :label="1">显示</el-radio>-->
<!--            <el-radio :label="0">不显示</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
  import {
    addPaperClassification,
    delPaperClassification,
    getPaperClassification,
    listPaperClassification,
    updatePaperClassification
  } from '@/api/exam/testPaper'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import paperClassification from '@/components/paperClassification'

  export default {
    // name: 'paperClassification',
    components: { Treeselect,paperClassification },
    data() {
      return {
        //是否上架数据字典
        isPutwayOptions: [],
        // 遮罩层
        loading: true,
        // 试卷分类 表格数据
        testPaperList: [],
        // 专题分类 树选项
        categoryOptions: [],
        testPaperName: undefined,
        // 弹出层标题
        title: '',
        // 截图比例
        rate: '16:9',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pid: undefined,
          testPaperName: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          pid: [
            { required: true, message: '父ID不能为空', trigger: 'blur' }
          ],
          testPaperName: [
            { required: true, message: '试卷分类名不能为空', trigger: 'blur' }
          ]
        }
      }
    },

    watch: {
      // 根据名称筛选部门树
      testPaperName(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.getList()
      // this.getDicts("is_status").then(response => {
      //   this.isPutwayOptions = response.data;
      // });

    },
    methods: {
      // 字典状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.isPutwayOptions, row.status)
      },
      /** 查询专题分类 列表 */
      getList() {
        this.loading = true
        listPaperClassification(this.queryParams).then(response => {
          this.testPaperList = this.handleTree(response.rows, 'id', 'pid')
          this.loading = false
        })
      },
      /** 转换专题分类 数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.id,
          label: node.testPaperName,
          children: node.children
        }
      },
      /** 查询专题下拉树结构 */
      getTreeselect() {
        listPaperClassification().then(response => {
          this.categoryOptions = []
          const data = { id: 0, testPaperName: '顶级节点', children: [] }
          data.children = this.handleTree(response.data, 'id', 'pid')
          this.categoryOptions.push(data)
        })
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
          pid: undefined,
          testPaperName: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          status: 0,
          sort: 0
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        // this.getTreeselect()
        this.open = true
        this.title = '添加试卷分类 '
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        // this.getTreeselect()
        if (row != undefined) {
          this.form.pid = row.id
        }

        getPaperClassification(row.id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改试卷分类 '
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updatePaperClassification(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addPaperClassification(this.form).then(response => {
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

      tableRowClassName({ row, rowIndex }) {
        if (row.pid === 10000) {
          return 'warning-row'
        } else if (row.pid === 0) {
          return 'alert-row'
        } else if (row.pid !== 10000) {
          /* return 'success-row';*/
          return ''
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除专题分类 编号为"' + row.id + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delPaperClassification(row.id)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      }
    }
  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .alert-row {
    background: lavender;
  }
</style>
