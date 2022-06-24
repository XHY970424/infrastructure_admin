<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="operationList" @selection-change="handleSelectionChange" border>
      <el-table-column label="操作类型" align="center" prop="type">
        <template slot-scope="scope">
          <span v-show="scope.row.type == 0">开通会员</span>
          <span v-show="scope.row.type == 1">停用会员</span>
          <span v-show="scope.row.type == 2">开通课程专题</span>
          <span v-show="scope.row.type == 4">升级会员</span>
        </template>
      </el-table-column>
      <el-table-column label="开通人数" align="center" prop="number"/>
      <el-table-column label="开通价格" align="center" prop="price"/>
      <el-table-column label="操作人名称" align="center" prop="operationUserName"/>
      <el-table-column label="开通时间" align="center" prop="createTime"/>
      <el-table-column label="开通描述" align="center" prop="remark"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click="detail(scope.row)"
                     v-hasPermi="['offline:operation:query']">详情
          </el-button>
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

    <!-- 开通详情弹框 -->
    <el-dialog :close-on-click-modal="false" title="开通详情" :visible.sync="operationOpen" width="1000px" append-to-body>
      <div class="operation">开通人数: <span>{{operation.number}}人</span></div>
      <div class="operation">开通类型:
        <span v-show="operation.type==0">开通会员</span>
        <span v-show="operation.type==4">升级会员</span>
        <span v-show="operation.type==2">开通课程和专题</span>
      </div>
      <div class="operation">开通总价格: <span>{{operation.price}}元</span></div>
      <el-table :data="operation.dataList" border v-show="operation.type==0 || operation.type==4">
        <el-table-column label="开通人" align="center" prop="userName"/>
        <el-table-column label="期限" align="center" prop="deadline"/>
        <el-table-column label="价格" align="center" prop="price"/>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <span v-show="scope.row.type == 0">开通会员</span>
            <span v-show="scope.row.type == 4">升级会员</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="operation.dataList" border v-show="operation.type==2">
        <el-table-column label="开通人" align="center" prop="userName"/>
        <el-table-column label="课程/专题名称" align="center" prop="title"/>
        <el-table-column label="价格" align="center" prop="price"/>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            <span v-show="scope.row.type == 2">开通课程</span>
            <span v-show="scope.row.type == 3">开通专题</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="operationOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addOperation,
    delOperation,
    exportOperation,
    getOperation,
    listOperation,
    updateOperation
  } from '@/api/offline/operation'
  import Template from '../../certificate/template/index'

  export default {
    name: 'Operation',
    components: { Template },
    data() {
      return {
        operationOpen: false,
        operation: {},
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
        // 线下激活开通记录表格数据
        operationList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: 2
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          operationUserId: [
            { required: true, message: '操作人id不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '开通价格不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '操作类型0-开通会员 1-停用会员  2-开通课程和专题不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询开通详情 */
      detail(item) {
        getOperation(item.operationId).then(res => {
          this.operation.dataList = res.data
          this.operation.price = item.price
          this.operation.number = item.number
          this.operation.type = item.type
          this.operationOpen = true
        })
      },
      /** 查询线下激活开通记录列表 */
      getList() {
        this.loading = true
        listOperation(this.queryParams).then(response => {
          this.operationList = response.rows
          this.total = response.total
          this.loading = false
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
          operationId: undefined,
          operationUserId: undefined,
          price: undefined,
          remark: undefined,
          type: undefined,
          createTime: undefined
        }
        this.resetForm('form')
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
        this.ids = selection.map(item => item.operationId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加线下激活开通记录'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const operationId = row.operationId || this.ids
        getOperation(operationId).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改线下激活开通记录'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.operationId != undefined) {
              updateOperation(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addOperation(this.form).then(response => {
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
        const operationIds = row.operationId || this.ids
        this.$confirm('是否确认删除线下激活开通记录编号为"' + operationIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delOperation(operationIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有线下激活开通记录数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportOperation(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
<style scoped>
  .operation {
    font-size: 16px;
    padding-bottom: 16px;
  }

  .operation span {
    font-size: 16px;
    display: inline-block;
    height: 18px;
    padding-left: 16px;
  }
</style>
