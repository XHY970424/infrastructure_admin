<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="试卷名称" prop="examName">
        <el-input
          v-model="queryParams.examName"
          placeholder="请输入试卷名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <treeselect
          v-model="queryParams.categoryId"
          :options="CategoryOptions"
          :normalizer="normalizers"
          placeholder="请选择分类"
          style="width: 250px"
        />
        <!--        @node-click="handleNodeClick"-->
        <!--        <el-tree :data="CategoryOptions" :props="defaultProps"></el-tree>-->
      </el-form-item>
      <el-form-item label="关联题库" prop="prefaceId">
        <el-select
          v-model="queryParams.prefaceId"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            v-for="item in prefaceOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抽题规则" prop="specificationId">
        <el-select
          v-model="queryParams.specificationId"
          filterable
          clearable
          placeholder="请选择抽题规则"
        >
          <el-option-group
            v-for="group in specificationOptions"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option label="下架" :value="0" />
          <el-option label="上架" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐" prop="isRecommend">
        <el-select
          v-model="queryParams.isRecommend"
          placeholder="是否推荐"
          clearable
          size="small"
        >
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="试卷标签" prop="tagId">
        <treeselect
          v-model="queryParams.tagId"
          :options="tagOptions"
          :normalizer="normalizer"
          placeholder="试卷标签"
          :disable-branch-nodes="true"
          style="width: 250px"
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
          v-hasPermi="['eycode:exampaper:add']"
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
          v-hasPermi="['eycode:exampaper:edit']"
          >修改</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:exampaper:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:exampaper:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="exampaperList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        fixed="left"
      />
      <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
      <el-table-column
        label="ID"
        align="center"
        prop="id"
        width="65"
        fixed="left"
      />
      <el-table-column
        label="排序"
        align="center"
        prop="sort"
        width="95"
        type="number"
        fixed="left"
      >
        <template slot-scope="scope">
          <el-input
            :min="0"
            type="number"
            v-model="scope.row.sort"
            @change="updateSort(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="试卷名称"
        align="center"
        prop="examName"
        fixed="left"
        width="160px"
      />
      <!-- <el-table-column label="封面图" align="center" prop="imgUrl" /> -->
      <el-table-column
        label="封面图"
        align="center"
        prop="imgUrl"
        :show-overflow-tooltip="true"
      >
        <!--显示图片-->
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover" width="40">
            <el-image
              slot="reference"
              style="max-width: 40px; max-height: 40px"
              :src="scope.row.imgUrl"
            />
            <el-image :src="scope.row.imgUrl"></el-image>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="关联的题库" align="center" prop="prefaceTitle" />
      <el-table-column label="抽题规则" align="center" prop="specificationId">
        <template slot-scope="scope">
          <span>{{ scope.row.specificationTitle }} /</span>
          <span v-if="scope.row.setQuestion == 0">随机组卷</span>
          <span v-if="scope.row.setQuestion == 1">手工组卷</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷分类名称" align="center" prop="testPaperName" />
      <el-table-column label="标签名" align="center" prop="tagName" />
      <!-- <el-table-column label="价格" align="center" prop="price" /> -->
      <el-table-column label="试卷总分" align="center" prop="score" />
      <el-table-column label="及格分数" align="center" prop="passScore" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">下架</span>
          <span v-if="scope.row.status == 1">上架</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template slot-scope="scope">
          <span v-if="scope.row.isRecommend == 0">不推荐</span>
          <span v-if="scope.row.isRecommend == 1">推荐</span>
        </template>
      </el-table-column>
      <el-table-column label="考试时间" align="center" prop="examTime" />
      <el-table-column label="使用天数" align="center" prop="useDays" />
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        class-name="small-padding fixed-width"
        width="150px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:exampaper:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:exampaper:remove']"
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

    <!-- 添加或修改新试卷对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="所属分类" prop="categoryId">
              <treeselect
                v-model="form.categoryId"
                :options="CategoryOptions"
                :normalizer="normalizers"
                placeholder="请选择分类"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button
              round
              size="mini"
              class="but"
              @click="categoryAdd"
              style="margin-top: 4px; margin-left: 5px"
              >新增分类</el-button
            >
          </el-col>
          <el-col :span="8">
            <el-form-item label="试卷名称" prop="examName">
              <el-input v-model="form.examName" placeholder="请输入试卷名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="form.sort" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <transition name="el-zoom-in-top">
              <el-form-item label="抽题规则" prop="specificationId">
                <el-select
                  v-model="form.specificationId"
                  filterable
                  clearable
                  placeholder="请选择抽题规则"
                >
                  <el-option-group
                    v-for="group in specificationOptions"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </transition>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="关联题库" prop="prefaceId">
              <el-select
                v-model="form.prefaceId"
                filterable
                @change="handleChangePreface"
                placeholder="请选择题库"
                clearable
              >
                <el-option
                  v-for="item in prefaceOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="题库章" prop="examinationId">
              <el-select
                v-model="form.examinationId"
                filterable
                @change="handleChangeExamination"
                placeholder="题库章"
                clearable
              >
                <el-option
                  v-for="item in examinationList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="题库小节" prop="examinationChildId">
              <el-select
                v-model="form.examinationChildId"
                filterable
                @change="handleChangeTest"
                placeholder="题库小节"
                clearable
              >
                <el-option
                  v-for="item in examinationChildList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input-number
                v-model="form.price"
                :min="0"
                :controls="false"
                :precision="2"
                placeholder="请输入价格"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="试卷总分" prop="score">
              <el-input-number
                v-model="form.score"
                :min="1"
                :step="10"
                placeholder="请输入试卷总分"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="及格分数" prop="passScore">
              <el-input-number
                v-model="form.passScore"
                :min="1"
                :step="10"
                placeholder="请输入及格分数"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="封面图" prop="imgUrl">
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
                WatermarkText=""
                WatermarkTextFont="12px Sans-serif"
                WatermarkTextColor="#fff"
                :WatermarkTextX="0.95"
                :WatermarkTextY="0.95"
                :DoNotDisplayCopyright="true"
                @cutDown="cutDownExam"
              >
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-upload"
                  slot="open"
                  @click="oneTOone"
                  >上传(比例1:1)</el-button
                >
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-upload"
                  slot="open"
                  @click="sixtTOnine"
                  >上传(比例16:9)</el-button
                >
              </ImgCutter>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-image
              v-if="form.imgUrl != null && form.imgUrl != ''"
              style="max-width: 100px; max-height: 100px"
              :z-index="2100"
              :src="form.imgUrl"
              :preview-src-list="[form.imgUrl]"
            >
            </el-image>
            <el-input v-model="form.imgUrl" v-show="false" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">下架</el-radio>
                <el-radio :label="1">上架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否推荐" prop="isRecommend">
              <el-radio-group v-model="form.isRecommend">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="考试时间" prop="examTime">
              <el-input
                v-model="form.examTime"
                placeholder="请输入考试时间(单位: 分钟)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="有效期" prop="useDays">
              <el-input-number
                v-model="form.useDays"
                :min="0"
                :controls="false"
                style="width: 200px"
                placeholder="请输入购买后可使用天数"
              />
              <span class="spanlan">天(选填)——不填时代表无限制</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="试卷标签" prop="parentId">
              <treeselect
                v-model="form.tagId"
                :options="tagOptions"
                :normalizer="normalizer"
                placeholder="请选择试卷标签"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简介" prop="useDays">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                maxlength="200"
                show-word-limit
                class="textareaclass"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加课程分类弹框 -->
    <paperClassification
      @cancelCourseCategory="categoryOpen = false"
      @getList="getTreeselect1"
      categoryTitle="添加试卷分类"
      :categoryOpen="categoryOpen"
      :dataForm="categoryForm"
      v-if="categoryOpen"
    ></paperClassification>
    <!-- <paperClassification @cancelCourseCategory="open=false" @getList="getList" :categoryTitle="title" :categoryOpen="open"
                    :dataForm="form"
                    v-if="open"></paperClassification> -->
    <!-- {{ categoryForm }} -->
  </div>
