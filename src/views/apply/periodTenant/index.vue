<template>
  <div class="app-container">
    <el-form ref="form" label-width="90px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="当前项目：">{{ projectName }}</el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="当前课题：">{{
            topicName
            }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      @submit.native.prevent
    >
      <el-form-item label="期次名称" prop="periodName">
        <el-input
          v-model="queryParams.periodName"
          placeholder="请输入期次名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置
        </el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="periodList"
      border
    >
      <el-table-column label="期次名称" align="center" prop="periodName"/>
      <el-table-column label="计划开始时间" align="center" prop="startTime">
        <template slot-scope="scope">
          <span>{{ formatTime(Number(scope.row.startTime)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center" prop="endTime">
        <template slot-scope="scope">
          <span>{{ formatTime(Number(scope.row.endTime)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100" :formatter="statusFormatter"/>
      <el-table-column label="报名企业数" align="center" prop="companyNum"/>
      <el-table-column label="预报名人数" align="center" prop="applyNum"/>
      <el-table-column label="报名成功人数" align="center" prop="passNum"/>
      <el-table-column label="下放证书人数" align="center" prop="certificateNum"/>
      <el-table-column label="下放补贴/完训结算人数" align="center" prop="subsidyNum"/>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            v-if="new Date().getTime() > scope.row.startTime"
            @click="goUserInfo(scope.row)"
          >人员管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import { tenantList } from '@/api/apply/schedulePeriod'

  export default {
    name: 'PeriodTenant',
    data() {
      return {
        total: 0,
        periodList: [],
        loading: true,
        projectName: undefined,
        topicName: undefined,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          periodName: undefined,
          topicId: undefined,
          history:undefined
        }
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal) {
          if (
            this.$route.query &&
            this.$route.query.topicName &&
            this.$route.query.topicId &&
            this.$route.query.projectName
          ) {
            this.projectName = this.$route.query && this.$route.query.projectName
            this.topicName = this.$route.query && this.$route.query.topicName
            this.queryParams.topicId = this.$route.query && this.$route.query.topicId
            console.log(this.$route.query)
            this.getList()
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      this.projectName = this.$route.query && this.$route.query.projectName
      this.topicName = this.$route.query && this.$route.query.topicName
      this.queryParams.topicId = this.$route.query && this.$route.query.topicId
      this.getList()
    },
    methods: {
      /** 跳转人员管理 */
      goUserInfo(row) {
        let projectName = this.projectName
        let topicName = this.topicName
        let periodName = row.periodName
        let periodId = row.periodId
        let topicId = this.queryParams.topicId
        this.$router.push({
          path: '/train/userInfo',
          query: { projectName, periodId, topicName, periodName, topicId }
        })
      },
      /** 状态判断 */
      statusFormatter(row, column) {
        if (row.status == 0) {
          return '已停用'
        }
        let date = new Date().getTime()
        if (date > row.startTime && date < row.endTime) {
          return '进行中'
        } else if (date < row.startTime) {
          return '未开始'
        } else if (date > row.endTime) {
          return '已结束'
        }
      },
      /** 查询报名期次列表 */
      getList() {
        this.loading = true
        tenantList(this.queryParams).then((response) => {
          this.periodList = response.rows
          this.total = response.total
          this.loading = false
        })
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
      }
    }
  }
</script>

<style scoped>

</style>
