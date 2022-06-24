<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="企业名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入搜索内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="audit">
        <el-select v-model="queryParams.audit" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in auditOptions"
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
          v-hasPermi="['base:company:add']"
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
          v-hasPermi="['content:contCategory:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:company:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
          @click="importComponyOpen=true,userUploadStatus='',imageUploadStatus=''"
          v-hasPermi="['base:company:importComponyData']"
        >批量企业导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-audit"
          size="mini"
          :disabled="multiple"
          @click="handleAudit()"
          v-hasPermi="['content:contCategory:audit']"
        >批量审核企业
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="eyUsersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="企业名称" header-align="center" align="center" width="140" prop="companyName" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row)">{{scope.row.companyName}}</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column label="营业执照" header-align="center" align="center" prop="creditImg" :show-overflow-tooltip="true" width="170">-->
<!--        <template slot-scope="scope">-->
<!--          <el-image v-if="scope.row.creditImg != '' && scope.row.creditImg != null"-->
<!--            style="max-width: 20px; max-height: 20px"-->
<!--            :src="scope.row.creditImg"-->
<!--            :preview-src-list="[scope.row.creditImg]"-->
<!--          >-->
<!--          </el-image>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="社会信用代码" header-align="center" align="center" prop="creditCode" :show-overflow-tooltip="true" width="170"/>
      <el-table-column label="企业法人" header-align="center" align="center" width="110" prop="operName" :show-overflow-tooltip="true" />
      <el-table-column label="企业联系人" header-align="center" align="center" prop="linkMan" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="企业联系电话" header-align="center" align="center" prop="linkPhone" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="企业邮箱" header-align="center" align="center" prop="email" :show-overflow-tooltip="true" width="160"/>
<!--      <el-table-column label="用户类型" align="center" prop="userType" :formatter="userTypeFormat"-->
<!--                       :show-overflow-tooltip="true" width="75"/>-->
      <el-table-column label="用户状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true" width="170"/>
      <el-table-column label="审核状态" align="center" prop="audit" :formatter="auditFormat" :show-overflow-tooltip="true"/>
      <el-table-column label="审核内容" header-align="center" align="center" prop="auditCause" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="200px">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-switch-button"-->
<!--            @click="handlePassword(scope.row)"-->
<!--            v-hasPermi="['base:company:edit']"-->
<!--          >重置密码-->
<!--          </el-button>-->

          <el-button
            size="mini"
            type="text"
            icon="el-icon-bell"
            v-hasPermi="['base:company:audit']"
            @click="handleAudit(scope.row)"
          >审核
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
    <!-- 新增 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :title="auTitle" :visible.sync="addopen"
               width="1000px" append-to-body>
      <el-form ref="form" :model="addForm" :rules="addRules" label-width="90px">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="addForm.userName"/>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkMan">
              <el-input v-model="addForm.linkMan" :disabled="addForm.userId != null"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkPhone">
              <el-input v-model="addForm.linkPhone" :disabled="addForm.userId != null"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="addForm.companyName" :disabled="authInfoDisable" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照" prop="creditImg">
              <ImgCutter ref="imgCutterModal" label="点击上传" v-show="!authInfoDisable" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="1000" :boxHeight="560"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="creditImgRate"
                         WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff" :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownLicenseImg">
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open">上传</el-button>
              </ImgCutter>
              <el-input v-model="addForm.creditImg" v-show="false"/>
              <el-image v-if="addForm.creditImg" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="addForm.creditImg"
                        :preview-src-list="[addForm.creditImg]">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社会信用代码" label-width="120px" prop="creditCode">
              <el-input v-model="addForm.creditCode" :disabled="authInfoDisable" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属行业" prop="tradeId">
              <el-cascader :disabled="authInfoDisable"
                           v-model="addForm.tradeId"
                           :options="tradeList"
                           @change="changeTradeId">
              </el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属地区" prop="region">
              <el-cascader :disabled="authInfoDisable"
                           v-model="addForm.area"
                           :options="regionList"
                           @change="changeRegion">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="详细地址" prop="detailAddr">
              <el-input type="textarea" v-model="addForm.detailAddr" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业法人" prop="operName">
              <el-input v-model="addForm.operName" :disabled="authInfoDisable" placeholder="请输入企业法人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" placeholder="请输入邮箱" ref="email"/>
            </el-form-item>
          </el-col>

          <!-- 企业logo -->
          <el-col :span="12">
            <el-form-item label="企业logo" prop="logo">
              <ImgCutter ref="imgCutterModal" label="点击上传" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="775" :boxHeight="458"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="rate"
                         WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff" :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownEnterpriseLogo">
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open">上传</el-button>
              </ImgCutter>
              <el-input v-model="addForm.logo" v-show="false"/>
              <el-image v-if="addForm.logo" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="addForm.logo"
                        :preview-src-list="[addForm.logo]">
              </el-image>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="是否认证" prop="isAudit">-->
