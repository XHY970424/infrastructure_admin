<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户名称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="会员等级" prop="level">
        <el-select v-model="queryParams.level" placeholder="请选择会员等级" clearable size="small">
          <el-option label="普通会员" :value="0"/>
          <el-option label="高级会员" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['offline:member:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-upload"
          size="mini"
          :disabled="multiple"
          @click="handlePromot"
          v-hasPermi="['offline:member:promote']"
        >会员批量升级
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="用户名称" align="center" prop="nickName">
        <template slot-scope="scope">
          <span>{{scope.row.nickName == null ? scope.row.userName : scope.row.nickName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center" prop="level">
        <template slot-scope="scope">
          <span v-show="scope.row.level == 0">普通会员</span>
          <span v-show="scope.row.level == 1" style="color: red">高级会员</span>
        </template>
      </el-table-column>
      <el-table-column label="开通时间" align="center" prop="openTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.openTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" prop="expireTime" width="180">
        <template slot-scope="scope">
          <span v-show="scope.row.expireTime != null">{{ parseTime(scope.row.expireTime, '{y}-{m}-{d}') }}</span>
          <span v-show="scope.row.expireTime == null">无限期</span>
        </template>
      </el-table-column>
      <el-table-column label="收费档次" align="center" prop="price">
        <template slot-scope="scope">
          <span v-show="scope.row.price != null">{{scope.row.price}}元/年</span>
          <span v-show="scope.row.price == null"></span>
        </template>
      </el-table-column>
      <el-table-column label="开通期限" align="center" prop="deadline"/>
      <el-table-column label="开通人" align="center" prop="openByName">
        <template slot-scope="scope">
          <span v-show="scope.row.openByName != null">{{scope.row.openByName}}</span>
          <span v-show="scope.row.openByName == null">系统生成</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="handlePromot(scope.row)"
            v-hasPermi="['offline:member:promote']"
            v-show="scope.row.level == 0"
          >会员升级
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

    <!-- 添加或修改用户会员对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学员用户" prop="userIds">
          <span v-for="item in users">{{item.userName}} </span>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addSelectUser(),getUserList()"
          >添加学员
          </el-button>
        </el-form-item>
        <el-form-item label="会员等级" prop="level">
          <el-radio-group v-model="form.level">
            <el-radio :label="0">普通会员</el-radio>
            <el-radio :label="1">高级会员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员价格" prop="price" v-show="form.level == 1">
          <el-radio-group v-model="priceStatus">
            <el-radio :label="0">799元/年</el-radio>
            <el-radio :label="1">999元/年</el-radio>
            <el-radio :label="2">1299元/年</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="期限/年" prop="deadline" v-show="form.level == 1">
          <el-input-number v-model="form.deadline" :min="1" :max="100" :step="1" step-strictly></el-input-number>
        </el-form-item>
        <!--        <el-form-item label="到期时间" prop="expireTime">-->
        <!--          <el-date-picker clearable size="small" style="width: 300px"-->
        <!--                          v-model="form.expireTime"-->
        <!--                          type="date"-->
        <!--                          value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                          placeholder="选择到期时间,不选择为永不到期">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: -40px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 学员列表弹出框 -->
    <el-dialog :close-on-click-modal="false" title="选择学员" :visible.sync="userOpen" width="1000px"
               append-to-body>
      <el-form :model="userParams" :inline="true" label-width="68px" @submit.native.prevent>
        <el-form-item label="">
          <el-input
            v-model="userParams.userName"
            placeholder="请输入学员名称/手机号/邮箱/身份证查询"
            clearable
            size="small"
            @keyup.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getUserList">搜索</el-button>
          <el-button type="primary" icon="el-icon-success" size="mini" @click="confirmSelect">确认选择</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        已选学员:
        <span v-for="item in userArray">{{item.userName}} </span>
      </div>
      <el-table v-loading="userLoading" :data="userList" border>
        <el-table-column label="用户名" align="center" prop="userName"/>
        <el-table-column label="用户姓名" align="center" prop="nickName"/>
        <el-table-column label="手机号" align="center" prop="phonenumber"/>
        <el-table-column label="邮箱" align="center" prop="email"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="selectUser(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="userTotal>0"
        :total="userTotal"
        :page.sync="userParams.pageNum"
        :limit.sync="userParams.pageSize"
        @pagination="getUserList()"
      />
    </el-dialog>

    <!-- 会员升级弹出框 -->
    <el-dialog :close-on-click-modal="false" title="会员升级" :visible.sync="memberPromoteOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="会员价格" prop="price">
          <el-radio-group v-model="priceStatus">
            <el-radio :label="0">799元/年</el-radio>
            <el-radio :label="1">999元/年</el-radio>
            <el-radio :label="2">1299元/年</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="期限/年" prop="deadline">
          <el-input-number v-model="form.deadline" :min="1" :max="100" :step="1" step-strictly></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="memberUpgrade">确 定</el-button>
        <el-button @click="memberPromoteOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addMember, delMember, getMember, listMember, promote } from '@/api/offline/member'
  import { queryAddibleUserList } from '@/api/base/eyUsers'
  import Template from '../../certificate/template/index'

  export default {
    name: 'Member',
    components: { Template },
    data() {
      return {
        promoteUserId:undefined,
        memberPromoteOpen:false,
        priceStatus: 0,
        /** 学员列表弹出框start */
        userArray: [],
        users: [],
        userOpen: false,
        userLoading: true,
        userList: [],
        userTotal: 0,
        userParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined
        },
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
        // 用户会员表格数据
        memberList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          nickName: undefined,
          level: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          userIds: [
            { required: true, message: '用户id不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '会员等级不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '开通会员价格不能为空', trigger: 'blur' }
          ],
          deadline: [
            { required: true, message: '开通会员期限能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      /** 升级会员按钮操作 */
      handlePromot(item) {
        this.form = {
          deadline: 1
        }
        this.resetForm('form')
        this.priceStatus = 0;
        this.promoteUserId = item.userId;
        this.memberPromoteOpen = true
      },
      /** 会员升级 */
      memberUpgrade() {
        const memberIds = this.promoteUserId ? [this.promoteUserId] : this.ids
        if (this.priceStatus == 0) {
          this.form.price = 799
        } else if (this.priceStatus == 1) {
          this.form.price = 999
        } else if (this.priceStatus == 2) {
          this.form.price = 1299
        }
        let param = {
          userIds: memberIds,
          level: 1,
          price: this.form.price,
          deadline: this.form.deadline
        }
        promote(param).then(res => {
          if (res.code == 200) {
            this.$message.success('会员升级操作成功')
            this.memberPromoteOpen = false;
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
        // this.$confirm('是否将学员升为高级会员?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //
        // })
      },
      /** 选择学员弹出框 */
      addSelectUser() {
        this.userParams.pageNum = 1
        this.userParams.pageSize = 10
        this.userParams.userName = undefined
        this.userArray = JSON.parse(JSON.stringify(this.users))
      },
      /** 确认选择 */
      confirmSelect() {
        this.users = JSON.parse(JSON.stringify(this.userArray))
        let userIdArray = this.userArray.map(item => {
          return item.userId
        })
        this.form.userIds = JSON.parse(JSON.stringify(userIdArray))
        this.userOpen = false
      },
      /** 选择学员 */
      selectUser(item) {
        const found = this.userArray.some(el => el.userId === item.userId)
        if (!found) this.userArray.push({ userId: item.userId, userName: item.nickName })
      },
      /** 查询学员列表 */
      getUserList() {
        this.userLoading = true
        queryAddibleUserList(this.userParams).then(response => {
          this.userList = response.rows
          this.userTotal = response.total
          this.userOpen = true
          this.userLoading = false
        })
      },
      /** 查询用户会员列表 */
      getList() {
        this.loading = true
        listMember(this.queryParams).then(response => {
          this.memberList = response.rows
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
          userIds: undefined,
          level: 0,
          expireTime: undefined,
          price: 0,
          deadline: 1
        }
        this.priceStatus = 0;
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
        // 查询是否选择高级会员
        let num = 0
        selection.forEach(item => {
          if (item.level == 1) {
            num++
          }
        })
        this.ids = selection.map(item => item.userId)
        this.single = selection.length != 1
        this.multiple = !selection.length
        if (num > 0) {
          this.multiple = true
        }
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.users = []
        this.open = true
        this.title = '添加用户会员'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const memberId = row.memberId || this.ids
        getMember(memberId).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改用户会员'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.priceStatus == 0) {
              this.form.price = 799
            } else if (this.priceStatus == 1) {
              this.form.price = 999
            } else if (this.priceStatus == 2) {
              this.form.price = 1299
            }
            addMember(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const memberIds = row.memberId || this.ids
        this.$confirm('是否确认删除用户会员编号为"' + memberIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delMember(memberIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有用户会员数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportMember(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
