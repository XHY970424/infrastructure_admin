<template>
  <div class="app-container">
    <el-tabs v-model="queryParams.method" @tab-click="handleClick">
      <el-tab-pane label="录播" name="0" />
      <el-tab-pane label="面授" name="2" />
      <el-tab-pane label="直播" name="1" />
      <el-tab-pane label="专题" name="3" />
    </el-tabs>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="课程名称" prop="subjectTitle">
        <el-input
          v-model="queryParams.subjectTitle"
          placeholder="请输入课程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryId">
        <treeselect
          v-model="queryParams.categoryId"
          :options="courseCategoryOptions"
          :show-count="true"
          placeholder="请选择分类"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="上线状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option label="上架" :value="0" />
          <el-option label="已结束" :value="6" />
          <el-option label="隐藏" :value="4" />
          <el-option label="下架" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="授课老师" prop="teacherId">
        <el-input
          v-model="queryParams.teacherId"
          placeholder="请输入授课老师"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程价格" prop="price">
        <el-input
          style="width: 100px"
          v-model="queryParams.minPrice"
          placeholder=""
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
        ~
        <el-input
          style="width: 100px"
          v-model="queryParams.maxPrice"
          placeholder=""
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="是否推荐" prop="recommend">
        <el-select
          v-model="queryParams.recommend"
          placeholder="请选择是否推荐"
          clearable
          size="small"
        >
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
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
      <div v-if="statusType == 0">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['resource:courseSubject:add']"
            >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['resource:courseSubject:remove']"
            >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="statusType = 1"
            v-hasPermi="['resource:courseSubject:add']"
            >回收站
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="statusType = 2"
            v-hasPermi="['resource:courseSubject:add']"
            >草稿箱
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-download"
            size="mini"
            @click="
            (importCourseOpen = true),
              (courseUploadStatus = '')"
            v-hasPermi="['resource:courseSubject:upload']"
            >课程导入
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-setting"
            size="mini"
            @click="openconfig = true"
            :disabled="ids.length ? false : true"
            v-hasPermi="['resource:courseSubject:config']"
            >课程配置
          </el-button>
        </el-col>
      </div>
      <!-- 草稿箱 -->
      <div v-else-if="statusType == 2">
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="statusType = 0"
            v-hasPermi="['resource:courseSubject:add']"
            >退出草稿箱
          </el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="ids.length == 0"
            @click="delCompletely"
            >彻底删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-setting"
            size="mini"
            @click="openconfig = true"
            :disabled="ids.length ? false : true"
            v-hasPermi="['resource:courseSubject:config']"
            >课程配置
          </el-button>
        </el-col>
      </div>
      <!-- 回收站 -->
      <div v-else-if="statusType == 1">
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="statusType = 0"
            v-hasPermi="['resource:courseSubject:add']"
            >退出回收站
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="reduction"
            :disabled="ids.length == 0"
            v-hasPermi="['resource:courseSubject:recover']"
            >批量还原
          </el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="delCompletely"
            :disabled="ids.length == 0"
            v-hasPermi="['resource:courseSubject:remove']"
            >彻底删除
          </el-button>
        </el-col>
      </div>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="courseSubjectList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="课程名称" align="center" prop="subjectTitle" />
      <el-table-column label="课程分类" align="center" prop="categoryName" />
      <el-table-column label="授课老师" align="center" prop="teacherName" />
      <el-table-column label="课程价格" align="center" prop="discountAfterPrices" />
      <el-table-column label="购买人数" align="center" prop="userNumber" />
      <el-table-column label="上线状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ parseStatus(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="recommend">
        <template slot-scope="scope">
          <span> {{ scope.row.recommend == 1 ? "是" : "否" }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="250"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['resource:courseSubject:edit']"
            >修改
          </el-button>
          <el-button
            v-if="statusType != 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['resource:courseSubject:remove']"
            >删除
          </el-button> -->
          <el-button
            v-if="statusType != 1"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="goDetail(scope.row)"
            v-hasPermi="['resource:courseSubject:remove']"
            >详情
          </el-button>
          <span v-if="statusType != 2">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-user"
              @click="Clickclass(scope.row)"
              >班级
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-data"
              @click="$router.push('/courseSection/section/' + scope.row.id)"
              >小节
            </el-button>
            <el-button
              size="mini"
              @click="Clickdata(scope.row.id)"
              type="text"
              icon="el-icon-notebook-2"
              >资料
            </el-button>
          </span>
          <el-button
            v-else
            size="mini"
            type="text"
            icon="el-icon-notebook-2"
            @click="handleUp(scope.row.id)"
            >继续添加课程
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
    <Courseconfig
      v-model="openconfig"
      :statusType="statusType"
      :ids="ids"
      @success="success"
    />
    <add-course
      :isShow.sync="isAdd"
      :isUpdate="isUpdate"
      :updateId="courseId"
      @success="addSuccess"
    ></add-course>
    <course-details
      :detailShow.sync="detailShow"
      @success="addSuccess"
      v-if="detailShow"
      :courseId="courseId"
      :statusType="statusType"
    ></course-details>

    <!-- 批量导入课程面板 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="批量课程导入"
      :visible.sync="importCourseOpen"
      width="700px"
      append-to-body
    >
      <div slot="footer" class="dialog-footer" style="margin-top: -50px">
        <el-row :gutter="25" class="mb8">
<!--          <el-col :span="1.5">-->
<!--            <a-->
<!--              :href="courseExampleExcelUrl"-->
<!--              style="color: red; position: relative; top: 5px"-->
<!--            >课程导入示例</a-->
<!--            >-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <a
              :href="courseExcelUrl"
              style="
                color: #00afff;
                text-decoration: underline;
                position: relative;
                top: 5px;
              "
            >下载导入模板</a
            >
          </el-col>
          <el-col :span="1.5">
            <el-upload
              class="upload-demo"
              action=""
              accept=".zip"
              :http-request="httpRequestCourse"
            >
              <el-button
                type="warning"
                icon="el-icon-upload2"
                size="mini"
                v-hasPermi="['resource:courseSubject:upload']"
              >批量课程导入
              </el-button>
              <div slot="tip" class="el-upload__tip">
                {{ courseUploadStatus }}
              </div>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <span class="hint"
            >请按照压缩包内提示填写</span
            >
          </el-col>
        </el-row>
        <el-button type="primary" @click="(importCourseOpen = false), getList()"
        >确 定</el-button
        >
        <el-button @click="importCourseOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fileUpload2
  } from "@/api/course/subject";
