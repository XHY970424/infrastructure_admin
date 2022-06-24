<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-position"
          size="mini"
          @click="handleBatchSync"
          v-hasPermi="['system:tenant:sync']"
        >同步所有
        </el-button>
      </el-col>

    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      border
    >
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        width="55"-->
<!--      >-->
<!--      </el-table-column>-->

      <el-table-column
        prop="dictLabel"
        label="资源名称"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column
        prop="dictValue"
        label="资源key"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSync(scope.row)"
            v-hasPermi="['system:tenant:sync']"
          >同步
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['system:tenant:remove']"-->
          <!--          >删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tenantSync } from '@/api/system/tenant'

export default {
  name: 'userListComponent',
  components: {},
  props: [
    'tenantId'
  ],
  data() {
    return {

      // 表单校验
      tableData: [],
      multipleSelection: []
    }
  },

  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      this.getDicts('tenant_resource').then(response => {
        this.tableData = response.data
      })
    },

    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection.map(item => item.dictValue)
    },
    /** 查询部门下拉树结构 */
    handleSync(row) {
      tenantSync(
        {
          tenantId: this.tenantId,
          resource: [row.dictValue]
        }
      ).then(response => {
        if (response.code === 200) {
          this.msgSuccess('同步成功')
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    handleBatchSync() {
      tenantSync(
        {
          tenantId: this.tenantId,
          resource: this.multipleSelection
        }
      ).then(response => {
        if (response.code === 200) {
          this.msgSuccess('同步成功')
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      })
    }
  }
}
</script>
