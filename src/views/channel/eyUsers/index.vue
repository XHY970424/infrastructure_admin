<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入搜索内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- <el-form-item label="用户性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="归属部门" prop="deptId" v-hasRole="['admin']">
            <treeselect v-model="queryParams.deptId" :options="sxdeptOptions" placeholder="请选择归属部门" style="width: 240px" />
          </el-form-item> -->

      <el-form-item label="用户类型" prop="userType">
        <el-select v-model="queryParams.userType" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in userTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
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


    <el-table v-loading="loading" border :data="eyUsersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="账户名称" header-align="center" width="110" prop="userName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="text" size="small">{{ scope.row.userName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户名" header-align="center" prop="customName" :show-overflow-tooltip="true" width="130"/>
      <el-table-column label="姓名/企业名称" header-align="center" prop="nickName" :show-overflow-tooltip="true" width="130"/>
      <el-table-column label="身份证/营业执照号" header-align="center" prop="idCard" :show-overflow-tooltip="true" width="170"/>
      <el-table-column label="手机号码" header-align="center" prop="phonenumber" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="邮箱" header-align="center" prop="email" :show-overflow-tooltip="true" width="160"/>
      <el-table-column label="用户类型" align="center" prop="userType" :formatter="userTypeFormat"
                       :show-overflow-tooltip="true" width="75"
      />
      <el-table-column label="用户性别" align="center" prop="sex" :formatter="sexFormat" :show-overflow-tooltip="true"
                       width="75"
      />
      <el-table-column label="用户状态" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true" width="170"/>
      <el-table-column label="所属企业" align="center" prop="companyName" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="部门" align="center" prop="sectionName" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="岗位" align="center" prop="postsName" :show-overflow-tooltip="true" width="120"/>
      <el-table-column label="审核状态" align="center" prop="audit" :formatter="auditFormat" :show-overflow-tooltip="true"/>
      <el-table-column label="审核内容" header-align="center" prop="auditCause" :show-overflow-tooltip="true"/>

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
               width="1000px" append-to-body
    >
      <el-form ref="form" :model="addForm" :rules="addRules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户类型" prop="userType">
              <el-radio-group v-model="addForm.userType" @change="changeUserType">
                <el-radio v-for="dict in userTypeOptions" :key="dict.id" :label="dict.dictValue">{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="addForm.userName"/>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item v-show="addForm.userType == 1" label="身份证号" prop="idCard">
              <el-input v-model="addForm.idCard" ref="idCard"/>
            </el-form-item>

            <el-form-item v-show="addForm.userType == 2" label="营业执照号" prop="idCard">
              <el-input v-model="addForm.idCard"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="addForm.phonenumber"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item v-show="addForm.userType == 1" label="真实姓名" prop="nickName">
              <el-input v-model="addForm.nickName"/>
            </el-form-item>

            <el-form-item v-show="addForm.userType == 2" label="单位名称" prop="nickName">
              <el-input v-model="addForm.nickName"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="账号密码" v-if="auTitle == '新增用户'" prop="password">
              <el-input type="password" v-model="addForm.password"/>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-show="addForm.userType == 1">
            <el-form-item label="用户性别" prop="sex">
              <el-radio-group v-model="addForm.sex" disabled>
                <el-radio v-for="dict in sexOptions" :key="dict.id" :label="parseInt(dict.dictValue)">
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" v-show="addForm.userType == 1">
              <el-input v-model="addForm.email" placeholder="请输入邮箱" ref="email"/>
            </el-form-item>

            <el-form-item label="企业法人" prop="companyLegalPerson" v-show="addForm.userType == 2">
              <el-input v-model="addForm.companyLegalPerson" placeholder="请输入企业法人"/>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-show="addForm.userType == 1">
            <el-form-item label="所属企业" prop="companyId">
              <el-select v-model="addForm.companyId" placeholder="请选择所属企业" @change="selectCompony(addForm.companyId)">
                <el-option
                  v-for="item in companyList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属行业" prop="tradeId">
              <el-cascader :disabled="forbidden && addForm.userType==1"
                           v-model="addForm.tradeId"
                           :options="tradeList"
                           @change="changeTradeId"
              >
              </el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属地区" prop="region">
              <el-cascader :disabled="forbidden && addForm.userType==1"
                           v-model="addForm.area"
                           :options="regionList"
                           @change="changeRegion"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="用户头像" prop="avatar" v-if="addForm.userType==1">
              <ImgCutter ref="imgCutterModal" label="点击上传" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="775" :boxHeight="458"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="rate"
                         WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff" :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownAvatar"
              >
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open">上传</el-button>
              </ImgCutter>
              <el-input v-model="addForm.avatar" v-show="false"/>
              <el-image v-if="addForm.avatar" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="addForm.avatar"
                        :preview-src-list="[addForm.avatar]"
              >
              </el-image>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="身份证人像面" prop="idCardZm" v-if="addForm.userType==1" label-width="100px">
              <ImgCutter ref="imgCutterModal" label="点击上传" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="775" :boxHeight="458"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="rate"
                         WatermarkText="大湾区职训网" WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff"
                         :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownIdCardZm"
              >
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open">上传</el-button>
              </ImgCutter>
              <el-input v-model="addForm.idCardZm" v-show="false"/>
              <el-image v-if="addForm.idCardZm" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="addForm.idCardZm"
                        :preview-src-list="[addForm.idCardZm]"
              >
              </el-image>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="身份证国徽面" prop="idCardFm" v-if="addForm.userType==1" label-width="100px">
              <ImgCutter ref="imgCutterModal" label="点击上传" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="775" :boxHeight="458"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="rate"
                         WatermarkText="大湾区职训网" WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff"
                         :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownIdCardFm"
              >
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open">上传</el-button>
              </ImgCutter>
              <el-input v-model="addForm.idCardFm" v-show="false"/>
              <el-image v-if="addForm.idCardFm" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="addForm.idCardFm"
                        :preview-src-list="[addForm.idCardFm]"
              >
              </el-image>
            </el-form-item>
          </el-col>

          <!-- 企业logo 和 营业执照 -->
          <el-col :span="8">
            <el-form-item label="企业logo" prop="headPhoto" v-if="addForm.userType == 2">
              <ImgCutter ref="imgCutterModal" label="点击上传" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="775" :boxHeight="458"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="rate"
                         WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff" :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownEnterpriseLogo"
              >
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open">上传</el-button>
              </ImgCutter>
              <el-input v-model="addForm.headPhoto" v-show="false"/>
              <el-image v-if="addForm.headPhoto" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="addForm.headPhoto"
                        :preview-src-list="[addForm.headPhoto]"
              >
              </el-image>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="营业执照" prop="idCardZm" v-if="addForm.userType == 2">
              <ImgCutter ref="imgCutterModal" label="点击上传" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="775" :boxHeight="458"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="rate"
                         WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff" :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownLicenseImg"
              >
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open">上传</el-button>
              </ImgCutter>
              <el-input v-model="addForm.idCardZm" v-show="false"/>
              <el-image v-if="addForm.idCardZm" style="max-width: 100px;max-height: 100px" :z-index="2200"
                        :src="addForm.idCardZm"
                        :preview-src-list="[addForm.idCardZm]"
              >
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer-but">
        <el-button @click="addopen = false">取 消</el-button>
        <el-button type="primary" @click="submitUserInfo">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import {
  addEyUsers,
  auditContContents,
  changeUserStatus,
  delEyUsers,
  exportEyUsers,
  GetAccountCompany,
  GetCity,
  GetExcelUrl,
  getEyUsers,
  GetTrade,
  imgBase64Upload,
  listChannelEyUsers,
  resetPassword,
  updateEyUsers,
  importUserData,
  fileUpload,
  importComponyData
} from '@/api/base/eyUsers'
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
        phonenumber: undefined,
        nickName: undefined,
        sex: undefined,
        detailAddr: undefined,
        idCard: undefined,
        idCardZm: undefined,
        idCardFm: undefined,
        userType: undefined,
        status: undefined,
        audit: undefined,
        deptId: undefined
      },
      // 新增用户
      addForm: {

        sex: '',
        email: '',
        companyId: '',//所属单位
        avatar: '',//用户头像
        idCardFm: '',
        tradeId: '',

        idCard: '',
        idCardZm: '',
        userType: '1',
        // userName:"",
        phonenumber: '',
        password: '',
        nickName: '',
        // region:"",

        province: '',//省份
        city: '',//市
        area: '',//区/县

        // 企业信息字段：
        companyLegalPerson: '',
        headPhoto: '',
        isSup: undefined
      },
      // 新增用户表单校验
      addRules: {
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        phonenumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位数的手机号', trigger: 'blur' },
          {
            required: true,
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入账户密码', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },

      // 表单参数
      form: {
        userName: '',
        password: ''
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名/登录名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      // 图片比例
      rate: '16:9',
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
      earaValue: ''//省市区选中数据
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
      this.auditOptions = response.data
    })
    this.getDeptTreeselect()
    this.getExcelUrl()
  },
  methods: {
    // 用户上传身份头像压缩包
    fileUpload(file) {
      this.imageUploadStatus = '上传中...'
      fileUpload(file, '1').then(res => {
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
    /**
     * 上传二寸照
     * @param {Object} res
     */
    cutDownAvatar(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.addForm.avatar = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },
    /**
     * 上传身份证人像面图片
     * @param {Object} res
     */
    cutDownIdCardZm(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.addForm.idCardZm = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },
    /**
     * 上传身份证国徽面图片
     * @param {Object} res
     */
    cutDownIdCardFm(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.addForm.idCardFm = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },

    // 企业单位logo上传
    cutDownEnterpriseLogo(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.addForm.headPhoto = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },
    // 企业单位营业执照上传
    cutDownLicenseImg(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.addForm.idCardZm = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },

    /**
     * 身份证反面上传
     * @param res
     */
    cutDownSubject1: function(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.idCardFm = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },
    /**
     * 身份证正面上传
     * @param res
     */
    cutDownSubject2: function(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.idCardZm = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },

    /**
     * 用户头像上传
     * @param res
     */
    cutDownSubject3: function(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.avatar = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },

    /**
     * 营业执照上传
     * @param res
     */
    cutDownSubject4: function(res) {
      imgBase64Upload(res.dataURL).then(res => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.idCardZm = res.url
        } else {
          this.$message.error('上传图片异常')
        }
      })
    },

    /** 查询工匠用户列表 */
    getList() {
      this.loading = true
      listChannelEyUsers(this.queryParams).then(response => {
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
        userId: undefined,
        userName: undefined,
        password: undefined,
        avatar: undefined,
        phonenumber: undefined,
        email: undefined,
        nickName: undefined,
        sex: 2,
        region: undefined,
        detailAddr: undefined,
        idCard: undefined,
        idCardZm: undefined,
        idCardFm: undefined,
        commitment: undefined,
        userType: '1',
        deleteFlag: undefined,
        status: undefined,
        audit: undefined,
        auditCause: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        isSup: undefined
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
      this.ids = selection.map(item => item.userId)//所有的表格id
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.addopen = true
      this.auTitle = '新增用户'

      this.getCity()
      this.getTrade()
      this.GetAccountCompany()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.auTitle = '修改用户'
      this.editButton = true
      const userId = row.userId || this.ids
      this.getCity()
      this.getTrade()
      this.GetAccountCompany()
      getEyUsers(userId).then(response => {
        this.addForm = response.data
        this.addopen = true
      })
    },
    /** 审核按钮操作 */
    handleAudit(row) {
      this.reset()
      this.editButton = false
      const userId = row.userId || this.ids
      getEyUsers(userId).then(response => {
        this.form = response.data
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
          // 验证邮箱
          let email = this.addForm.email
          if (email != null && email != '' && !checkEmail(email)) {
            this.$message.error('邮箱格式不正确')
            this.$refs.email.focus()
            return false
          }
          // 验证身份证
          let idCard = this.addForm.idCard
          if (idCard != null && idCard != '' && this.addForm.userType == 1) {
            if (!SFID(idCard)) {
              this.$message.error('身份证格式不正确')
              this.addForm.sex = 2
              this.$refs.idCard.focus()
              return false
            } else {
              if (parseInt(idCard.substr(16, 1)) % 2 == 1) {
                this.addForm.sex = 0
              } else {
                this.addForm.sex = 1
              }
            }
          }
          this.addForm.userId == null ? this.addEyUsersFun() : this.modifyEyUsers()
        } else {
          this.$message.error('请填入完整信息~')
          return false
        }
      })
    },
    // 新增
    addEyUsersFun() {
      // const formData = JSON.parse(JSON.stringify(this.addForm));
      const requestData = {}
      if (this.addForm.userType == 1) {
        requestData.nickName = this.addForm.nickName
        requestData.idCard = this.addForm.idCard
        requestData.sex = this.addForm.sex
        requestData.email = this.addForm.email
        requestData.companyId = this.addForm.companyId
        requestData.avatar = this.addForm.avatar
        requestData.idCardZm = this.addForm.idCardZm
        requestData.idCardFm = this.addForm.idCardFm
        requestData.userType = this.addForm.userType
        requestData.phonenumber = this.addForm.phonenumber
        requestData.password = this.addForm.password
        // 省市区id
        requestData.province = this.addForm.province
        requestData.city = this.addForm.city
        requestData.area = this.addForm.area
        requestData.tradeId = this.addForm.tradeId
      } else if (this.addForm.userType == 2) {
        requestData.companyLegalPerson = this.addForm.companyLegalPerson
        requestData.idCard = this.addForm.idCard
        requestData.nickName = this.addForm.nickName
        requestData.region = this.addForm.region
        requestData.idCardZm = this.addForm.idCardZm
        requestData.password = this.addForm.password
        requestData.headPhoto = this.addForm.headPhoto
        requestData.userType = this.addForm.userType
        // 省市区id
        requestData.province = this.addForm.province
        requestData.city = this.addForm.city
        requestData.area = this.addForm.area
        requestData.phonenumber = this.addForm.phonenumber
        requestData.tradeId = this.addForm.tradeId
      }
      // return
      addEyUsers(requestData).then(response => {
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
      const requestData = {}
      requestData.userId = this.addForm.userId
      // 省市区id
      requestData.province = this.addForm.province
      requestData.city = this.addForm.city
      requestData.area = this.addForm.area
      requestData.isSup = this.addForm.isSup
      if (this.addForm.userType == 1) {
        requestData.nickName = this.addForm.nickName
        requestData.idCard = this.addForm.idCard
        requestData.sex = this.addForm.sex
        requestData.email = this.addForm.email
        requestData.companyId = this.addForm.companyId
        requestData.avatar = this.addForm.avatar
        requestData.idCardZm = this.addForm.idCardZm
        requestData.idCardFm = this.addForm.idCardFm
        requestData.userType = this.addForm.userType
        requestData.phonenumber = this.addForm.phonenumber
        requestData.region = this.addForm.region
        requestData.tradeId = this.addForm.tradeId
      } else if (this.addForm.userType == 2) {
        requestData.companyLegalPerson = this.addForm.companyLegalPerson
        requestData.idCard = this.addForm.idCard
        requestData.nickName = this.addForm.nickName
        requestData.region = this.addForm.region
        requestData.idCardZm = this.addForm.idCardZm
        requestData.headPhoto = this.addForm.headPhoto
        requestData.userType = this.addForm.userType
        requestData.phonenumber = this.addForm.phonenumber
        requestData.tradeId = this.addForm.tradeId
      }
      const requestDataDetail = JSON.parse(JSON.stringify(requestData))
      updateEyUsers(requestDataDetail).then(response => {
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
            addEyUsers(this.form).then(response => {
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
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.userId, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },

    /** 审核按钮 */
    auditForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            auditContContents(this.form).then(response => {
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

    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids
      this.$confirm('是否确认删除工匠用户编号为"' + userIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delEyUsers(userIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有工匠用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportEyUsers(queryParams)
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
     * 上传文件:批量学员
     */
    async httpRequestUser(params) {
      this.userUploadStatus = '上传中...'
      // 上传文件获取url 地址
      let fileUrl = ''
      await fileUpload2(params).then(response => {
        fileUrl = response.url
      })

      // 获取url地址后再讲文件传给后端
      const requestData = {
        url: fileUrl,
        userType: '1',
        excel: true
      }
      importUserData(requestData).then(response => {
        if (response.data == 200) {
          this.userUploadStatus = '上传成功'
          this.$message.success('学员批量文件上传成功~')
        } else {
          this.userUploadStatus = '上传失败'
          this.download(response.msg)
          this.$message.error('上传数据有误，请将数据修改后重新上传！')
        }
      }).catch(res => {
        this.userUploadStatus = '上传失败'
      })
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
    /**获取账号单位数据 */
    GetAccountCompany() {
      GetAccountCompany().then(response => {
        if (response.code == 200) {
          this.companyList = response.data
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
    // 文件状态改变时的钩子
    // fileChange(file, fileList) {
    //   this.length=1;
    //   // console.log(file.raw);
    //   // // this.fileList.push(file.raw);
    //   // console.log(this.fileList,this.length);
    // },
    // // 文件超出个数限制时的钩子
    // exceedFile(files, fileList) {
    //   this.$message.warning(
    //     `只能选择 1 个文件，当前共选择了 1个`
    //   );
    // },
    // 文件上传成功时的钩子
    // handleSuccess(file, fileList) {
    //   this.$message.success("文件上传成功");
    // },

    // // 文件上传失败时的钩子
    // handleError(err, file, fileList) {
    //   this.$message.error("文件上传失败");
    //   this.isBtn = false;
    // }
  }
}
</script>
<style>
.hint {
  color: red;
  font-size: 12px;
}
</style>