<!--              <el-radio-group v-model="addForm.isAudit">-->
<!--                <el-radio :label="0" >否</el-radio>-->
<!--                <el-radio :label="1" >是</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>


      </el-form>
      <span slot="footer" class="dialog-footer-but">
        <el-button @click="addopen = false">取 消</el-button>
        <el-button type="primary" @click="submitUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 审核用户 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :title="title" :visible.sync="open"
               width="1000px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">

        <el-row>
          <div v-if="!AuditType">



          <el-col :span="12">
            <el-form-item label="联系人" prop="linkMan">
              <el-input v-model="form.linkMan" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkPhone">
              <el-input v-model="form.linkPhone" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="form.companyName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业执照" prop="creditImg">
              <el-image v-if="form.creditImg" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="form.creditImg"
                        :preview-src-list="[form.creditImg]">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社会信用代码" label-width="120px" prop="creditCode">
              <el-input v-model="form.creditCode" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属行业" prop="tradeId">
              <el-cascader :disabled="true"
                           v-model="form.tradeId"
                           :options="tradeList"
                           @change="changeTradeId">
              </el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属地区" prop="region">
              <el-cascader :disabled="true"
                           v-model="form.area"
                           :options="regionList"
                           @change="changeRegion">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="详细地址" prop="detailAddr">
              <el-input type="textarea" :disabled="true" v-model="form.detailAddr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业法人" prop="operName">
              <el-input v-model="form.operName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" :disabled="true"  ref="email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业logo" prop="logo">
              <el-image v-if="form.logo" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="form.logo"
                        :preview-src-list="[form.logo]">
              </el-image>
            </el-form-item>
          </el-col>
          </div>
          <el-col :span="24">
            <el-form-item label="审核状态">
              <el-radio-group v-model="form.audit">
                <el-radio v-for="dict in auditOptions" :key="dict.id" :label="dict.dictValue">{{dict.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="审核内容" prop="auditCause" v-if="opeAudit==true">
              <el-input maxlength="30" show-word-limit type="textarea" v-model="form.auditCause" placeholder="请输入审核内容"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="auditForm()" v-if="opeAudit" v-hasPermi="['base:company:edit']">提交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量导入企业面板 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="批量企业导入"
               :visible.sync="importComponyOpen" width="600px" append-to-body>
      <div slot="footer" class="dialog-footer" style="margin-top: -50px">
        <el-row :gutter="25" class="mb8">
          <el-col :span="1.5">
            <a :href="componyExcelUrl" style="color: #00afff;text-decoration: underline;position: relative;top: 5px">下载excel模板</a>
          </el-col>

          <el-col :span="1.5">
            <el-upload
              class="upload-demo"
              action=""
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              accept=".xlsx"
              :http-request="httpRequestCompony"
            >
              <el-button
                type="warning"
                icon="el-icon-upload2"
                size="mini"
                v-hasPermi="['base:company:importComponyData']"
              >批量企业导入
              </el-button>
              <div slot="tip" class="el-upload__tip">{{userUploadStatus}}</div>
            </el-upload>
          </el-col>

          <el-col :span="1.5">
            <el-upload
              class="upload-demo"
              action=""
              accept=".zip"
              :http-request="componyFileUpload"
            >
              <el-button
                type="primary"
                icon="el-icon-upload2"
                size="mini"
                v-hasPermi="['base:company:uploadImgFile']"
              >导入身份认证图片压缩包
              </el-button>
              <div slot="tip" class="el-upload__tip">{{imageUploadStatus}}</div>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <span class="hint">（压缩包内图片名格式为 =>  头像：社会信用代码_tx  正面照：社会信用代码_zm）</span>
          </el-col>
        </el-row>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addCompany,
    auditContContents,
    changeUserStatus,
    exportCompany,
    fileUpload,
    GetCity,
    getCompany,
    updateAudits,
    GetExcelUrl,
    GetTrade,
    imgBase64Upload,
    imgBase64PrivateUpload,
    importComponyData,
    listCompany,
    resetPassword,
    updateCompany
  } from '@/api/base/company'
  import { fileUpload2 } from '@/api/course/order'
  import { treeselect as deptTreeselect } from '@/api/system/dept'
  import ImgCutter from 'vue-img-cutter' //裁图插件
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { checkEmail, SFID } from '@/utils/ruoyi'

  export default {
    name: 'EyUsers',
    components: { Treeselect, ImgCutter },
    watch: {
      'addForm.userType': {
        handler(val) {

        }
      }
    },
    data() {
      return {
        // 实名认证信息可以修改 true-不能修改 false-可以修改
        authInfoDisable: false,
        imageUploadStatus: '',
        userUploadStatus: '',
        userExcelUrl: '',
        componyExcelUrl: '',
        importUserOpen: false,
        importComponyOpen: false,
        // 是否禁用
        forbidden: false,
        // 编辑保存按钮是否显示
        editButton: true,
        // 遮罩层
        loading: true,
        // 审核内容判断显示
        opeAudit: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 工匠用户表格数据
        eyUsersList: [],
        // 弹出层标题
        title: '',
        // 部门列表
        sxdeptOptions: [],
        // 是否显示弹出层
        open: false,
        // 用户性别字典
        sexOptions: [],
        // 用户类型字典
        userTypeOptions: [],
        // 删除标志字典
        deleteFlagOptions: [],
        // 0:正常，1：停用字典
        statusOptions: [],
        // 0-未审核   1-审核通过  2-审核不通过字典
        auditOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined,
          sex: undefined,
          detailAddr: undefined,
          status: undefined,
          audit: undefined,
        },
        // 新增用户
        addForm: {
          email: '',
          //企业id
          companyId: '',
          //企业logo
          logo: '',
          // 企业名称
          companyName: '',
          // 社会信用代码
          creditCode: '',
          // 营业执照图片
          creditImg: '',
          tradeId: '',
          // userType: '1',
          // userName:"",
          // 联系人电话 新增时为企业添加一个管理员用户
          linkPhone: '',
          province: '',//省份
          city: '',//市
          area: '',//区/县
          // 企业法人：
          operName: '',
          // 详细地址
          detailAddr: '',
          isAudit: 0,
          deleteFlag: undefined,
          status: undefined,
          audit: undefined,
          auditCause: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
        },
        // 新增用户表单校验
        addRules: {
          companyName: [
            { required: true, message: '请输入企业名称', trigger: 'blur' }
          ],
          linkPhone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入11位数的手机号', trigger: 'blur' },
            {
              required: true,
              pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
          ],
          linkMan: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          creditCode: [
            { required: true, message: '请输入企业社会信用代码', trigger: 'blur' }
          ],
          // creditImg: [
          //   { required: true, message: '请上传企业营业执照图片', trigger: 'blur' }
          // ],
          operName: [
            { required: true, message: '请输入企业法人', trigger: 'blur' }
          ],
          tradeId: [
            { required: true, message: '请选择所属行业', trigger: 'change' }
          ],
        },

        // 表单参数
        form: {
          userName: '',
          password: ''
        },
        // 表单校验
        // rules: {
        //   userName: [
        //     { required: true, message: '用户名/登录名不能为空', trigger: 'blur' }
        //   ],
        //   password: [
        //     { required: true, message: '密码不能为空', trigger: 'blur' }
        //   ]
        // },
        // 图片比例
        rate: '16:9',
        creditImgRate: '4:3',
        // 添加用户弹窗
        addopen: false,
        // 新增或修改 弹出层标题
        auTitle: '',
        // 企业账户列表
        companyList: [],
        // 所属行业列表
        tradeList: [],
        // 所在地区列表
        regionList: [],
        earaValue: '',//省市区选中数据
        AuditType:false,
      }
    },
    created() {
      this.getList()
      this.getDicts('sys_user_sex').then(response => {
        this.sexOptions = response.data
      })
      this.getDicts('ey_user_type').then(response => {
        this.userTypeOptions = response.data
      })
      this.getDicts('sys_delete_status').then(response => {
        this.deleteFlagOptions = response.data
      })
      this.getDicts('ey_user_status').then(response => {
        this.statusOptions = response.data
      })
      this.getDicts('audit_status').then(response => {

        for(let item of response.data){
          item.dictValue=Number(item.dictValue)
        }
        this.auditOptions = response.data
      })
      this.getDeptTreeselect()
      this.getExcelUrl()
    },
    methods: {
      // 企业上传身份头像压缩包
      componyFileUpload(file) {
        this.imageUploadStatus = '上传中...'
        fileUpload(file, '2').then(res => {
          if (res.code == 200) {
            this.imageUploadStatus = '上传成功'
            this.$message.success('上传成功~')
          } else {
            this.imageUploadStatus = '上传失败'
            this.$message.error(res.msg)
          }
        }).catch(res => {
          this.imageUploadStatus = '上传失败'
        })
      },
      selectCompony(componyId) {
        this.companyList.forEach(item => {
          if (item.userId == componyId) {
            // 赋值
            this.addForm.tradeId = item.tradeId
            this.addForm.province = item.province
            this.addForm.city = item.city
            this.addForm.area = item.area
            // 禁用选择框
            this.forbidden = true
          }
        })
      },
      // 获取下载excel地址
      getExcelUrl() {
        let import_user = 'import_user'
        GetExcelUrl(import_user).then(response => {
          if (response.code == 200) {
            this.userExcelUrl = response.msg
          }
        })
        let import_compony = 'import_compony'
        GetExcelUrl(import_compony).then(response => {
          if (response.code == 200) {
            this.componyExcelUrl = response.msg
          }
        })
      },
      /**上传(比例16:9) */
      sixtTOnine: function(res) {
        this.rate = '16:9'
      },
      // 企业单位logo上传
      cutDownEnterpriseLogo(res) {
        imgBase64PrivateUpload(res.dataURL).then(res => {
          if (res.code == 200) {
            /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
            this.addForm.logo = res.data.url
          } else {
            this.$message.error('上传图片异常')
          }
        })
      },
      // 企业单位营业执照上传(私有空间)
      cutDownLicenseImg(res) {
        imgBase64PrivateUpload(res.dataURL).then(res => {
          if (res.code == 200) {
            /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
            this.addForm.creditImg = res.data.url
          } else {
            this.$message.error('上传图片异常')
          }
        })
      },
      /** 查询工匠用户列表 */
      getList() {
        this.loading = true
        listCompany(this.queryParams).then(response => {
          this.eyUsersList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      /** 查询部门树结构 */
      getDeptTreeselect() {
        deptTreeselect().then(response => {
          this.sxdeptOptions = response.data
        })
      },
      // 用户性别字典翻译
      sexFormat(row, column) {
        return this.selectDictLabel(this.sexOptions, row.sex)
      },
      // 用户类型字典翻译
      userTypeFormat(row, column) {
        return this.selectDictLabel(this.userTypeOptions, row.userType)
      },
      // 删除标志字典翻译
      deleteFlagFormat(row, column) {
        return this.selectDictLabel(this.deleteFlagOptions, row.deleteFlag)
      },
      // 0:正常，1：停用字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status)
      },
      // 0-未审核   1-审核通过  2-审核不通过字典翻译
      auditFormat(row, column) {
        return this.selectDictLabel(this.auditOptions, row.audit)
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.opeAudit = false
        this.importUserOpen = false
        this.importComponyOpen = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.forbidden = false
        this.addForm = {
          email: '',
          //企业id
          companyId: '',
          //企业logo
          logo: '',
          // 企业名称
          companyName: '',
          // 社会信用代码
          creditCode: '',
          // 营业执照图片
          creditImg: '',
          tradeId: '',
          // 联系人电话 新增时为企业添加一个管理员用户
          linkPhone: '',
          province: '',//省份
          city: '',//市
          area: '',//区/县
          // 企业法人：
          operName: '',
          // 详细地址
          detailAddr: '',
          deleteFlag: undefined,
          status: undefined,
          audit: undefined,
          auditCause: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          region: undefined,
          isAudit: 0,
        }
        this.resetForm('form')
      },
      // 重置表单
      resetFormData() {
        this.$refs.form.resetFields()
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
        this.ids = selection.map(item => item.companyId)//所有的表格id
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.addopen = true
        this.auTitle = '新增企业'
        this.authInfoDisable = false
        this.getCity()
        this.getTrade()
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        this.auTitle = '修改企业'
        this.editButton = true
        const companyId = row.companyId || this.ids
        console.log(companyId, "=====")
        this.getCity()
        this.getTrade()
        getCompany(companyId).then(response => {
          this.addForm = response.data
          this.addForm.area = Number(response.data.area);
          this.addForm.isAudit = 0
          this.addopen = true
          this.authInfoDisable = this.addForm.audit == '1' || this.addForm.audit == '2'

        })
      },
      /** 审核按钮操作 */
      handleAudit(row={}) {
        this.reset()
        this.getCity()
        this.getTrade()
        this.editButton = false
        let isrow=JSON.stringify(row)!='{}'
        let companyId=null
        if(isrow){
          this.AuditType=false
           companyId = row.companyId
        }else{
          this.AuditType=true
          companyId =  this.ids
        }
        // const companyId = row?.companyId || this.ids
        this.opeAudit = true
        this.open = true
        // return
        // console.log(isrow)
        // let requery=isrow?:updateAudits({ids:companyId,audit:this.form.audit,auditCause:this.form.auditCause})
        if(!isrow) return
        getCompany(companyId).then(response => {
          this.form = response.data
          this.form.audit=Number(this.form.audit)
          this.opeAudit = true
          this.open = true
          this.title = '平台用户审核'
        })
      },
      // 重置密码操作
      handlePassword(row) {
        this.$confirm('确认要重置"' + row.userName + '"用户密码为123456吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return resetPassword(row.userId)
        }).then(() => {
          this.msgSuccess('重置密码成功,重置后密码为：123456')
        })
      },

      // 新增用户类型切换
      changeUserType() {

      },
      // 新增：弹窗表单数据提交
      submitUserInfo() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 验证营业执照图片
            if (this.addForm.creditImg === undefined || this.addForm.creditImg == null || this.addForm.creditImg === "") {
              this.$message.error('请上传企业营业执照')
              this.$refs.email.focus()
              return false
            }
            // 验证所属地区
            if (this.addForm.area === undefined || this.addForm.area == null) {
              this.$message.error('请选择注册地区')
              this.$refs.email.focus()
              return false
            }
            // 验证邮箱
            let email = this.addForm.email
            if (email != null && email != '' && !checkEmail(email)) {
              this.$message.error('邮箱格式不正确')
              this.$refs.email.focus()
              return false
            }
            this.addForm.companyId == null || this.addForm.companyId == "" ? this.addEyUsersFun() : this.modifyEyUsers()
          } else {
            this.$message.error('请填入完整信息~')
            return false
          }
        })
      },
      // 新增
      addEyUsersFun() {
        // const formData = JSON.parse(JSON.stringify(this.addForm));
        // const requestData = {}
        // requestData.companyLegalPerson = this.addForm.companyLegalPerson
        // requestData.idCard = this.addForm.idCard
        // requestData.nickName = this.addForm.nickName
        // requestData.region = this.addForm.region
        // requestData.idCardZm = this.addForm.idCardZm
        // requestData.password = this.addForm.password
        // requestData.headPhoto = this.addForm.headPhoto
        // requestData.userType = this.addForm.userType
        // requestData.customName = this.addForm.customName
        // // 省市区id
        // requestData.province = this.addForm.province
        // requestData.city = this.addForm.city
        // requestData.area = this.addForm.area
        // requestData.phonenumber = this.addForm.phonenumber
        // requestData.tradeId = this.addForm.tradeId
        // return

        addCompany(this.addForm).then(response => {
          if (response.code === 200) {
            this.msgSuccess('新增成功')
            this.addopen = false
            this.getList()
            // this.resetFormData()
          } else {
            this.msgError(response.msg)
          }
        })
      },

      // 修改用户信息
      modifyEyUsers() {
        // const requestData = {}
        // requestData.userId = this.addForm.userId
        // // 省市区id
        // requestData.province = this.addForm.province
        // requestData.city = this.addForm.city
        // requestData.area = this.addForm.area
        // requestData.isSup = this.addForm.isSup
        // requestData.isAudit = this.addForm.isAudit
        // if (this.addForm.userType == 1) {
        //   requestData.nickName = this.addForm.nickName
        //   requestData.idCard = this.addForm.idCard
        //   requestData.sex = this.addForm.sex
        //   requestData.email = this.addForm.email
        //   requestData.companyId = this.addForm.companyId
        //   requestData.avatar = this.addForm.avatar
        //   requestData.idCardZm = this.addForm.idCardZm
        //   requestData.idCardFm = this.addForm.idCardFm
        //   requestData.userType = this.addForm.userType
        //   requestData.phonenumber = this.addForm.phonenumber
        //   requestData.region = this.addForm.region
        //   requestData.tradeId = this.addForm.tradeId
        // } else if (this.addForm.userType == 2) {
        //   requestData.companyLegalPerson = this.addForm.companyLegalPerson
        //   requestData.idCard = this.addForm.idCard
        //   requestData.nickName = this.addForm.nickName
        //   requestData.region = this.addForm.region
        //   requestData.idCardZm = this.addForm.idCardZm
        //   requestData.headPhoto = this.addForm.headPhoto
        //   requestData.userType = this.addForm.userType
        //   requestData.phonenumber = this.addForm.phonenumber
        //   requestData.tradeId = this.addForm.tradeId
        // }
        // const requestDataDetail = JSON.parse(JSON.stringify(requestData))
        updateCompany(this.addForm).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.addopen = false
            this.getList()
            // this.resetFormData()
          } else {
            this.msgError(response.msg)
          }
        })
      },

      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.userId != undefined) {
              (this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addCompany(this.form).then(response => {
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

      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status === 0 ? '启用' : '停用'
        this.$confirm('确认要"' + text + '""' + row.companyName + '"用户吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return changeUserStatus(row.companyId, row.status)
        }).then(() => {
          this.msgSuccess(text + '成功')
        }).catch(function() {
          row.status = row.status === 0 ? 1 : 0
        })
      },

      /** 审核按钮 */
      auditForm: function() {
        this.$refs['form'].validate(valid => {
          // console.log(12312,valid)
          if (valid) {
            if (this.form.companyId != undefined || this.AuditType) {
              // console.log(updateAudits,this.AuditType)
              // return
              let row=!this.AuditType?auditContContents(this.form):updateAudits({ids:this.ids,audit:this.form.audit,auditCause:this.form.auditCause})
              row.then(response => {
                if (response.code === 200) {
                  this.msgSuccess('审核成功')
                  this.opeAudit = false
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
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有平台企业数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportCompany(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      },
      /**批量导入学员 */
      ImportStudents() {

      },
      /**批量导入企业 */
      ImportEnterprise() {

      },
      /**
       * 上传文件：批量企业
       */
      async httpRequestCompony(params) {
        this.userUploadStatus = '上传中...'
        // 上传文件获取url 地址
        let fileUrl = ''
        await fileUpload2(params).then(response => {
          fileUrl = response.url
        })

        // 获取url地址后再讲文件传给后端
        const requestData = {
          url: fileUrl,
          userType: '2',
          excel: true
        }
        importComponyData(requestData).then(response => {
          if (response.data == 200) {
            this.userUploadStatus = '上传成功'
            this.$message.success('企业批量文件上传成功~')
          } else {
            this.userUploadStatus = '上传失败'
            this.download(response.msg)
            this.$message.error('上传数据有误，请将数据修改后重新上传！')
          }
        }).catch(res => {
          this.userUploadStatus = '上传失败'
        })
      },
      /**获取省市区数据 */
      getCity() {
        GetCity().then(response => {
          const data = response.data
          if (response.code == 200) {
            this.regionList = data
            this.regionChildren(this.regionList)
          }
        })
      },
      /**获取行业信息 */
      getTrade() {
        GetTrade().then(response => {
          const data = response.data
          if (response.code == 200) {
            this.tradeList = data
            this.tradeIdChildren(this.tradeList)
          }

        })
      },
      // 级联：行业数据
      changeTradeId(value) {
        value && (this.addForm.tradeId = value[value.length - 1])//获取行业id的值
      },
      // 级联：省市区
      changeRegion(val) {
        if (val) {
          this.addForm.province = val[0]
          this.addForm.city = val[1]
          this.addForm.area = val[2]
        }
      },
      // 行业递归方法（处理级联数据）
      tradeIdChildren(data) {
        data.forEach((val, index) => {
          const children = val.childCompanyTradeList
          val.value = val.tradeId
          val.label = val.tradeName
          val.children = val.childCompanyTradeList
          if (children.length > 0) {
            this.tradeIdChildren(children)
          } else {
            val.children = undefined
          }
        })
      },
      // 省市区递归方法（处理级联数据）
      regionChildren(data) {
        data.forEach((regionVal, index) => {
          const children = regionVal.children
          regionVal.value = regionVal.codeId
          regionVal.label = regionVal.cityName
          regionVal.children = regionVal.children
          if (children.length > 0) {
            this.regionChildren(children)
          } else {
            regionVal.children = undefined
          }
        })
      },
      handleRemove(file, fileList) {
        this.length = 0
      },
      handlePreview(file) {
      },
      handleExceed() {

      }
    }
  }
</script>
<style>
  .hint {
    color: red;
    font-size: 12px;
  }
</style>
