<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="关键词" prop="keywordStr">
        <el-input
          style="width: 250px"
          v-model="queryParams.keywordStr"
          placeholder="标题/作者/文章类型/审核人/发布人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="audit">
        <el-select
          v-model="queryParams.audit"
          placeholder="请选择"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="dict in auditOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="dateRangeAuditTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-date-picker
          v-model="dateRangeCreateDate"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['content:contContents:add']"
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
          v-hasPermi="['content:contContents:edit']"
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
          v-hasPermi="['content:contContents:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['content:contContents:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="putawayBatch()"
          v-hasPermi="['content:contContents:putaway']"
          >上架</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-sold-out"
          size="mini"
          :disabled="multiple"
          @click="soldOutBatch()"
          v-hasPermi="['content:contContents:soldout']"
          >下架</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      width="100%"
      :row-key="(row) => row.id"
      :data="contContentsList"
      @selection-change="handleSelectionChange"
      ref="articleTable"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55"
        align="center"
      />
      <el-table-column label="ID" align="center" prop="id" sortable fixed />
      <el-table-column
        label="标题"
        header-align="center"
        prop="title"
        width="430"
        :show-overflow-tooltip="true"
        fixed
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleDetailsAudit(scope.row)"
            >{{ scope.row.title }}</el-button
          >
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否外链" align="center" prop="isLink" :formatter="isLinkFormat" /> -->
      <!-- <el-table-column label="作者" align="center" prop="author" :show-overflow-tooltip="true"/> -->
      <el-table-column
        label="文章类型"
        align="center"
        prop="category.name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="来源"
        align="center"
        prop="source"
        :formatter="sourceFormat"
      />
      <el-table-column
        prop="isRecommend"
        label="是否推荐"
        :formatter="recommendFormat"
        align="center"
        width="100"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="审核状态" align="center" prop="audit" :formatter="auditFormat" /> -->
      <!-- <el-table-column label="审核人" align="center" prop="auditPeople" :show-overflow-tooltip="true"/> -->
      <!-- <el-table-column label="审核时间" align="center" prop="auditTime" width="180" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime)}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="审核备注" align="center" prop="auditCause" :show-overflow-tooltip="true"/> -->
      <!-- <el-table-column label="发布状态" align="center" prop="publishStatus" :formatter="publishStatusFormat" :show-overflow-tooltip="true" /> -->
      <!-- <el-table-column label="发布人" align="center" prop="publisher":show-overflow-tooltip="true" /> -->
      <el-table-column
        label="发布时间"
        align="center"
        prop="createDate"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="浏览量"
        align="center"
        prop="click"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="收藏量" align="center" prop="collect" :show-overflow-tooltip="true"/> -->
      <!-- <el-table-column label="点赞量" align="center" prop="zan" :show-overflow-tooltip="true"/> -->
      <el-table-column
        label="文章状态"
        align="center"
        prop="publishStatus"
        :formatter="publishStatusFormat"
      />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="250"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.publishStatus == '1'"
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="putawayClick(scope.row.id)"
            v-hasPermi="['content:contContents:putaway']"
            >上架</el-button
          >
          <el-button
            v-show="scope.row.publishStatus == '0'"
            size="mini"
            type="text"
            icon="el-icon-sold-out"
            @click="soldOutClick(scope.row.id)"
            v-hasPermi="['content:contContents:soldout']"
            >下架</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="previewDetails(scope.row.id)"
            v-hasPermi="['content:contContents:edit']"
            >预览</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['content:contContents:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['content:contContents:remove']"
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

    <!-- 添加或修改文章对话框 -->
    <el-dialog
      :before-close="cancel"
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="70%"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="摘要" prop="summary">
              <el-input
                v-model="form.summary"
                type="textarea"
                placeholder="请输入摘要"
                rows="3"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="文章类型" prop="categoryId">
              <el-select
                v-model="form.categoryId"
                @change="change()"
                placeholder="请选择文章类型"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.categoryId"
                  :label="item.name"
                  :value="item.categoryId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发布时间" prop="createDate">
              <el-date-picker
                clearable
                size="small"
                style="width: 200px"
                v-model="form.createDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="发布时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="文章状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="是否外链" prop="isLink">
              <el-select v-model="form.isLink" placeholder="请选择是否外链">
                <el-option
                  v-for="dict in isLinkOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="是否推荐">
              <el-radio-group v-model="form.isRecommend">
                <el-radio
                  v-for="dict in isRecommendOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="外链接" prop="link">
              <el-input v-model="form.link" placeholder="请输入链接" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-select v-model="form.source" placeholder="请选择来源">
                <el-option
                  v-for="dict in sourceOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="来源网站" prop="sourceWebsite">
              <el-input
                v-model="form.sourceWebsite"
                placeholder="请输入来源网站"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="文章封面" prop="imageUrl">
              <ImgCutter
                ref="imgCutterModal"
                label="点击上传"
                :crossOrigin="true"
                crossOriginHeader="*"
                toolBgc="none"
                :isModal="true"
                :showChooseBtn="true"
                :lockScroll="false"
                :boxWidth="775"
                :boxHeight="458"
                :cutWidth="250"
                :cutHeight="250"
                :sizeChange="true"
                :moveAble="true"
                :originalGraph="false"
                :tool="false"
                :rate="rate"
                WatermarkText="大湾区职训网"
                WatermarkTextFont="12px Sans-serif"
                WatermarkTextColor="#fff"
                :WatermarkTextX="0.95"
                :WatermarkTextY="0.95"
                :DoNotDisplayCopyright="true"
                @cutDown="cutDown"
              >
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-upload"
                  slot="open"
                  @click="oneTOone"
                  >上传(比例1:1)</el-button
                >-->
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-upload"
                  slot="open"
                  @click="sixtTOnine"
                  >上传(比例16:9)</el-button
                >-->
              </ImgCutter>
              <el-image
                v-if="form.imageUrl != null && form.imageUrl != ''"
                style="max-width: 80px; max-height: 80px"
                :z-index="2100"
                :src="form.imageUrl"
                :preview-src-list="[form.imageUrl]"
              >
              </el-image>
              <el-input v-model="form.imageUrl" v-show="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示封面">
              <el-select v-model="form.isShowImg" placeholder="请选择是否">
                <el-option
                  v-for="dict in isShowImgOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <Editor id="contentEditor" v-model="form.content"/>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <EditorTow
                id="contentEditor"
                v-if="open"
                v-model="form.content"
              />
              <!-- <Kindeditor
                v-if="form.title"
                id="editor_id"
                height="500px"
                width="100%"
                :content.sync="editorText"
                :loadStyleMode="false"
                @on-content-change="onContentChange"
              ></Kindeditor> -->
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24" style="margin-top: 40px" v-if="editButton==false">
            <el-form-item label="审核内容">
              <el-input v-model="form.auditCause" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="editButton"
          >确 定</el-button
        >

        <!-- <el-sl-panel v-if="form.status==0 && opeAudit">
          <el-sl-panel v-if="form.audit==0">
            <el-button type="primary" @click="auditForm(1)">审核通过</el-button>
            <el-button type="danger" @click="auditForm(2)">审核不通过</el-button>
          </el-sl-panel>
          <el-button type="primary" @click="auditForm(1)"  v-if="form.audit==2">审核通过</el-button>
          <el-button type="danger" @click="auditForm(2)"  v-if="form.audit==1">审核不通过</el-button>
        </el-sl-panel> -->

        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  imgUpload,
  imgBase64Upload,
  listContContents,
  getContContents,
  delContContents,
  getCategorys,
  publishContContents,
  addContContents,
  updateContContents,
  auditContContents,
  exportContContents,
  addDateRange,
  putaway,
  soldOut,
} from "@/api/content/contContents";
import { getUserProfile } from "@/api/system/user";
import Editor from "@/components/Editor";
import EditorTow from "@/components/Tinymce";
import Kindeditor from "@/components/Kindeditor";
// import { treeselect } from "@/api/content/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ImgCutter from "vue-img-cutter";

