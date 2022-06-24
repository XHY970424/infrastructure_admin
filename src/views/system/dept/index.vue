<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="部门名称">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="deptList" row-key="deptId" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button v-if="scope.row.parentId != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
<!--          <el-col :span="24">-->
<!--            <el-form-item label="域名路径" v-if="form.parentId == 100">-->
<!--              <el-input v-model="form.deptUrl" placeholder="请输入域名路径" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
<!--          <div v-if="isShowPay">-->
<!--            <el-col :span="24">-->
<!--              <div class="yw-title"><b>线下转账配置信息: </b></div>-->
<!--              <el-input v-model="form.id" v-show="false"/>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="开户银行" prop="cardBank">-->
<!--                <el-input v-model="form.cardBank" placeholder="请输入开户银行" maxlength="50"/>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="银行卡户名" prop="cardName">-->
<!--                <el-input v-model="form.cardName" placeholder="请输入银行卡户名" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="24">-->
<!--              <el-form-item label="银行卡号" prop="cardNumber">-->
<!--                <el-input v-model="form.cardNumber" placeholder="请输入银行卡号" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->
           <!-- <el-col :span="24">
              <div class="yw-title"><b>支付宝扫码支付配置信息: </b></div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="支付宝商户appid" prop="">
                <el-input v-model="form.aliAppid" placeholder="请输入支付宝商户appid" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="支付宝应用私钥">
                <el-input type="textarea" v-model="form.aliRsaPrivateKey" placeholder="请输入支付宝应用私钥" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="支付宝公钥">
                <el-input type="textarea" v-model="form.aliPublicKey" placeholder="请输入支付宝公钥" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="yw-title"><b>微信扫码支付配置信息: </b></div>
            </el-col>
            <el-col :span="24">
              <el-form-item label="微信公众账号id(appid)">
                <el-input v-model="form.wxAppid" placeholder="请输入公众账号id" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="微信商户id(mch_id)">
                <el-input v-model="form.wxMchid" placeholder="请输入微信商户id" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="微信API秘钥">
                <el-input type="textarea" v-model="form.wxKey" placeholder="请输入微信API秘钥" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="微信支付证书">
                <el-input v-model="form.wxCertPath" disabled="disabled" />
                <el-upload action="" :http-request="ywupload" :limit="upLimit"  ref="my-upload">
                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col> -->
<!--          </div>-->
        </el-row>
<!--        <el-row v-if="isShowPay">-->

