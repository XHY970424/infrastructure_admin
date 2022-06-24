<template>
  <div>
    <el-dialog
      title="编辑课程"
      :visible.sync="openUpload"
      width="1000px"
      :before-close="handleClose"
      append-to-body
    >
      <div class="info" v-if="infoForm">
        <el-scrollbar style="height: 100%">
          <el-form
            ref="infoForm"
            :model="infoForm"
            label-width="120px"
            :rules="rules"
          >
            <div class="title-text">课程信息</div>
            <el-form-item label="课程名称" prop="subjectTitle">
              <el-input
                v-model="infoForm.subjectTitle"
                placeholder="请输入课程名称"
                :maxlength="35"
              />
            </el-form-item>
            <el-form-item label="授课老师" prop="teacherIds">
              <el-select
                v-model="infoForm.teacherIds"
                style="width: 100%"
                multiple
                placeholder="请选择授课老师"
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.teacherId"
                  :label="item.name"
                  :value="item.teacherId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程分类" prop="categoryId">
              <el-row type="flex" justify="space-between">
                <el-col :span="20">
                  <treeselect
                    v-model="infoForm.categoryId"
                    :options="courseCategoryOptions"
                    :show-count="true"
                    placeholder="请选择分类"
                  />
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" @click="categoryAdd" round plain
                    >新增分类</el-button
                  >
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="业务人员" prop="salesmanId">
              <el-select
                v-model="infoForm.salesmanId"
                style="width: 100%"
                placeholder="请选择业务人员"
              >
                <el-option
                  v-for="item in salesManList"
                  :key="item.id"
                  :label="item.salesmanName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="总学时" prop="subjectHours">
              <el-input-number
                v-model="infoForm.subjectHours"
                :min="0"
                :controls="false"
                :precision="2"
                placeholder="请输入总学时"
              />
            </el-form-item>
            <el-form-item label="课程标签" prop="tagBoList">
              <el-button type="primary" @click="openedit = true" round
                >添加标签</el-button
              >
            </el-form-item>
            <el-form-item prop="tagBoList">
              <el-tag
                v-for="(item, i) in infoForm.tagBoList"
                style="margin-right: 10px"
                :key="i"
              >
                {{ item.tagName }}
              </el-tag>
            </el-form-item>
            <el-form-item label="课程封面" prop="subjectImageUrl">
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
                :sizeChange="true"
                :moveAble="true"
                :originalGraph="false"
                :tool="false"
                rate="16:9"
                WatermarkText=""
                WatermarkTextFont="12px Sans-serif"
                WatermarkTextColor="#fff"
                :WatermarkTextX="0.95"
                :WatermarkTextY="0.95"
                :DoNotDisplayCopyright="true"
                @cutDown="cutDownCourse"
              >
                <el-image
                  slot="open"
                  :src="infoForm.subjectImageUrl"
                  v-if="infoForm.subjectImageUrl"
                ></el-image>
                <div class="avatar-uploader" slot="open" v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </ImgCutter>
            </el-form-item>
            <el-form-item label="背景图" prop="backgroundImg">
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
                :sizeChange="true"
                :moveAble="true"
                :originalGraph="false"
                :tool="false"
                rate="4.27:1"
                WatermarkText=""
                WatermarkTextFont="12px Sans-serif"
                WatermarkTextColor="#fff"
                :WatermarkTextX="0.95"
                :WatermarkTextY="0.95"
                :DoNotDisplayCopyright="true"
                @cutDown="cutDownBg"
              >
                <el-image
                  slot="open"
                  :src="infoForm.backgroundImg"
                  v-if="infoForm.backgroundImg"
                ></el-image>
                <div class="avatar-uploader" slot="open" v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </ImgCutter>
            </el-form-item>
            <el-form-item label="课程介绍" prop="subjectIntroduction">
              <EditorTow
                id="contentEditor"
                v-if="openUpload"
                v-model="infoForm.subjectIntroduction"
              />
            </el-form-item>
            <div class="title-text">上传导学视频</div>
            <upload-hd-video @creatVideo="creatLearnVideo" :videoList="infoForm.videoDataListVoList"></upload-hd-video>
            <div class="title-text">营销设置</div>
            <el-form-item label="课程价格" prop="price">
              <el-input-number
                v-model="infoForm.price"
                :min="0"
                :controls="false"
                :precision="2"
                placeholder="请输入课程价格"
              />
            </el-form-item>
            <el-form-item label="价格显示" prop="showPrice">
              <el-radio-group v-model="infoForm.showPrice">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="优化规则" prop="discount">
              <el-row type="flex" justify="space-between">
                <el-col :span="5">
                  <el-select
                    v-model="infoForm.discount"
                    style="width: 100%"
                    placeholder="请选择优惠规则"
                    filterable
                  >
                    <el-option
                      v-for="(item, index) in discounts"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-input-number
                    style="width: 100%"
                    v-model="infoForm.discountPrice"
                    :placeholder="
                      infoForm.discount == 2 ? '优惠折扣' : '优惠价格'
                    "
                    :min="0"
                    :controls="false"
                    :precision="2"
                  />
                </el-col>
                <el-col :span="5">
                  <el-date-picker
                    style="width: 100%"
                    v-model="infoForm.discountStartTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="优惠开始期限"
                  >
                  </el-date-picker>
                </el-col>
                <el-col :span="5">
                  <el-date-picker
                    style="width: 100%"
                    v-model="infoForm.discountEndTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="优惠结束期限"
                  >
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
            <div class="title-text">学习设置</div>
            <el-form-item label="加入学习" prop="flowOnline">
              <el-radio-group v-model="infoForm.flowOnline">
                <el-radio :label="1">自主支付</el-radio>
                <el-radio :label="0">联系业务人员</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="实名认证" prop="isAuth">
              <el-radio-group v-model="infoForm.isAuth">
                <el-radio :label="1">需要</el-radio>
                <el-radio :label="0">不需要</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报名时间" prop="applyTimeType">
              <el-radio-group v-model="infoForm.applyTimeType">
                <el-radio :label="0">不限时间</el-radio>
                <el-radio :label="1">
                  <p style="margin-right: 10px; display: inline-block">
                    自定义
                  </p>
                  <el-date-picker
                    style="display: inline-block"
                    v-model="infoForm.onlineEndtime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="报名结束时间"
                  ></el-date-picker>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="学习有效期" prop="studyDeadline">
              <el-radio-group v-model="infoForm.studyDeadline">
                <el-radio :label="0">长期有效</el-radio>
                <el-radio :label="1">
                  <p style="margin-right: 10px; display: inline-block">
                    截止日期
                  </p>
                  <el-date-picker
                    style="display: inline-block"
                    v-model="infoForm.studyEndTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="请选择截止日期"
                  ></el-date-picker>
                </el-radio>
                <el-radio :label="2">
                  <p style="margin-right: 10px; display: inline-block">
                    有效天数
                  </p>
                  <el-input-number
                    v-model="infoForm.onlineIndate"
                    :controls="false"
                    :precision="0"
                    placeholder="请输入有效天数"
                  />
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="title-text">上线设置</div>
            <el-form-item label="上架设计" prop="status">
              <el-radio-group v-model="infoForm.status">
                <el-radio :label="0">立即上架</el-radio>
                <el-radio :label="3">
                  <p style="margin-right: 10px; display: inline-block">
                    定时上架
                  </p>
                  <el-date-picker
                    style="display: inline-block"
                    v-model="infoForm.onUpTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="折扣期限"
                  ></el-date-picker>
                </el-radio>
                <el-radio :label="4">隐藏</el-radio>
                <el-radio :label="1">下架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否推荐" prop="recommend">
              <el-radio-group v-model="infoForm.recommend">
                <el-radio :label="'1'">推荐</el-radio>
                <el-radio :label="'0'">不推荐</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="flex flex-center flex-jcenter">
              <el-button
                type="primary"
                @click="submitInfo"
                round
                style="width: 50%"
                >保存</el-button
              >
            </div>
          </el-form>
        </el-scrollbar>
      </div>
    </el-dialog>
    <!-- 添加课程分类弹框 -->
    <CourseCategory
      @cancelCourseCategory="categoryOpen = false"
      @getList="getTreeselect"
      categoryTitle="添加课程分类"
      :categoryOpen="categoryOpen"
      :dataForm="categoryForm"
      v-if="categoryOpen"
    ></CourseCategory>
    <Labelconfig
      @selectTag="selectTag"
      v-if="openedit"
      :list="infoForm.tagBoList"
      :openedit.sync="openedit"
    />
  </div>
