<template>
  <!-- 添加或修改讲师对话框 -->
  <el-dialog
    :title="categoryTitle"
    :visible.sync="categoryOpen"
    :close-on-click-modal="false"
    width="1000px"
    append-to-body
    :before-close="cancel"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属类别" prop="teacherCategoryId">
            <treeselect
              v-model="form.teacherCategoryId"
              :options="categoryList"
              :normalizer="normalizer"
              placeholder="请选择所属类别"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" :maxlength="8" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="form.sex" placeholder="请输入">
              <el-option
                v-for="dict in sexOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="首页显示" prop="homeShow">
            <el-radio-group v-model="form.homeShow">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="资格证书" prop="post">
            <el-input v-model="form.post" placeholder="请输入资格证书" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div style="margin-left: 60px; color: red">
            <span>讲师图片建议尺寸为129px*129px</span>
          </div>
          <el-form-item label="讲师图片" prop="imageUrl">
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
              @cutDown="cutDownSubject"
            >
              <el-button
                size="small"
                type="primary"
                icon="el-icon-upload"
                slot="open"
                @click="oneTOone"
                >上传(比例1:1)
              </el-button>
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
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="简介" prop="detail">
            <el-input
              v-model="form.detail"
              maxlength="255"
              show-word-limit
              type="textarea"
              placeholder="请输入简介"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证" prop="idCard">
            <el-input v-model="form.idCard" placeholder="请输入身份证号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工作单位" prop="company">
            <el-input v-model="form.company" placeholder="请输入工作单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业方向" prop="domain">
            <el-input v-model="form.domain" placeholder="请输入专业方向" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="荣誉" prop="honor">
            <el-input
              v-model="form.honor"
              maxlength="255"
              show-word-limit
              placeholder="请输入荣誉"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="讲师介绍" prop="introduction">
            <EditorTow v-model="form.introduction" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addTeacher,
  imgBase64Upload,
  updateTeacher,
  categoryTeacherList,
} from "@/api/course/teacher";
import ImgCutter from "vue-img-cutter";
import EditorTow from "@/components/Tinymce";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "index",
  components: { EditorTow, ImgCutter,Treeselect },
  props: {
    categoryTitle: String,
    categoryOpen: Boolean,
    dataForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      // 表单参数
      form: this.dataForm,
      // 表单校验
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        detail: [{ required: true, message: "简介不能为空", trigger: "blur" }],
        company: [
          { required: true, message: "工作单位不能为空", trigger: "blur" },
        ],
        phone: [
          {
            pattern:
              /(^(13[0-9]|17[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$)/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        idCard: [
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
      // 截图比例
      rate: "1:1",
      sexOptions: [],
      categoryList: [],
    };
  },
  created() {
    this.getDicts("teacher_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getCategory();
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
    //获取分类
    getCategory() {
      categoryTeacherList().then((res) => {
        this.categoryList = this.handleTree(res.data, "id", "pid");
      });
    },
    cancel() {
      this.$emit("cancelCourseTeacher");
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
    /**上传(比例1:1) */
    oneTOone: function (res) {
      this.rate = "1:1";
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
                this.$emit("cancelCourseTeacher");
                this.$emit("getList");
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTeacher(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.$emit("cancelCourseTeacher");
                this.$emit("getList");
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