</template>

<script>
import {
  listExampaper,
  getExampaper,
  delExampaper,
  addExampaper,
  updateExampaper,
  exportExampaper,
  getPrefaces,
  getTag,
  getExamination,
  getExaminationChild,
} from "@/api/exam/exampaper";
import { listPaperClassification } from "@/api/exam/testPaper";
import { specification, imgBase64Upload } from "@/api/course/subject";
import ImgCutter from "vue-img-cutter";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/course/courseCategory";
// import CourseCategory from "@/components/CourseCategory";
import paperClassification from "@/components/paperClassification";
import { getPaperCategory } from "@/api/exam/testPaper";

export default {
  name: "Exampaper",
  components: {
    ImgCutter,
    Treeselect,
    paperClassification,
  },
  data() {
    return {
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
      // 新试卷表格数据
      exampaperList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        examName: undefined,
        prefaceId: undefined,
        specificationId: undefined,
        price: undefined,
        score: undefined,
        passScore: undefined,
        imgUrl: undefined,
        status: undefined,
        isRecommend: undefined,
        sort: undefined,
        examTime: undefined,
        useDays: undefined,
        deptId: undefined,
        tagId: undefined,
      },
      // 截图比例
      rate: "16:9",
      // 题库选项
      prefaceOptions: [],
      // 规则选项
      specificationOptions: [],
      // 试卷标签 树选项
      tagOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        examName: [
          { required: true, message: "试卷名称不能为空", trigger: "blur" },
        ],
        prefaceId: [
          { required: true, message: "关联的题库不能为空", trigger: "blur" },
        ],
        specificationId: [
          {
            required: true,
            message: "规则id(自定义试题,随机规则)不能为空",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "价格(单位: 元)默认为0.00不能为空",
            trigger: "blur",
          },
        ],
        score: [
          { required: true, message: "试卷总分不能为空", trigger: "blur" },
        ],
        passScore: [
          { required: true, message: "及格分数不能为空", trigger: "blur" },
        ],
        imgUrl: [{ required: true, message: "请上传封面图", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        isRecommend: [{ required: true, message: "是否推荐", trigger: "blur" }],
        sort: [{ required: true, message: "排序", trigger: "blur" }],
        examTime: [{ required: true, message: "考试时间", trigger: "blur" }],
      },
      // 分类选择
      CategoryOptions: [],
      // 题库下章列表
      examinationList: [],
      // 题库下小节列表
      examinationChildList: [],
      defaultProps: {
        label: "testPaperName",
        children: "children",
      },
      specialCategoryOptions: [],
      categoryOpen: false,
    };
  },
  created() {
    this.getList();
    // 获取题库列表
    this.getPrefaces();
    // 试题规则列表
    specification().then((response) => {
      this.specificationOptions = response.data;
    });
    // 试卷标签
    this.getTreeselect();
    //分类标签
    this.getTreeselect1();
    //新试卷
    this.getspecialselect();
  },
  methods: {
    /** 添加专题分类 */
    categoryAdd() {
      this.categoryForm = {
        id: undefined,
        pid: undefined,
        categoryName: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        status: "0",
        sort: 0,
      };
      this.resetForm("categoryForm");
      this.categoryOpen = true;
    },
    // 获取题库列表
    getPrefaces() {
      getPrefaces().then((res) => {
        this.prefaceOptions = res.data;
      });
    },
    /** 查询新试卷列表 */
    getList() {
      this.loading = true;
      listExampaper(this.queryParams).then((response) => {
        this.exampaperList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 选择题库后发送请求获取章
    handleChangePreface(type) {
      if (type != -1) {
        this.form.examinationId = undefined;
        this.form.examinationChildId = undefined;
      }
      this.examinationList = [];
      this.examinationChildList = [];
      if (!this.form.prefaceId) {
        return;
      }
      // 发送请求获取数据
      getExamination(this.form.prefaceId).then((res) => {
        if (res.code == 200) {
          this.examinationList = res.data;
        } else {
          this.msgError(res.msg);
        }
      });
    },
    // 选择题库下的章后发送请求获取小节数据
    handleChangeExamination(type) {
      if (type != -1) {
        this.form.examinationChildId = undefined;
      }
      this.examinationChildList = [];
      if (!this.form.examinationId) {
        return;
      }
      // 发送请求获取数据
      getExaminationChild(this.form.examinationId).then((res) => {
        if (res.code == 200) {
          this.examinationChildList = res.data;
        } else {
          this.msgError(res.msg);
        }
      });
    },
    handleChangeTest() {
      console.log(this.form.examinationChildId, "选择小节后打印");
    },
    // 修改排序
    updateSort(data) {
      let putData = {};
      putData.id = data.id;
      putData.sort = data.sort;
      updateExampaper(putData).then((res) => {
        if (res.code == 200) {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(res.msg);
        }
      });
    },
    /** 转换专题分类 数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.tagName,
        children: node.children,
      };
    },
    /**上传(比例1:1) */
    oneTOone: function (res) {
      this.rate = "1:1";
    },
    /**上传(比例16:9) */
    sixtTOnine: function (res) {
      this.rate = "16:9";
    },
    // 裁剪图片后上传
    cutDownExam: function (res) {
      imgBase64Upload(res.dataURL).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.imgUrl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
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
        examName: undefined,
        prefaceId: undefined,
        specificationId: undefined,
        price: 0.0,
        score: 100,
        passScore: 60,
        imgUrl: undefined,
        status: 1,
        isRecommend: 1,
        sort: 100,
        examTime: undefined,
        useDays: undefined,
        remark: undefined,
        createTime: undefined,
        updateTime: undefined,
        deptId: undefined,
        tagId: undefined,
        examinationChildId: undefined,
        examinationId: undefined,
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
      this.getTreeselect();
      this.open = true;
      this.title = "添加新试卷";
    },
    /** 查询专题下拉树结构 */
    getTreeselect() {
      getTag().then((response) => {
        this.tagOptions = [];
        const data = { id: 0, tagName: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.tagOptions.push(data);
      });
    },
    /** 转换专题分类 数据结构 */
    normalizers(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.testPaperName,
        children: node.children,
      };
    },
    /** 查询分类下拉树结构 */
    getspecialselect() {
      // 课程分类
      treeselect().then((response) => {
        // this.specialCategoryOptions = this.handleTree(response.data, 'id', 'pid')
        this.specialCategoryOptions = response.data;
      });
    },
    /** 查询分类下拉树结构 */
    getTreeselect1() {
      // 课程分类
      listPaperClassification().then((response) => {
        //console.log(response)
        // this.specialCategoryOptions = this.handleTree(response.data, 'id', 'pid')
        // this.CategoryOptions = response.data;

        this.CategoryOptions = [];
        // const data = { id: 0, testPaperName: '顶级节点', children: [] }
        const data = this.handleTree(response.rows, "id", "pid");
        console.log(data.children);
        this.CategoryOptions = data;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const id = row.id || this.ids;
      getExampaper(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改新试卷";
        this.handleChangePreface(-1);
        this.handleChangeExamination(-1);
        if (this.form.examinationId == 0) {
          this.form.examinationId = undefined;
        }
        if (this.form.examinationChildId == 0) {
          this.form.examinationChildId = undefined;
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            if (!this.form.examinationId) {
              this.form.examinationId = 0;
            }
            if (!this.form.examinationChildId) {
              this.form.examinationChildId = 0;
            }
            updateExampaper(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addExampaper(this.form).then((response) => {
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
      this.$confirm('是否确认删除新试卷编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delExampaper(ids);
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
      this.$confirm("是否确认导出所有新试卷数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportExampaper(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
