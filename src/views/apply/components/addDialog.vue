<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="open = true" round>{{
      btnText
    }}</el-button>
    <!-- 添加对话框 -->
    <el-dialog
      :title="btnText"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div v-for="(item, index) in formList" :key="index">
          <el-form-item
            :label="item.name"
            :prop="item.key"
            v-if="!item.isSelect"
          >
            <el-input
              v-model="form[item.key]"
              show-word-limit
              v-if="item.maxlength"
              :maxlength="item.maxlength"
              :placeholder="`请输入${item.name}`"
            />
            <el-input
              v-model="form[item.key]"
              v-else
              :placeholder="`请输入${item.name}`"
              :disabled="form.account == 1"
            />
          </el-form-item>
          <div v-if="item.isSelect && !item.isStatus">
            <el-form-item :label="item.name" :prop="item.key">
              <el-radio-group v-model="form.account">
                <el-radio :label="0">创建新账号</el-radio>
                <el-radio :label="1">绑定已有账号</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" v-show="form.account == 1">
              <el-button
                type="primary"
                icon="el-icon-user-solid"
                round
                @click="bindingUser"
                >绑定用户</el-button
              >
            </el-form-item>
          </div>
          <el-form-item label="状态" prop="status" v-if="item.isStatus">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 选择用户弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择用户"
      :visible.sync="userOpen"
      width="800px"
      append-to-body
    >
      <el-form
        :model="userParams"
        :inline="true"
        label-width="68px"
        @submit.native.prevent
      >
        <el-form-item label="">
          <el-input
            v-model="userParams.userName"
            placeholder="请输入用户名称"
            clearable
            size="small"
            @keyup.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getUserList"
            >搜索
          </el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="userLoading" :data="userList" border>
        <el-table-column label="用户名" align="center" prop="userName" />
        <el-table-column label="用户姓名" align="center" prop="nickName" />
        <el-table-column label="手机号" align="center" prop="phonenumber" />
        <el-table-column label="邮箱" align="center" prop="email" />
        <el-table-column label="是否为二级分销商" align="center" prop="remark">
          <template slot-scope="scope">
            <span>{{scope.row.remark == '0' ? '否' : '是'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="confirmSelect(scope.row)"
              >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="userTotal > 0"
        :total="userTotal"
        :page.sync="userParams.pageNum"
        :limit.sync="userParams.pageSize"
        @pagination="getUserList()"
      />
    </el-dialog>
  </div>
</template>

<script>
import { queryUserList } from "@/api/system/user";
export default {
  data() {
    return {
      //选择用户弹窗
      userOpen: false,
      userLoading: true,
      userList: [],
      userTotal: 0,
      userParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
      },
      //弹窗
      open: false,
    };
  },
  props: {
    btnText: {
      type: String,
      default: "",
    },
    porp: {
      type: Object,
      default: ()=>{
        return {}
      },
    },
    form: {
      type: Object,
      default: {},
    },
    formList: {
      type: Array,
      default: [],
    },
    rules: {
      type: Object,
      default: {},
    },
  },
  methods: {
    /** 选择用户 */
    confirmSelect(row) {
      this.form.uid = row.userId;
      this.form.nickName = row.nickName;
      this.form.phonenumber = row.phonenumber;
      this.userOpen = false;
    },
    /** 查询用户列表 */
    getUserList() {
      this.userLoading = true;
      queryUserList(this.userParams).then((response) => {
        this.userList = response.rows;
        this.userTotal = response.total;
        this.userOpen = true;
        this.userLoading = false;
      });
    },
    /** 绑定用户点击 */
    bindingUser() {
      this.getUserList();
    },
    //弹窗点击取消
    cancel() {
      this.open = false;
      this.$emit("cancel");
    },
    //添加
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let promise = new Promise((resolve, reject) => {
            console.log('hhhhh',this.porp.callback)
            this.porp.callback(this.form,resolve);
          });
          promise.then(res=>{
            if(res){
              this.open = false;
            }
          })

        }
      });
    },
  },
  created() {},
  mounted() {},
};
</script>

<style>
</style>