</template>
<script>
import {
  getCourseSubject,
  getSalesMan,
  getTeacherlist,
  uploadImage,
  updateCourseSubject,
  saveVideoMessage
} from "@/api/resource/courseSubject";
import uploadHdVideo from "./uploadHdVideo"; //上传视频
import Labelconfig from "./Labelconfig"; //标签配置
import ImgCutter from "vue-img-cutter";
import EditorTow from "@/components/Tinymce";
import Treeselect from "@riophae/vue-treeselect";
import CourseCategory from "@/components/CourseCategory";
import { treeselect as courseTreeselect } from "@/api/course/courseCategory";
export default {
  components: {
    uploadHdVideo,
    ImgCutter,
    EditorTow,
    Treeselect,
    CourseCategory,
    Labelconfig,
  },
  data() {
    return {
      infoForm: null,
      //优惠规则
      discounts: [
        {
          label: "不设置",
          value: 0,
        },
        {
          label: "优惠价格",
          value: 1,
        },
        {
          label: "优惠折扣",
          value: 2,
        },
      ],
      openedit: false, //标签配置弹窗
      //新增分类弹窗
      categoryOpen: false,
      //分类列表-树形
      courseCategoryOptions: [],
      //讲师列表
      teacherList: [],
      //业务员列表
      salesManList: [],
      rules: {
        subjectTitle: [
          { required: true, message: "课程名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    openUpload: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: String,
      default: "",
    },
  },
  created() {
    this.getDetail();
    this.getTeacher();
    this.getTreeselect();
    this.getSalesManList();
  },
  methods: {
    //更新
    submitInfo(){
      this.infoForm.needCheck = 1
      this.infoForm.edit = 1
      updateCourseSubject(this.infoForm).then(res=>{
        this.$emit("update:openUpload", false);
        this.$emit('success')
      })
    },
    //关闭弹窗
    handleClose() {
      this.$emit("update:openUpload", false);
    },
    //获取详情
    getDetail() {
      getCourseSubject(this.courseId).then((res) => {
        this.infoForm = res.data;
        this.infoForm.id = this.courseId
      });
    },
    //获取业务人员
    getSalesManList() {
      getSalesMan().then((res) => {
        this.salesManList = res.data;
      });
    },
    //获取讲师
    getTeacher() {
      getTeacherlist().then((res) => {
        this.teacherList = res.rows;
      });
    },
    /** 分类添加按钮 */
    categoryAdd() {
      this.categoryForm = {
        id: undefined,
        pid: undefined,
        categoryName: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        sort: 0,
        status: "1",
      };
      this.resetForm("categoryForm");
      this.categoryOpen = true;
    },
    //获取分类树形结构
    getTreeselect() {
      courseTreeselect().then((response) => {
        this.courseCategoryOptions = response.data;
      });
    },
    //添加标签
    selectTag(list) {
      if (list.length > 0) {
        list.forEach((item) => {
          let index = this.infoForm.tagBoList.findIndex(
            (ite) => ite.tagName == item.tagName && ite.id == item.id
          );
          if (index == -1) {
            this.infoForm.tagBoList.push({
              id: item.id,
              tagName: item.tagName,
              tagClassId: item.tagClassId,
            });
          }
        });
      }
    },
    //上传封面图
    cutDownCourse(res) {
      let formData = new FormData();
      formData.append("file", res.file);
      uploadImage(formData).then((resolve) => {
        if (resolve.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.infoForm.subjectImageUrl = resolve.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //上传课程背景图
    cutDownBg(res) {
      let formData = new FormData();
      formData.append("file", res.file);
      uploadImage(formData).then((resolve) => {
        if (resolve.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.infoForm.backgroundImg = resolve.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //添加导学视频
    creatLearnVideo(data) {
      saveVideoMessage(data).then((res) => {
        if(!this.infoForm.videoIds){
          this.infoForm.videoIds=[]
        }
        this.infoForm.videoIds.push(res.data.data);
      });
    },
  },
};
</script>
<style lang="scss">
.info {
  width: 100%;
  padding-top: 20px;
  height: 600px;
  box-sizing: border-box;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 316px;
    height: 178px;
  }
  .avatar-uploader:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 316px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
}
.title-text {
  font-weight: 700;
  font-size: 18px;
  height: 27px;
  line-height: 27px;
  margin-bottom: 10px;
  color: #333;
  padding-left: 10px;
  position: relative;
  &::before {
    content: "";
    background: #2a91ed;
    width: 6px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 5px;
    border-radius: 8px;
  }
}
.flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.flex-start {
  align-items: flex-start;
  -webkit-align-items: flex-start;
  box-align: flex-start;
  -moz-box-align: flex-start;
  -webkit-box-align: flex-start;
}

.flex-end {
  align-items: flex-end;
  -webkit-align-items: flex-end;
  box-align: flex-end;
  -moz-box-align: flex-end;
  -webkit-box-align: flex-end;
}

.flex-center {
  align-items: center;
  -webkit-align-items: center;
  box-align: center;
  -moz-box-align: center;
  -webkit-box-align: center;
}

.flex-jend {
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  -moz-box-pack: flex-end;
  -webkit--moz-box-pack: flex-end;
  box-pack: flex-end;
}

.flex-jcenter {
  -webkit-justify-content: center;
  justify-content: center;
  -moz-box-pack: center;
  -webkit--moz-box-pack: center;
  box-pack: center;
}

.flex-between {
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -moz-box-pack: space-between;
  -webkit--moz-box-pack: space-between;
  box-pack: space-between;
}

.flex-column {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
}

.flex-wrap {
  -webkit-flex-wrap: wrap;
  -webkit-box-lines: multiple;
  -moz-flex-wrap: wrap;
  flex-wrap: wrap;
}
</style>