export default {
  name: "ContContents",
  components: { Treeselect, Editor, ImgCutter, EditorTow, Kindeditor },
  data() {
    return {
      editorText: "", // 双向同步的变量
      // 编辑保存按钮是否显示
      editButton: true,
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
      // 文章表格数据
      contContentsList: [],
      // 文章是否推荐
      isRecommendOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 审核内容判断显示
      opeAudit: false,
      // 截图比例
      rate: "16:9",
      // 是否外链(0=否，1=是)字典
      isLinkOptions: [],
      // 是否显示图片(0：否，1：是）字典
      isShowImgOptions: [],
      // 来源(0：原创，1：网络，2：转载)字典
      sourceOptions: [],
      // 状态(0:正常，1：草稿)字典
      statusOptions: [],
      // 删除标志字典
      deleteFlagOptions: [],
      // 0-未审核   1-审核通过  2-审核不通过字典
      auditOptions: [],
      // 发布状态
      publishStatusOptions: [],
      // 文章分类选项
      categoryOptions: undefined,
      // 审核时间日期范围
      dateRangeAuditTime: [],
      // 发布日期日期范围
      dateRangeCreateDate: [],
      //上线/下线文本信息
      publishText: undefined,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryName: undefined,
        title: undefined,
        isLink: undefined,
        author: undefined,
        source: undefined,
        status: undefined,
        audit: undefined,
        auditPeople: undefined,
        auditTime: undefined,
        createDate: undefined,
        publisher: undefined,
        keywordStr: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        summary: [{ required: true, message: "摘要不能为空", trigger: "blur" }],
        isLink: [
          { required: true, message: "是否外链不能为空", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "文章类型不能为空", trigger: "blur" },
        ],
        author: [{ required: true, message: "作者不能为空", trigger: "blur" }],
        source: [{ required: true, message: "来源不能为空", trigger: "blur" }],
        createDate: [
          { required: true, message: "发布时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("is_link").then((response) => {
      this.isLinkOptions = response.data;
    });
    this.getDicts("cust_yes_no").then((response) => {
      this.isShowImgOptions = response.data;
    });
    this.getDicts("source_options").then((response) => {
      this.sourceOptions = response.data;
    });
    this.getDicts("putway_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_delete_status").then((response) => {
      this.deleteFlagOptions = response.data;
    });
    this.getDicts("audit_content_status").then((response) => {
      this.auditOptions = response.data;
    });
    this.getDicts("publish_status").then((response) => {
      this.publishStatusOptions = response.data;
    });
    this.getDicts("short_isrecommend").then((response) => {
      this.isRecommendOptions = response.data;
    });

    this.getCategorysList();
  },
  methods: {
    onContentChange(val) {
      // console.log(val);
      this.editorText = val;
      this.form.content = val;
      this.$forceUpdate();
    },
    /** 查询文章列表 */
    getList() {
      this.loading = true;
      listContContents(
        addDateRange(
          this.queryParams,
          this.dateRangeAuditTime,
          this.dateRangeCreateDate
        )
      ).then((response) => {
        this.contContentsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 获取文章分类列表 */
    getCategorysList() {
      getCategorys().then((response) => {
        this.categoryOptions = response.data;
      });
    },
    /** 以前版本(查询分类下拉树结构) */
    getTreeselect() {
      // treeselect().then(response => {
      //   this.categoryOptions = response.data;
      // });
    },
    // 是否外链(0=否，1=是)字典翻译
    isLinkFormat(row, column) {
      return this.selectDictLabel(this.isLinkOptions, row.isLink);
    },
    // 是否显示图片(0：否，1：是）字典翻译
    isShowImgFormat(row, column) {
      return this.selectDictLabel(this.isShowImgOptions, row.isShowImg);
    },
    // 来源(0：原创，1：网络，2：转载)字典翻译
    sourceFormat(row, column) {
      return this.selectDictLabel(this.sourceOptions, row.source);
    },
    // 状态(0:正常，1：草稿)字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 删除标志字典翻译
    deleteFlagFormat(row, column) {
      return this.selectDictLabel(this.deleteFlagOptions, row.deleteFlag);
    },
    // 0-未审核   1-审核通过  2-审核不通过字典翻译
    auditFormat(row, column) {
      return this.selectDictLabel(this.auditOptions, row.audit);
    },
    // 发布状态
    publishStatusFormat(row, column) {
      return this.selectDictLabel(this.publishStatusOptions, row.publishStatus);
    },
    change() {
      this.$forceUpdate();
    },
    // 取消按钮
    cancel() {
      this.editorText = "";
      this.form.content = null;
      this.open = false;
      this.opeAudit = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        categoryId: undefined,
        title: undefined,
        summary: undefined,
        keyword: undefined,
        content: undefined,
        isLink: "0",
        link: undefined,
        imageUrl: undefined,
        isShowImg: "0",
        author: undefined,
        source: "0",
        sourceWebsite: undefined,
        sourceUrl: undefined,
        click: undefined,
        collect: undefined,
        zan: undefined,
        status: "0",
        deleteFlag: undefined,
        audit: undefined,
        attachment: undefined,
        auditPeople: undefined,
        auditTime: undefined,
        auditCause: undefined,
        createDate: undefined,
        publisher: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
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
      this.dateRangeAuditTime = [];
      this.dateRangeCreateDate = [];
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
      this.editButton = true;
      getUserProfile().then((response) => {
        this.form.author = response.data.userName;
      });
      this.open = true;
      this.opeAudit = false;
      this.title = "添加文章";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.editButton = true;
      const id = row.id || this.ids;
      getContContents(id).then((response) => {
        this.form = response.data;
        this.editorText = this.form.content;
        this.open = true;
        this.opeAudit = false;
        this.title = "修改文章";
      });
    },

    /** 详情或审核按钮操作 */
    handleDetailsAudit(row) {
      this.reset();
      this.editButton = false;
      const id = row.id || this.ids;
      getContContents(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.opeAudit = true;
        this.title = "审核文章";
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateContContents(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addContContents(this.form).then((response) => {
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
    /** 审核按钮 */
    auditForm: function (type) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (type == 1) this.form.audit = 1; //审核不通过
          if (type == 2) this.form.audit = 2; //审核通过
          if (this.form.id != undefined) {
            auditContContents(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("审核成功");
                this.opeAudit = false;
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

    //字典推荐翻译
    recommendFormat(row, column) {
      return this.selectDictLabel(this.isRecommendOptions, row.isRecommend);
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除文章编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delContContents(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },

    /**
     * 单个上架
     * @param {Object} id
     */
    putawayClick(id) {
      this.ids = [id];
      this.putawayBatch();
    },
    /**
     * 批量上架
     */
    putawayBatch() {
      const ids = this.ids;
      this.$confirm('是否确认[上架]文章编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return putaway(ids);
        })
        .then(() => {
          this.getList();
          this.$refs.articleTable.clearSelection();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },
    /**
     * 单个下架
     * @param {Object} id
     */
    soldOutClick(id) {
      this.ids = [id];
      this.soldOutBatch();
    },

    /**
     * 批量下架
     */
    soldOutBatch() {
      const ids = this.ids;
      this.$confirm('是否确认[下架]文章编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return soldOut(ids);
        })
        .then(() => {
          this.getList();
          this.$refs.articleTable.clearSelection();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },

    /**上线/下线按钮操作 */
    handlePublish(type) {
      if (type == 0) this.publishText = "上线";
      if (type == 1) this.publishText = "下线";
      const ids = this.ids;
      this.$confirm(
        "是否确认[" + this.publishText + ']文章编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return publishContContents(ids, type);
        })
        .then(() => {
          this.getList();
          this.$refs.articleTable.clearSelection();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有文章数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportContContents(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },

    // 入参一定要添加file默认参数
    imgUpload(file) {
      //上传短视频图片
      imgUpload(file).then((res) => {
        //alert(JSON.stringify(res));
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.imageUrl = res.fileName;
          //alert(this.form.logo);
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },

    /**上传图片前的校验 */
    imgforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 5;
      if (!isRightSize) {
        this.$message.error("文件大小超过 5MB");
      }
      let isAccept = new RegExp("image/*").test(file.type);
      if (!isAccept) {
        this.$message.error("应该选择image/*类型的文件");
      }
      return isRightSize && isAccept;
    },

    /**上传(比例1:1) */
    oneTOone: function (res) {
      this.rate = "1:1";
    },

    /**上传(比例16:9) */
    sixtTOnine: function (res) {
      this.rate = "16:9";
    },

    /** 截图确定按钮事件 */
    cutDown: function (res) {
      imgBase64Upload(res.dataURL).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.imageUrl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },

    /** 详情预览 */
    previewDetails(row) {
      const domain = this.$store.state.user.tenantUrl;
      let url;
      if (domain) {
        url = "https://" + domain + "/news/detail?id=" + row + "&sign=1";
      } else {
        url = "https://www.bbazxw.com/news/detail?id=" + row + "&sign=1";
      }
      // var url = 'https://pxht.bbazxw.com/news/detail?id=' + row + '&sign=1';
      window.open(url);
    },
  },
};
</script>

<style>
#contentEditor .editor {
  line-height: normal !important;
  height: 342px;
}
</style>
