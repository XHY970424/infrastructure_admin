<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.style" @tab-click="handleClick">
      <el-tab-pane label="顶部导航" name="0"/>
      <el-tab-pane label="底部导航" name="1"/>
    </el-tabs>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="菜单名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入链接地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="链接类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择链接类型" clearable size="small">
          <el-option label="路由" value="0"/>
          <el-option label="外链" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="系统内置" prop="systemFlag">
        <el-select
          v-model="queryParams.systemFlag"
          placeholder="请输入系统内置"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        >
          <el-option label="自定义" value="0"/>
          <el-option label="系统内置" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="停用" value="0"/>
          <el-option label="启用" value="1"/>
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
          v-hasPermi="['cms:topNav:add']"
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
          v-hasPermi="['cms:topNav:edit']"
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
          v-hasPermi="['cms:topNav:remove']"
        >删除
        </el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="topNavList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="indexTopNavId"/>
      <el-table-column label="菜单名称" align="center" prop="title"/>
      <el-table-column label="链接地址" align="center" prop="url"/>
      <el-table-column label="链接类型" align="center" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 0 ? '路由' : '外链' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统内置" align="center" prop="systemFlag">
        <template slot-scope="scope">
          <span>{{ scope.row.systemFlag == 0 ? '自定义' : '系统内置' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 0 ? '停用' : '启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.style == 0 && scope.row.url != '/'" @click="toBanner(scope.row)" type="text" icon="el-icon-s-order" v-hasPermi="['cms:navbanner:list']">
              轮播图管理
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.status == 0"
            @click="updateStatus(scope.row.indexTopNavId, 1)"
            v-hasPermi="['cms:topNav:edit']"
          >启用
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-else
            @click="updateStatus(scope.row.indexTopNavId, 0)"
            v-hasPermi="['cms:topNav:edit']"
          >停用
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:topNav:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:topNav:remove']"
          >删除
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

    <!-- 添加或修改顶部导航菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接地址"/>
        </el-form-item>
        <el-form-item label="链接类型">
          <el-select v-model="form.type" placeholder="请选择链接类型">
            <el-option label="路由" :value="0"/>
            <el-option label="外链" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
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
import {
  listTopNav,
  getTopNav,
  delTopNav,
  addTopNav,
  updateTopNav,
  exportTopNav,
  updateTopNavStatus
} from '@/api/cms/topNav'
import Template from '@/views/certificate/template'

export default {
  name: 'TopNav',
  components: { Template },
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
      // 顶部导航菜单表格数据
      topNavList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        url: undefined,
        style : '0',
        type: undefined,
        systemFlag: undefined,
        status: undefined,
        sort: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          { trigger: 'blur', max: 36, message: '内容过长' }
        ],
        url: [
          { required: true, message: '链接地址不能为空', trigger: 'blur' },
          { trigger: 'blur', max: 255, message: '内容过长' }
        ],
        type: [
          { required: true, message: '链接类型不能为空', trigger: 'blur' }
        ],
        systemFlag: [
          { required: true, message: '系统内置不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 跳转到轮播图管理
    toBanner(row){
      let queryData = {}
      queryData.indexTopNavId = row.indexTopNavId;
      this.$router.push({
        path: '/cms/navbanner',
        query: queryData
      })
    },
    handleClick(tab, event) {
      this.queryParams.style = tab.name
      this.handleQuery()
    },
    /** 查询顶部导航菜单列表 */
    getList() {
      this.loading = true
      listTopNav(this.queryParams).then(response => {
        this.topNavList = response.rows
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
        indexTopNavId: undefined,
        title: undefined,
        url: undefined,
        type: 0,
        systemFlag: undefined,
        status: 0,
        style : this.queryParams.style,
        sort: 100,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
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
      this.ids = selection.map(item => item.indexTopNavId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加顶部导航菜单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const indexTopNavId = row.indexTopNavId || this.ids
      getTopNav(indexTopNavId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改顶部导航菜单'
      })
    },
    /** 提交按钮 */
    updateStatus(id, status) {
      updateTopNavStatus({
        indexTopNavId: id,
        status
      }).then(response => {
        if (response.code === 200) {
          this.msgSuccess('修改成功')
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.indexTopNavId != undefined) {
            updateTopNav(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addTopNav(this.form).then(response => {
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
      const indexTopNavIds = row.indexTopNavId || this.ids
      this.$confirm('是否确认删除顶部导航菜单编号为"' + indexTopNavIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delTopNav(indexTopNavIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有顶部导航菜单数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportTopNav(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {
      })
    }
  }
}
</script>