<!--        </el-row>-->
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
    listDept,
    getDept,
    delDept,
    addDept,
    updateDept,
    listDeptExcludeChild,
    uploadWxCert
  } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "Dept",
    components: {
      Treeselect
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 表格树数据
        deptList: [],
        // 部门树选项
        deptOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态数据字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          deptName: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          parentId: [{
            required: true,
            message: "上级部门不能为空",
            trigger: "blur"
          }],
          deptName: [{
            required: true,
            message: "部门名称不能为空",
            trigger: "blur"
          }],
          orderNum: [{
            required: true,
            message: "菜单顺序不能为空",
            trigger: "blur"
          }],
          email: [{
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }],
          phone: [{
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }],
          cardBank: [{
            required: true,
            message: "开户银行不能为空",
            trigger: "blur"
          }],
          cardName: [{
            required: true,
            message: "银行卡户名不能为空",
            trigger: "blur"
          }],
          cardNumber: [{
            required: true,
            message: "银行卡号不能为空",
            trigger: "blur"
          }],
        },
        /** 是否显示支付信息 */
        isShowPay: false,
        /** 上传文件限制 */
        upLimit: 1,
      };
    },
    computed: {
      newParentId() {
        return this.form.parentId;
      }
    },
    watch: {
      // 监听 parentId
      newParentId: function(val) {
        if (val == 100){
          this.isShowPay = true
        }else{
          this.isShowPay = false
        }
      }
    },
    created() {
      this.getList();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
    },
    methods: {
      clearFile(){
        this.$refs['my-upload'].clearFiles();
      },
      // 上传文件
      ywupload(file) {
        this.loading = true;
        uploadWxCert(file)
          .then(res => {
            this.loading = false
            if (res.code == 200){
              this.form.wxCertPath = res.msg
              // 弹出提示
              this.$message({
                message: '上传成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: res.msg,
                type: 'success'
              });
            }

          })
          .catch(() => {
            this.loading = false
          });
      },
      /** 查询部门列表 */
      getList() {
        this.loading = true;
        listDept(this.queryParams).then(response => {
          this.deptList = this.handleTree(response.data, "deptId");
          this.loading = false;
        });
      },
      /** 转换部门数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.deptId,
          label: node.deptName,
          children: node.children
        };
      },
      // 字典状态字典翻译
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
          deptId: undefined,
          parentId: undefined,
          deptName: undefined,
          orderNum: undefined,
          leader: undefined,
          phone: undefined,
          email: undefined,
          status: "0",
          deptUrl: undefined,
          cardBank: undefined,
          cardName: undefined,
          cardNumber: undefined,
          aliAppid: undefined,
          aliRsaPrivateKey: undefined,
          aliPublicKey: undefined,
          wxAppid: undefined,
          wxMchid: undefined,
          wxKey: undefined,
          wxCertPath: undefined,
          id: undefined
        };
        // this.clearFile();
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 新增按钮操作 */
      handleAdd(row) {
        this.reset();
        if (row != undefined) {
          this.form.parentId = row.deptId;
        }
        // if (this.form.parentId == 100) {
        //   this.isShowPay = true
        // }
        this.open = true;
        this.title = "添加部门";
        listDept().then(response => {
          this.deptOptions = this.handleTree(response.data, "deptId");
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        getDept(row.deptId).then(response => {
          // this.form = response.data;
          for (let key in response.data){
            if (key == "eyDeptConfig"){
              // this.form[key] = response.data.eyDeptConfig[key]
              this.form.cardBank = response.data.eyDeptConfig.cardBank
              this.form.cardName = response.data.eyDeptConfig.cardName
              this.form.cardNumber = response.data.eyDeptConfig.cardNumber
              this.form.aliAppid = response.data.eyDeptConfig.aliAppid
              this.form.aliRsaPrivateKey = response.data.eyDeptConfig.aliRsaPrivateKey
              this.form.aliPublicKey = response.data.eyDeptConfig.aliPublicKey
              this.form.wxAppid = response.data.eyDeptConfig.wxAppid
              this.form.wxMchid = response.data.eyDeptConfig.wxMchid
              this.form.wxKey = response.data.eyDeptConfig.wxKey
              this.form.wxCertPath = response.data.eyDeptConfig.wxCertPath
              this.form.id = response.data.eyDeptConfig.id
            }else{
              this.form[key] = response.data[key]
            }
          }
          // this.form.cardBank = response.data.eyDeptConfig.cardBank
          // this.form.cardName = response.data.eyDeptConfig.cardName
          // this.form.cardNumber = response.data.eyDeptConfig.cardNumber
          // this.form.aliAppid = response.data.eyDeptConfig.aliAppid
          // this.form.aliRsaPrivateKey = response.data.eyDeptConfig.aliRsaPrivateKey
          // this.form.aliPublicKey = response.data.eyDeptConfig.aliPublicKey
          // this.form.wxAppid = response.data.eyDeptConfig.wxAppid
          // this.form.wxMchId = response.data.eyDeptConfig.wxMchId
          // this.form.wxKey = response.data.eyDeptConfig.wxKey
          // this.form.wxCertPath = response.data.eyDeptConfig.wxCertPath
          // this.form.id = response.data.eyDeptConfig.id
          // console.log(this.form);
          this.open = true;
          this.title = "修改部门";
        });
        listDeptExcludeChild(row.deptId).then(response => {
          this.deptOptions = this.handleTree(response.data, "deptId");
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.deptId != undefined) {
              if (!this.isShowPay){
                this.form.id = undefined
                this.form.cardName = undefined
              }
              this.formatFormData();
              updateDept(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              this.formatFormData();
              addDept(this.form).then(response => {
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
        this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDept(row.deptId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      formatFormData(){
        var eyDeptConfig = {};
        eyDeptConfig.id = this.form.id
        eyDeptConfig.cardBank = this.form.cardBank
        eyDeptConfig.cardName = this.form.cardName
        eyDeptConfig.cardNumber = this.form.cardNumber
        eyDeptConfig.aliAppid = this.form.aliAppid
        eyDeptConfig.aliRsaPrivateKey = this.form.aliRsaPrivateKey
        eyDeptConfig.aliPublicKey = this.form.aliPublicKey
        eyDeptConfig.wxAppid = this.form.wxAppid
        eyDeptConfig.wxMchid = this.form.wxMchid
        eyDeptConfig.wxKey = this.form.wxKey
        eyDeptConfig.wxCertPath = this.form.wxCertPath
        this.form.eyDeptConfig = eyDeptConfig
        console.log("======================================================")
        console.log(this.form)
        console.log("======================================================")
      }
    }
  };
</script>

<style>
  .yw-title {
    height: 30px;
    font-size: 18px;
  }
</style>
