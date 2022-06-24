<template>
  <div>
    <el-tabs v-model="tab" type="border-card" class="tab">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.id">
        <span slot="label"
        ><i class="el-icon-menu"></i> {{ item.name }}</span
        >
      </el-tab-pane>
    </el-tabs>
    <div v-show="tab == 0" v-hasPermi="['apply:currentDistributor:list']">
      <el-table :data="currentAccountList" border style="margin-left: 10px;width: 99%;margin-top: 10px">
        <el-table-column label="分销商" align="center" prop="distributorName"/>
        <el-table-column label="用户" align="center" prop="nickName"/>
        <el-table-column label="手机号" align="center" prop="phonenumber"/>
        <el-table-column label="分销结算总金额" align="center" prop="currentMoney">
          <template slot-scope="scope">
            <span>{{scope.row.currentMoney+'元'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已结算金额" align="center" prop="settlementMoney">
          <template slot-scope="scope">
            <span>{{scope.row.settlementMoney == null ? 0+'元' : scope.row.settlementMoney+'元'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="待结算金额" align="center" prop="currentMoney">
          <template slot-scope="scope">
            <span>{{scope.row.settlementMoney == null ? scope.row.currentMoney+'元' : parseFloat(scope.row.currentMoney-scope.row.settlementMoney).toFixed(2)+'元'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后结算时间" align="center" prop="lastExtractTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.lastExtractTime ? parseTime(scope.row.lastExtractTime) : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成功结算次数" align="center" prop="extractNum"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="getCurrentDetailList"
              v-hasPermi="['apply:currentDistributor:detail']"
            >分销详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="getSettlementLogList(scope.row.accountId)"
              v-hasPermi="['apply:currentDistributor:settlementLog']"
            >结算记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="tab == 1" v-hasPermi="['apply:lowerDistributor:list']">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" @submit.native.prevent
               style="margin-top: 10px">
        <el-form-item label="分销商" prop="distributorName">
          <el-input
            v-model="queryParams.distributorName"
            placeholder="请输入分销商名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="lowerAccountList" border style="margin-left: 10px;width: 99%">
        <el-table-column label="分销商" align="center" prop="distributorName"/>
        <el-table-column label="用户" align="center" prop="nickName"/>
        <el-table-column label="手机号" align="center" prop="phonenumber"/>
        <el-table-column label="分销结算总金额" align="center" prop="currentMoney">
          <template slot-scope="scope">
            <span>{{scope.row.currentMoney+'元'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已结算金额" align="center" prop="settlementMoney">
          <template slot-scope="scope">
            <span>{{scope.row.settlementMoney == null ? 0+'元' : scope.row.settlementMoney+'元'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后结算时间" align="center" prop="lastExtractTime" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.lastExtractTime ? parseTime(scope.row.lastExtractTime) : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成功结算次数" align="center" prop="extractNum"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="260">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="getLowerDetailList(scope.row.distributorId)"
              v-hasPermi="['apply:lowerDistributor:detail']"
            >分销详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="settlementHandle(scope.row)"
              v-hasPermi="['apply:lowerDistributor:withdraw']"
            >手动结算
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="getLowerSettlementLogList(scope.row.accountId)"
              v-hasPermi="['apply:lowerDistributor:settlementLog']"
            >结算记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getLowerList"
      />
    </div>

    <!-- 分销详情弹出框 -->
    <el-dialog
      title="分销详情"
      :visible.sync="detailOpen"
      width="800px"
      append-to-body
    >
      <el-table :data="detailList" border>
        <el-table-column label="分销商" align="center" prop="distributorName"/>
        <el-table-column label="分销课题" align="center" prop="topicName"/>
        <el-table-column label="分销比例" align="center" prop="distributionProportion">
          <template slot-scope="scope">
            <span>{{scope.row.distributionProportion+'%'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分销总金额" align="center" prop="money">
          <template slot-scope="scope">
            <span>{{ scope.row.money+'元' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 结算记录弹出框 -->
    <el-dialog
      title="结算记录"
      :visible.sync="logOpen"
      width="800px"
      append-to-body
    >
      <el-table :data="logList" border>
        <el-table-column label="结算编号" align="center" prop="withdrawSn"/>
        <el-table-column label="提现金额" align="center" prop="extractMoney">
          <template slot-scope="scope">
            <span>{{scope.row.extractMoney+'元'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="提现方式" align="center" prop="channer">
          <template slot-scope="scope">
            <span>{{scope.row.channer  == 1 ? '手动提现' : scope.row.channer  == 2 ? '自动提现' : '月结'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="提现备注" align="center" prop="remark"/>
      </el-table>
    </el-dialog>

    <!-- 手动结算弹出框 -->
    <el-dialog
      title="手动结算"
      :visible.sync="settlementOpen"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="结算金额" prop="extractMoney">
          <el-input-number
            v-model="form.extractMoney"
            label="请输入结算金额"
            :min="0"
            :step="0.01"
            step-strictly
          ></el-input-number>
        </el-form-item>
        <el-form-item label="结算备注" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            v-model="form.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定结算</el-button>
        <el-button @click="settlementOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    currentList,
    detailList,
    lowerDetailList,
    lowerList,
    lowerSettlementLogList,
    settlementLogList,
    withdraw
  } from '@/api/apply/account'
  import Template from '../../certificate/template/index'

  export default {
    name: 'DistributorAccount',
    components: { Template },
    data() {
      return {
        form: {},
        settlementOpen: false,
        detailList: [],
        detailOpen: false,
        logList: [],
        logOpen: false,
        loading: false,
        currentAccountList: [],
        lowerAccountList: [],
        total: 0,
        tab: '',
        tabList: [
          {
            name: '本机构结算详情',
            permission: 'apply:currentDistributor:list',
            id: '0'
          },
          {
            name: '下级结算',
            permission: 'apply:lowerDistributor:list',
            id: '1'
          }
        ],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          distributorName: undefined
        },
        // 表单校验
        rules: {
          extractMoney: [
            { required: true, message: '结算金额不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      //获取tab
      getTab() {
        this.tabList.forEach((item, index) => {
          if (!this.hasPermissions(item.permission)) {
            this.tabList.splice(index, 1)
          }
        })
        if (this.tabList.length > 0) {
          this.tab = this.tabList[0].id
        }
      },
      //权限判断
      hasPermissions(value) {
        const all_permission = '*:*:*'
        const permissions = this.$store.getters && this.$store.getters.permissions

        const permissionFlag = value

        const hasPermissions = permissions.some((permission) => {
          return (
            all_permission === permission || permissionFlag.includes(permission)
          )
        })

        return hasPermissions
      },
      // 获取当前机构结算信息
      getCurrentList() {
        currentList().then(res => {
          this.currentAccountList = res.data
        })
      },
      // 获取下级分销商结算信息
      getLowerList() {
        this.loading = true
        lowerList(this.queryParams).then(res => {
          this.lowerAccountList = res.rows
          this.total = res.total
          this.loading = false
        })
      },
      // 查询当前分销详情
      getCurrentDetailList() {
        detailList().then(res => {
          this.detailList = res.data
          this.detailOpen = true
        })
      },
      // 查询结算记录
      getSettlementLogList(accountId) {
        settlementLogList(accountId).then(res => {
          this.logList = res.data
          this.logOpen = true
        })
      },
      // 查询当前分销详情
      getLowerDetailList(distributorId) {
        lowerDetailList(distributorId).then(res => {
          this.detailList = res.data
          this.detailOpen = true
        })
      },
      // 查询结算记录
      getLowerSettlementLogList(accountId) {
        lowerSettlementLogList(accountId).then(res => {
          this.logList = res.data
          this.logOpen = true
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getLowerList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.getLowerList()
      },
      // 手动结算弹出框
      settlementHandle(row) {
        this.form = {
          accountId: row.accountId,
          extractMoney: undefined,
          remark: undefined
        }
        this.settlementOpen = true
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            withdraw(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('结算成功')
                this.settlementOpen = false
                this.getLowerList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        })
      }
    },
    created() {
      this.getTab()
    },
    watch: {
      tab(val, oldVal) {
        if (val == '0') {
          this.getCurrentList()
        } else {
          this.getLowerList()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tab {
    /deep/ .el-tabs__content {
      display: none;
    }
  }
</style>
