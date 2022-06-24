<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入搜索内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="所属类别" prop="teacherCategoryId">
        <treeselect
          v-model="queryParams.teacherCategoryId"
          style="width: 240px"
          :options="categoryList"
          :normalizer="normalizer"
          placeholder="请选择所属类别"
        />
      </el-form-item> -->
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请输入">
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首页展示" prop="homeShow">
        <el-select v-model="queryParams.homeShow" placeholder="请输入">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
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
          v-hasPermi="['eycode:teacher:add']"
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
          v-hasPermi="['eycode:teacher:edit']"
          >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:teacher:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:teacher:export']"
          >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :data="teacherList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        fixed="left"
      />
      <el-table-column label="名称" align="center" prop="name" fixed="left" />
      <el-table-column
        label="所属类别"
        align="center"
        prop="categoryTitle"
        fixed="left"
      />
      <el-table-column
        label="性别"
        align="center"
        prop="sex"
        :formatter="sexFormat"
        fixed="left"
      />
      <el-table-column
        label="简介"
        align="center"
        prop="detail"
        :show-overflow-tooltip="true"
        fixed="left"
      />
      <el-table-column
        label="介绍"
        align="center"
        prop="introduction"
        :show-overflow-tooltip="true"
        fixed="left"
      />
      <el-table-column
        label="讲师图片"
        align="center"
        prop="imageUrl"
        :show-overflow-tooltip="true"
        fixed="left"
      >
        <!--显示图片-->
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.imageUrl"
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]"
          >
          </el-image>
          <span v-if="!scope.row.imageUrl">暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="资格证书" align="center" prop="post" />
      <el-table-column
        label="身份证号码"
        align="center"
        prop="idCard"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="工作单位"
        align="center"
        prop="company"
        width="150px"
      />
      <el-table-column label="专业领域" align="center" prop="domain" />
      <el-table-column label="电话号码" align="center" prop="phone" />
      <el-table-column label="首页展示" align="center" prop="homeShow">
        <template slot-scope="scope">
          <span v-show="scope.row.homeShow == 0">否</span>
          <span v-show="scope.row.homeShow == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="荣誉" align="center" prop="honor" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="是否启用" align="center" prop="status">
        <template slot-scope="scope">
          <span> {{ scope.row.status == 0 ? "停用" : "启用" }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="150px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:teacher:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:teacher:remove']"
            >删除
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

    <!-- 添加或修改讲师对话框 -->
    <CourseTeacher
      @cancelCourseTeacher="open = false"
      @getList="getList"
      :categoryTitle="title"
      :categoryOpen="open"
      :dataForm="form"
      v-if="open"
    ></CourseTeacher>
    <!--    <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" width="1000px" append-to-body>-->
    <!--      <el-form ref="form" :model="form" :rules="rules" label-width="120px">-->
    <!--        <el-row>-->
    <!--          <el-col :span="24">-->
    <!--            <el-form-item label="名称" prop="name">-->
    <!--              <el-input v-model="form.name" placeholder="请输入名称"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="8">-->
    <!--            <el-form-item label="性别" prop="sex">-->
    <!--              <el-select v-model="form.sex" placeholder="请输入">-->
    <!--                <el-option-->
    <!--                  v-for="dict in sexOptions"-->
    <!--                  :key="dict.dictValue"-->
    <!--                  :label="dict.dictLabel"-->
    <!--                  :value="dict.dictValue"-->
    <!--                ></el-option>-->
    <!--              </el-select>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--          <el-col :span="6">-->
    <!--            <el-form-item label="首页显示" prop="homeShow">-->
    <!--              <el-radio-group v-model="form.homeShow">-->
    <!--                <el-radio :label="0">否</el-radio>-->
    <!--                <el-radio :label="1">是</el-radio>-->
    <!--              </el-radio-group>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--          <el-col :span="10">-->
    <!--            <el-form-item label="资格证书" prop="post">-->
    <!--              <el-input v-model="form.post" placeholder="请输入资格证书"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="24">-->
    <!--            <el-form-item label="讲师图片" prop="imageUrl">-->
    <!--              <ImgCutter-->
    <!--                ref="imgCutterModal"-->
    <!--                label="点击上传"-->
    <!--                :crossOrigin="true"-->
    <!--                crossOriginHeader="*"-->
    <!--                toolBgc="none"-->
    <!--                :isModal="true"-->
    <!--                :showChooseBtn="true"-->
    <!--                :lockScroll="false"-->
    <!--                :boxWidth="775"-->
    <!--                :boxHeight="458"-->
    <!--                :cutWidth="250"-->
    <!--                :cutHeight="250"-->
    <!--                :sizeChange="true"-->
    <!--                :moveAble="true"-->
    <!--                :originalGraph="false"-->
    <!--                :tool="false"-->
    <!--                :rate="rate"-->
    <!--                WatermarkText="大湾区职训网"-->
    <!--                WatermarkTextFont="12px Sans-serif"-->
    <!--                WatermarkTextColor="#fff"-->
    <!--                :WatermarkTextX="0.95"-->
    <!--                :WatermarkTextY="0.95"-->
    <!--                :DoNotDisplayCopyright="true"-->
    <!--                @cutDown="cutDownSubject">-->
    <!--                <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="oneTOone">上传(比例1:1)-->
    <!--                </el-button>-->
    <!--                &lt;!&ndash;              <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="sixtTOnine">上传(比例16:9)</el-button>&ndash;&gt;-->
    <!--              </ImgCutter>-->
    <!--              <el-image v-if="form.imageUrl!=null && form.imageUrl!=''" style="max-width: 80px;max-height: 80px" :z-index="2100"-->
    <!--                        :src="form.imageUrl"-->
    <!--                        :preview-src-list="[form.imageUrl]">-->
    <!--              </el-image>-->
    <!--              <el-input v-model="form.imageUrl" v-show="false"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="24">-->
    <!--            <el-form-item label="简介" prop="detail">-->
    <!--              <el-input v-model="form.detail" type="textarea" placeholder="请输入简介"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="12">-->
    <!--            <el-form-item label="身份证" prop="idCard">-->
    <!--              <el-input v-model="form.idCard" placeholder="请输入身份证号码"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--          <el-col :span="12">-->
    <!--            <el-form-item label="电话号码" prop="phone">-->
    <!--              <el-input v-model="form.phone" placeholder="请输入手机号码"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="12">-->
    <!--            <el-form-item label="工作单位" prop="company">-->
    <!--              <el-input v-model="form.company" placeholder="请输入工作单位"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--          <el-col :span="12">-->
    <!--            <el-form-item label="专业方向" prop="domain">-->
    <!--              <el-input v-model="form.domain" placeholder="请输入专业方向"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="24">-->
    <!--            <el-form-item label="荣誉" prop="honor">-->
    <!--              <el-input v-model="form.honor" placeholder="请输入荣誉"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="12">-->
    <!--            <el-form-item label="排序" prop="sort">-->
    <!--              <el-input-number v-model="form.sort" :min="0"></el-input-number>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--          <el-col :span="12">-->
    <!--            <el-form-item label="状态" prop="status">-->
    <!--              <el-radio-group v-model="form.status">-->
    <!--                <el-radio :label="0">停用</el-radio>-->
    <!--                <el-radio :label="1">启用</el-radio>-->
    <!--              </el-radio-group>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-row>-->
    <!--          <el-col :span="24">-->
    <!--            <el-form-item label="讲师介绍" prop="introduction">-->
    <!--              <EditorTow v-if="open" v-model="form.introduction"/>-->
    <!--            </el-form-item>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
    <!--        <el-button @click="cancel">取 消</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import {
  addTeacher,
  delTeacher,
  exportTeacher,
  getTeacher,
  imgBase64Upload,
  listTeacher,
  updateTeacher,
  categoryTeacherList,
} from "@/api/course/teacher";
import Editor from "@/components/Editor";
import EditorTow from "@/components/Tinymce";
import ImgCutter from "vue-img-cutter";
import CourseTeacher from "@/components/CourseTeacher";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Teacher",
  components: { ImgCutter, Editor, EditorTow, CourseTeacher, Treeselect },
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
      // 讲师表格数据
      teacherList: [],
      sexOptions: [],
      // 弹出层标题
      title: "",
      // 截图比例
      rate: "1:1",

      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        sex: undefined,
        detail: undefined,
        imageUrl: undefined,
        post: undefined,
        idCard: undefined,
        company: undefined,
        honor: undefined,
        homeShow: undefined,
        status: undefined,
        teacherCategoryId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // imageUrl: [
        //   { required: true, message: "图片不能为空", trigger: "blur" }
        // ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        detail: [{ required: true, message: "简介不能为空", trigger: "blur" }],
        // post: [
        //   { required: true, message: "资格证书不能为空", trigger: "blur" }
        // ],
        // sex: [
        //   { required: true, message: "性别不能为空", trigger: "blur" }
        // ],
        company: [
          { required: true, message: "工作单位不能为空", trigger: "blur" },
        ],
        phone: [
          // { required: true, message: "电话号码不能为空", trigger: "blur" },
          {
            pattern:
              /(^(13[0-9]|17[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$)/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        idCard: [
          // { required: true, message: "身份证号码不能为空", trigger: "blur" },
          {
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的身份证号码",
            trigger: "blur",
          },
        ],
        homeShow: [
          { required: true, message: "请选择是否在首页显示", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      //分类列表
      categoryList: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("teacher_sex").then((response) => {
      this.sexOptions = response.data;
    });
    // categoryTeacherList().then((res) => {
    //   this.categoryList = this.handleTree(res.data, "id", "pid");
    // });
  },
  methods: {
    /** 转换专题分类 数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children,
      };
    },
    /** 查询讲师列表 */
    getList() {
      this.loading = true;
      listTeacher(this.queryParams).then((response) => {
        this.teacherList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },

    /**上传(比例1:1) */
    oneTOone: function (res) {
      this.rate = "1:1";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        teacherId: undefined,
        name: undefined,
        sex: undefined,
        detail: undefined,
        domain: undefined,
        introduction: undefined,
        imageUrl: undefined,
        post: undefined,
        idCard: undefined,
        company: undefined,
        honor: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        homeShow: 0,
        sort: 0,
        status: 0,
        teacherCategoryId: undefined,
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

    cutDownSubject: function (res) {
      imgBase64Upload(res.dataURL).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.imageUrl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.teacherId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加讲师信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const teacherId = row.teacherId || this.ids;
      getTeacher(teacherId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改讲师";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 判断是否是在首页显示, 在首页显示必须上传讲师图片
          if (this.form.homeShow == 1) {
            if (this.form.imageUrl == undefined || this.form.imageUrl == "") {
              return this.msgError("在首页显示必须上传讲师图片!");
            }
          }
          if (this.form.teacherId != undefined) {
            updateTeacher(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTeacher(this.form).then((response) => {
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
      const teacherIds = row.teacherId || this.ids;
      this.$confirm(
        '是否确认删除讲师编号为"' + teacherIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTeacher(teacherIds);
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
      this.$confirm("是否确认导出所有讲师数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportTeacher(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
