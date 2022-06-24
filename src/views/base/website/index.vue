<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item label="归属部门" prop="deptId" v-hasRole="['admin']">
        <treeselect
          v-model="queryParams.deptId"
          :options="sxdeptOptions"
          placeholder="请选择归属部门"
          style="width: 240px"
        />
      </el-form-item> -->
      <el-form-item label="网站名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入网站名称"
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['base:website:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['base:website:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['base:website:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:website:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :data="websiteList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column
        label="网站名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="网站logo"
        align="center"
        prop="logo"
        :show-overflow-tooltip="true"
      >
        <!-- 显示图片-->
        <template slot-scope="scope">
          <el-image
            style="max-width: 20px; max-height: 20px"
            :src="scope.row.logo"
            :preview-src-list="[scope.row.logo]"
          >
          </el-image>
        </template>
      </el-table-column>
      <!-- <p>修改代码-======================</p> -->
      <el-table-column
        label="底部logo"
        align="center"
        prop="downlogo"
        :show-overflow-tooltip="true"
      >
      <!-- <显示图片> -->
        <template slot-scope="scope">
          <el-image
            style="max-width: 20px; max-height: 20px"
            :src="scope.row.downlogo"
            :preview-src-list="[scope.row.downlogo]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="咨询二维码"
        align="center"
        prop="qrcode"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-image
            style="max-width: 20px; max-height: 20px"
            :src="scope.row.qrcode"
            :preview-src-list="[scope.row.qrcode]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="关注二维码"
        align="center"
        prop="qrcode1"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-image
            style="max-width: 20px; max-height: 20px"
            :src="scope.row.qrcode1"
            :preview-src-list="[scope.row.qrcode1]"
          >
          </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="网站顶部图片"
        align="center"
        prop="upurl"
        :show-overflow-tooltip="true"
      >

        <template slot-scope="scope">
          <el-image
            style="max-width: 20px; max-height: 20px"
            :src="scope.row.upurl"
            :preview-src-list="[scope.row.upurl]"
          >
          </el-image>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="网站底部图片"
        align="center"
        prop="downurl"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-image
            style="max-width: 20px; max-height: 20px"
            :src="scope.row.downurl"
            :preview-src-list="[scope.row.downurl]"
          >
          </el-image>
        </template>
      </el-table-column> -->
      <el-table-column
        label="ICP备案号"
        align="center"
        prop="icp"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="公网安备"
        align="center"
        prop="prepar"
        :show-overflow-tooltip="true"
      />

      <el-table-column
        label="其他信息"
        align="center"
        prop="other"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column
        label="主办单位"
        align="center"
        prop="sponsor"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column
        label="公司地址"
        align="center"
        prop="address"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="版权信息"
        align="center"
        prop="copyright"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="联系电话"
        align="center"
        prop="phone"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleStatusChange(scope.row)"
            >启用</el-button
          >
          <el-button v-else-if="scope.row.status == 1" size="mini" type="text"
            >已启用</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:website:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:website:remove']"
            >删除</el-button
          >
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

    <!-- 添加或修改网站基本信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="网站名称" prop="name">
              <el-input
                v-model="form.name"
                maxlength="40"
                show-word-limit
                placeholder="请输入网站名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网站标题" prop="title">
              <el-input v-model="form.title" placeholder="网站标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ICP备案号" prop="icp">
              <el-input v-model="form.icp" placeholder="请输入ICP备案号" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="公网安备" prop="prepar">
              <el-input v-model="form.prepar" placeholder="公网安备如: 粤公安备20034267样例号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他信息" prop="other">
              <el-input v-model="form.other" placeholder="请输入其他信息" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系时间" prop="working">
              <el-input
                v-model="form.working"
                placeholder="请输入联系时间 如: 工作日 9:00-17:30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入公司地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="版权" prop="copyright">
              <el-input
                v-model="form.copyright"
                placeholder="版权信息如: Copyright © 2020 -2021 广东粤为科技有限公司 All Rights Reserved"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <div style="color: red; margin-left: 10px">
              <span>尺寸建议为32px*32px</span>
            </div>
            <el-form-item label="网站icon" prop="icon">
              <el-upload
                ref="icon"
                :show-file-list="false"
                action=""
                :http-request="fileUploadIcon"
                :auto-upload="true"
                list-type="picture"
                accept="image/*"
                name="logo_file"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传</el-button
                >
                <!--<div slot="tip" class="el-upload__tip">只能上传不超过 5MB 的image/*文件</div>-->
              </el-upload>
              <el-input v-model="form.icon" v-show="false" />
              <el-image
                v-show="form.icon != null && form.icon != ''"
                :z-index="2100"
                ref="iconImg"
                style="max-width: 100px; max-height: 100px"
                :src="form.icon"
                :preview-src-list="[form.icon]"
              >
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div style="color: red; margin-left: 10px">
              <span>网站首页LOGO尺寸建议为228px*54px</span>
            </div>
            <el-form-item label="网站首页logo" prop="logo" class="lo-go">
              <el-upload
                ref="logo"
                :show-file-list="false"
                action=""
                :http-request="fileUploadLogo"
                :auto-upload="true"
                list-type="picture"
                accept="image/*"
                name="logo_file"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传</el-button
                >
                <!--            <div slot="tip" class="el-upload__tip">只能上传不超过 5MB 的image/*文件</div>-->
              </el-upload>
              <el-input v-model="form.logo" v-show="false" />
              <el-image
                v-show="form.logo != null && form.logo != ''"
                :z-index="2100"
                style="max-width: 100px; max-height: 100px"
                :src="form.logo"
                :preview-src-list="[form.logo]"
              >
              </el-image>
            </el-form-item>
          </el-col>






           <el-col :span="24">
            <div style="color: red; margin-left: 10px">
              <span>网站内页LOGO尺寸建议为228px*54px</span>
            </div>
            <el-form-item label="网站内页logo" prop="downlogo" class="lo-go">

              <el-upload
                ref="downlogo"
                :show-file-list="false"
                action=""
                :http-request="fileUploaddownLogo"
                :auto-upload="true"
                list-type="picture"
                accept="image/*"
                name="logo_file"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传</el-button
                >
                <!--            <div slot="tip" class="el-upload__tip">只能上传不超过 5MB 的image/*文件</div>-->
              </el-upload>
              <el-input v-model="form.logo" v-show="false" />
              <el-image
               v-show="form.downlogo != null && form.downlogo != ''"
                :z-index="2100"
                style="max-width: 100px; max-height: 100px"
                :src="form.downlogo"
                :preview-src-list="[form.downlogo]"
              >
              </el-image>
            </el-form-item>
          </el-col>
          <!-- el-col :span="24">
            <el-form-item label="咨询我们" prop="qrcode">
              <el-upload
                ref="twoDimensionalCodeOne"
                :show-file-list="false"
                action=""
                :http-request="fileUploadQrcode"
                :on-change="twoDimensionalCodeUpdateOne"
                :auto-upload="true"
                list-type="picture"
                accept="image/*"
                name="qrcode_file"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传(咨询二维码)</el-button
                >
              </el-upload>
              <el-input v-model="form.qrcode" v-show="false" />
              <el-image v-if="form.qrcode!=null && form.qrcode!=''" :z-index="2100"
                        style="max-width: 100px;max-height: 100px"
                        :src="form.qrcode" :preview-src-list="[form.qrcode]">
              </el-image>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关注我们" prop="qrcode1">
              <el-upload
                ref="twoDimensionalCodeTwo"
                :show-file-list="false"
                action=""
                :http-request="fileUploadQrcode1"
                :on-change="twoDimensionalCodeUpdateTwo"
                :auto-upload="true"
                list-type="picture"
                accept="image/*"
                name="qrcode1_file"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传(关注二维码)</el-button>
              </el-upload>
              <el-input v-model="form.qrcode1" v-show="false" />
              <el-image v-if="form.qrcode1!=null && form.qrcode1!=''" :z-index="2100"
                        style="max-width: 100px;max-height: 100px"
                        :src="form.qrcode1" :preview-src-list="[form.qrcode1]">
              </el-image>
            </el-form-item>
          </el-col>

          <el-col :span="17">
            <el-form-item label="报名表" prop="applyUrl">
              <el-input v-model="form.applyUrl" placeholder="请上传报名表文件" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 5px">
            <div>
              <div style="float: left">
                <el-upload ref="uploadApplyUrl" :file-list="fileList" action="" :http-request="fileApplyUpload"
                           :before-upload="fileApplyBeforeUpload" :limit="1" :auto-upload="true"
                           >
                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                </el-upload>
              </div>
            </div>
          </el-col -->

          <!-- <el-col :span="12">
            <el-form-item label="网站顶部图片" prop="upurl">
              <el-upload
                ref="logo"
                :file-list="upurlfileList"
                action=""
                :http-request="fileUploadUpUrl"
                :limit="1"
                :auto-upload="true"
                list-type="picture"
                accept="image/*"
                name="upurl_file"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
              <el-input v-model="form.upurl" v-show="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网站底部图片" prop="downurl">
              <el-upload
                ref="logo"
                :file-list="downurlfileList"
                action=""
                :http-request="fileUploadDownUrl"
                :limit="1"
                :auto-upload="true"
                list-type="picture"
                accept="image/*"
                name="downurl_file"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
              <el-input v-model="form.downurl" v-show="false" />
            </el-form-item>
          </el-col> -->
        </el-row>
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
  fileUpload,
  changeEnableStatus,
  listWebsite,
  getWebsite,
  delWebsite,
  addWebsite,
  updateWebsite,
  exportWebsite,
  fileAnyUpload,
} from "@/api/base/website";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import getImageInfo from "../../../utils/getimageinfo";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ImgCutter from "vue-img-cutter";

export default {
  name: "Website",
  components: { ImgCutter, Treeselect },
  data() {
    return {
      // 报名表文件
      fileList: [],
      logofileList: [],
      qrcodefileList: [],
      qrcode1fileList: [],
      upurlfileList: [],
      downurlfileList: [],
      // 部门列表
      sxdeptOptions: [],
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
      // 网站基本信息表格数据
      websiteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        slogan: undefined,
        detail: undefined,
        email: undefined,
        phone: undefined,
        logo: undefined,
        downlogo:undefined,
        qrcode: undefined,
        qrcode1: undefined,
        qrcodeName: undefined,
        qrcode1Name: undefined,
        upurl: undefined,
        downurl: undefined,
        copyright: undefined,
        icp: undefined,
        prepar: undefined,
        other: undefined,
        address: undefined,
        status: undefined,
      },
      // 表单参数
      form: {
        name: "",
        headerText: "",
        technical: "",
        icp: "",
        prepar: "",
        other: "",
        sponsor: "",
        address: "",
        logo: "",
        downlogo: "",
        qrcode: "",
        qrcode1: "",
        qrcodeName: "",
        qrcode1Name: "",
        upurl: "",
        downurl: "",
        working: "",
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "网站名称不能为空", trigger: "blur" },
        ],
        title: [
          { required: true, message: "网站标题不能为空", trigger: "blur" },
        ],
        ename: [
          { required: true, message: "网站英文名称不能为空", trigger: "blur" },
        ],
        slogan: [
          { required: true, message: "网站标语不能为空", trigger: "blur" },
        ],
        detail: [
          {
            required: true,
            message: "平台介绍不能为空",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" },
        ],
        superphone: [
          {
            required: true,
            message: "服务监督电话不能为空",
            trigger: "blur",
          },
        ],
        hotline: [
          {
            required: true,
            message: "全国服务热线不能为空",
            trigger: "blur",
          },
        ],
        // technical: [
        //   {
        //     required: true,
        //     message: "技术运营与支持商不能为空",
        //     trigger: "blur",
        //   },
        // ],
        // sponsor: [
        //   {
        //     required: true,
        //     message: "主办单位不能为空",
        //     trigger: "blur",
        //   },
        // ],
        copyright: [
          { required: true, message: "版权标识不能为空", trigger: "blur" },
        ],
        icp: [
          { required: true, message: "ICP备案号不能为空", trigger: "blur" },
        ],
        prepar: [
          { required: true, message: "公网安备不能为空", trigger: "blur" },
        ],
        other: [
          { required: true, message: "其他信息不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "公司地址不能为空", trigger: "blur" },
        ],
        icon: [
          { required: true, message: "请选择网站icon图片", trigger: "blur" },
        ],
        logo: [
          { required: true, message: "请选择网站首页logo图片", trigger: "blur" },
        ],
        downlogo: [
          { required: true, message: "请选择网站内页logo图片", trigger: "blur" },
        ],
        // qrcodeName: [
        //   { required: true, message: "二维码名称不能为空", trigger: "blur" },
        // ],
        // qrcode1Name: [
        //   { required: true, message: "教育网二维码名称不能为空", trigger: "blur" },
        // ],
        // qrcode1: [
        //   { required: true, message: "请上传咨询二维码", trigger: "blur" },
        // ],
        // qrcode: [
        //   { required: true, message: "请上传关注二维码", trigger: "blur" },
        // ],
        working: [
          { required: true, message: "请输入联系时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDeptTreeselect();
  },
  methods: {
    /** 上传报名文件, 入参一定要添加file默认参数 */
    fileApplyUpload(file) {
      fileAnyUpload(file).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.applyUrl = res.url;
          this.fileList = [];
        } else {
          this.$message.error("上传文件异常");
        }
      });
    },
    /*上传报名文件前校验*/
    fileApplyBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 20;
      if (!isRightSize) {
        this.$message.error("文件大小超过 20M");
      }
      // let isAccept = new RegExp('pdf/*').test(file.type)
      // if (!isAccept) {
      //   this.$message.error('应该选择pdf/*类型的文件')
      // }
      this.fileList = [];
      return isRightSize;
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then((response) => {
        this.sxdeptOptions = response.data;
      });
    },
    /** 图片路径格式化函数，因为数据库保存的是 类似/profile/upload/2020/05/26/ef75f2fa134f9c20693610acccfdcc50.jpg 不保存ip+和端口的，所以要从vue.config.js全局代理和配置对应的后端ip和端口*/
    /** 形成完整的url http://localhost:8080/profile/avatar/2020/05/25/85ca29fccc9387885e3dbae0de793a1c.jpeg*/
    formatterImg(imgUrl) {
      return process.env.VUE_APP_BASE_API + imgUrl;
    },
    // 配置启用状态修改,只会启用其中一组数据
    handleStatusChange(row) {
      //alert(JSON.stringify(row));
      this.$confirm("确认要启用这一组网站基本信息配置吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return changeEnableStatus(row.id);
        })
        .then(() => {
          this.msgSuccess("启用成功");
          this.getList();
        })
        .catch(function () {
          this.msgSuccess("启用失败");
        });
    },
    // 上传网站图标
    fileUploadIcon(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.icon = res.url;
          this.$forceUpdate();
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //上传logo图片
    fileUploadLogo(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.logo = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //上传底部logo图片
    fileUploaddownLogo(file) {

      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.$set(this.form,'downlogo',res.url)
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //上传二维码1
    fileUploadQrcode(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.qrcode = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //上传二维码二
    fileUploadQrcode1(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.qrcode1 = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //上传顶部图片
    fileUploadUpUrl(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.upurl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //上传底部图片
    fileUploadDownUrl(file) {
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.form.downurl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    // 上传图片校验公共方法
    /**
     * file 上传文件
     * resName 获取上传图片的dom节点名称
     * proportion 上传比例
     */
    updateImg(file, proportion, resName) {
      return getImageInfo(file, (info) => {
        const isRightSize = info.size / 1024 / 1024 < 5;
        const isAccept =
          info.raw.type == "image/jpeg" ||
          info.raw.type == "image/png" ||
          info.raw.type == "image/jpg";
        // const imageProportion = info.width / info.height == proportion;
        const bolid = this.$refs[resName];
        if (!isAccept) {
          this.$message.error("上传图片只能是JPG/JPEG/PNG格式");
          bolid.clearFiles();
          return false;
        }
        if (!isRightSize) {
          this.$message.error("文件大小超过 5MB");
          bolid.clearFiles();
          return false;
        }
        // if (imageProportion !== true) {
        //   this.$message.error("上传图片的比例不是" + proportion + "");
        //   bolid.clearFiles();
        //   return false;
        // }
      });
      return isRightSize && isAccept;
    },
    //第一个二维码上传验证
    twoDimensionalCodeUpdateOne(file, proportion, resName) {
      this.updateImg(
        file,
        (proportion = 1 / 1),
        (resName = "twoDimensionalCodeOne")
      );
    },
    //第二个二维码上传验证
    twoDimensionalCodeUpdateTwo(file, proportion, resName) {
      this.updateImg(
        file,
        (proportion = 1 / 1),
        (resName = "twoDimensionalCodeTwo")
      );
    },
    /** 查询网站基本信息列表 */
    getList() {
      this.loading = true;
      listWebsite(this.queryParams).then((response) => {
        this.websiteList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        email: undefined,
        phone: undefined,
        logo: undefined,
        downlogo: undefined,
        qrcode: undefined,
        qrcode1: undefined,
        upurl: undefined,
        downurl: undefined,
        copyright: undefined,
        icp: undefined,
        prepar: undefined,
        other: undefined,
        address: undefined,
        status: "0",
        qrcodeName: undefined,
        qrcode1Name: undefined,
        // 报名表文件路径
        applyUrl: undefined,
        working: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.logofileList = [];
      this.downlogofileList = [],
      this.qrcodefileList = [];
      this.qrcode1fileList = [];
      this.upurlfileList = [];
      this.downurlfileList = [];
      this.title = "添加网站基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getWebsite(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.logofileList = [
          {
            url: this.form.logo,
          },
        ];
        this.downlogofileList = [
          {
            url: this.form.downlogo,
          },
        ];
        this.qrcodefileList = [
          {
            url: this.form.qrcode,
          },
        ];
        this.qrcode1fileList = [
          {
            url: this.form.qrcode1,
          },
        ];
        this.upurlfileList = [
          {
            url: this.form.upurl,
          },
        ];
        this.downurlfileList = [
          {
            url: this.form.downurl,
          },
        ];

        this.title = "修改网站基本信息";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.form.id != undefined) {
            updateWebsite(this.form).then((response) => {
              console.log("this.form:", this.form);
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addWebsite(this.form).then((response) => {
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
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除网站基本信息编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delWebsite(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有网站基本信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportWebsite(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style>
body
  > div.el-dialog__wrapper
  > div
  > div.el-dialog__body
  > form
  > div
  > div:nth-child(7)
  > div
  > div
  > div:nth-child(1)
  > ul
  > li
  > img {
  width: 800px;
  height: 100px;
}
body
  > div.el-dialog__wrapper
  > div
  > div.el-dialog__body
  > form
  > div
  > div:nth-child(7)
  > div
  > div
  > div:nth-child(1)
  > ul
  > li {
  height: 120px;
}
</style>