import {
  listCourseSubject,
  getCourseSubject,
  delCourseSubject,
  addCourseSubject,
  updateCourseSubject,
  recover,
  getdel,
  importCourseData
} from "@/api/resource/courseSubject";
import { treeselect } from "@/api/course/courseCategory";
import Template from "../../certificate/template/index";
import Treeselect from "@riophae/vue-treeselect";
import addCourse from "../components/addCourse"; //新增课程
import Courseconfig from "../components/Courseconfig.vue"; //课程配置
import courseDetails from "../components/courseDetails.vue"; //详情
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { GetExcelUrl } from "@/api/base/eyUsers";

export default {
  name: "CourseSubject",
  components: { Template, Treeselect, addCourse, Courseconfig, courseDetails },
  data() {
    return {
      openconfig: false, //课程配置弹窗
      //0 全部 1 回收站 2 草稿箱
      statusType: 0,
      //是否新增弹窗
      isAdd: false,
      //新增弹窗-是否是继续添加
      isUpdate: false,
      //详情弹窗
      detailShow: false,
      //详情课程id
      courseId: "",
      // 分类选项
      courseCategoryOptions: [],
      // tab类型 0-录播 1-直播 2-面授 3-专题
      tabType: 0,
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 课程主题 表格数据
      courseSubjectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        subjectTitle: undefined,
        status: undefined,
        sort: undefined,
        categoryId: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        price: undefined,
        draft: 0,
        deleteTime: 0,
        teacherId: undefined,
        method: undefined,
        recommend: undefined
      },
      // 表单参数
      form: {},
      courseExcelUrl: "",
      importCourseOpen: false,
      courseUploadStatus: "",
      // 表单校验
      rules: {
        subjectTitle: [
          { required: true, message: "课程名称不能为空", trigger: "blur" }
        ],
        deleteTime: [
          { required: true, message: "软删除不能为空", trigger: "blur" }
        ],
        isSupervise: [
          {
            required: true,
            message: "是否对接监管平台0-不需要 1-需要不能为空",
            trigger: "blur"
          }
        ],
        isHomeShow: [
          {
            required: true,
            message: "是否在前台列表页显示0-否 1-是不能为空",
            trigger: "blur"
          }
        ],
        isPush: [
          {
            required: true,
            message:
              "是否已推送至监管平台(0-未推送 1-已推送 2-修改未推送)不能为空",
            trigger: "blur"
          }
        ],
        tenantId: [
          { required: true, message: "正式租户id不能为空", trigger: "blur" }
        ],
        showPrice: [
          {
            required: true,
            message: "是否展示价格0-不展示1-展示不能为空",
            trigger: "blur"
          }
        ],
        flowOnline: [
          {
            required: true,
            message: "是否走订单流程 0-不是 1-是不能为空",
            trigger: "blur"
          }
        ],
        isAuth: [
          {
            required: true,
            message: "是否需要实名认证0-不需要 1-需要不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    statusType(val) {
      if (val == 0) {
        //默认显示未删除和未存入草稿箱
        this.queryParams.draft = 0;
        this.queryParams.deleteTime = 0;
      } else if (val == 1) {
        //显示已删除
        this.queryParams.deleteTime = 1;
        this.queryParams.draft = "";
      } else if (val == 2) {
        //显示草稿箱
        this.queryParams.draft = 1;
      }
      this.getList();
    }
  },
  created() {
    this.getTreeselect();
    this.getList();
    this.getExcelUrl();
  },
  methods: {
    /**
     * 上传文件:批量课程
     */
    async httpRequestCourse(file) {
      // this.courseUploadStatus = "上传中...";
      // // 上传文件获取url 地址
      // let fileUrl = "";
      // await fileUpload2(params).then((response) => {
      //   fileUrl = response.url;
      // });
      //
      // // 获取url地址后再讲文件传给后端
      // const requestData = {
      //   url: fileUrl,
      //   excel: true,
      // };
      const method = 0;
      importCourseData(file, method)
        .then((response) => {
          if (response.data == 200) {
            this.courseUploadStatus = "上传成功";
            this.$message.success("课程批量文件上传成功~");
          } else {
            this.courseUploadStatus = "上传失败";
            this.download(response.msg);
            this.$message.error("上传数据有误，请将数据修改后重新上传！");
          }
        })
        .catch((res) => {
          this.courseUploadStatus = "上传失败";
        });
    },
    // 获取下载压缩包地址
    getExcelUrl() {
      let import_course = "import_course";
      GetExcelUrl(import_course).then((response) => {
        if (response.code == 200) {
          this.courseExcelUrl = response.msg;
        }
      });
    },
    //继续添加课程
    handleUp(id) {
      this.courseId = id;
      this.isAdd = true;
      this.isUpdate = true;
    },
    //打开详情
    goDetail(row) {
      this.courseId = row.id;
      this.detailShow = true;
    },
    //资料跳转
    Clickdata(id) {
      this.$router.push(`material?id=${id}`);
    },
    //新增课程保存
    addSuccess() {
      this.getList();
    },
    //课程配置保存
    success(e) {
      this.getList();
      this.ids = [];
    },
    //彻底删除
    delCompletely() {
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        getdel(this.ids.join()).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功");
            this.ids = [];
            this.getList();
          }
        });
      });
    },
    //回收站还原
    reduction() {
      // if (!this.ids.length) return;
      recover(this.ids.join()).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "还原成功",
            type: "success"
          });
          this.ids = [];
          this.getList();
        }
      });
    },
    /** 查询课程下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.courseCategoryOptions = response.data;
      });
    },
    // 处理状态
    parseStatus(row) {
      if (row.isCheck === 1) {
        return "审核中";
      }
      switch (row.status) {
        case 0:
          return "上架";
        case 1:
          return "下架";
        case 4:
          return "隐藏";
      }
    },
    // tab栏点击事件
    handleClick(tab) {
      this.tabType = tab.name;
      // 为课程时
      if (tab.name != 3) {
        this.queryParams.method = tab.name;
        this.handleQuery();
      } else {
        // TODO 专题
      }
    },
    /** 查询课程主题 列表 */
    getList() {
      this.loading = true;
      listCourseSubject(this.queryParams).then(response => {
        this.courseSubjectList = response.rows;
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
        subjectTitle: undefined,
        subjectIntroduction: undefined,
        payment: undefined,
        subjectImageUrl: undefined,
        status: 0,
        sort: undefined,
        categoryId: undefined,
        price: undefined,
        teacherId: undefined,
        bookAddress: undefined,
        method: undefined,
        isExercises: undefined,
        isEvidence: undefined,
        recommend: undefined,
        previewNumber: undefined,
        commentUuid: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        onlineProof: undefined,
        onlineExercises: undefined,
        onlineHours: undefined,
        onlineIndate: undefined,
        onlineTeacherId: undefined,
        onlineEndtime: undefined,
        onlineSpecificationId: undefined,
        offlineProof: undefined,
        offlineType: undefined,
        offlineClassId: undefined,
        offlineHours: undefined,
        offlineRegion: undefined,
        craftId: undefined,
        deleteTime: undefined,
        deptId: undefined,
        regionId: undefined,
        postId: undefined,
        prefaceId: undefined,
        excelUrl: undefined,
        freeExamNum: undefined,
        supexamPrice: undefined,
        subjectType: undefined,
        subjectUuid: undefined,
        subjectHours: undefined,
        isSupervise: undefined,
        isHomeShow: undefined,
        isPush: undefined,
        tenantId: undefined,
        showPrice: undefined,
        flowOnline: undefined,
        hint: undefined,
        isAuth: undefined,
        isEnd: undefined,
        isHidden: undefined,
        isSteps: undefined,
        salesmanId: undefined
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isAdd = true;
      this.isUpdate = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getCourseSubject(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改课程主题 ";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCourseSubject(this.form)
              .then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addCourseSubject(this.form)
              .then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    //进入班级
    Clickclass(row) {
      console.log(row);
      this.$router.push({
        path: "/resource/class",
        query: { type: this.queryParams.method, id: row.id }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除课程主题 编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          return delCourseSubject(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.msgSuccess("删除成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.downLoadExcel("/resource/courseSubject/export", this.queryParams);
    }
  }
};
</script>
