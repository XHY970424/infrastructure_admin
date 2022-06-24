<template>
  <div class="course-detail">
    <el-dialog
      title="课程详情"
      :visible.sync="detailShow"
      width="800px"
      :before-close="handleClose"
    >
      <div class="flex flex-between" v-if="statusType!=2">
        <div></div>
        <div class="flex">
          <el-button size="mini" type="text" style="margin-right: 10px" @click="openUpload=true"
            >编辑
          </el-button>
          <el-button size="mini" type="text">复制课程信息 </el-button>
        </div>
      </div>
      <div class="info" v-if="info">
        <el-scrollbar style="height: 100%">
          <el-form label-width="120px" size="mini">
            <div class="title-text">名称</div>
            <el-form-item label="课程名称：">{{
              info.subjectTitle
            }}</el-form-item>
            <el-form-item v-if="info.teacherName" label="授课老师：">{{
              info.teacherName
            }}</el-form-item>
            <el-form-item v-if="info.categoryName" label="课程分类：">{{
              info.categoryName
            }}</el-form-item>
            <el-form-item label="报名截止时间：">{{
              info.applyTimeType == 0 ? "无限期" : info.onlineEndtime
            }}</el-form-item>
            <el-form-item label="业务人员：" v-if="info.salesmanVo">
              <el-popover placement="top-start" width="300" trigger="hover">
                <div class="salesman flex">
                  <el-image
                    class="wx-code"
                    :src="info.salesmanVo.weixinUrl"
                  ></el-image>
                  <div class="call">
                    <div class="name">{{ info.salesmanVo.salesmanName }}</div>
                    <div class="phone">
                      联系方式:{{ info.salesmanVo.phone }}
                    </div>
                    <div class="phone">
                      {{ info.salesmanVo.workDays }}
                      {{ info.salesmanVo.workStartTime }}~{{
                        info.salesmanVo.workEndTime
                      }}
                    </div>
                  </div>
                </div>
                <span
                  slot="reference"
                  style="color: #409eff; cursor: pointer"
                  >{{ info.salesmanVo.salesmanName }}</span
                >
              </el-popover>
            </el-form-item>
            <el-form-item label="总学时：">{{
              info.subjectHours
            }}</el-form-item>
            <el-form-item label="课程标签：">
              <el-tag
                v-for="(item, i) in info.tagBoList"
                style="margin-right: 10px"
                :key="i"
              >
                {{ item.tagName }}
              </el-tag>
            </el-form-item>
            <el-form-item label="课程封面：">
              <el-image :src="info.subjectImageUrl"></el-image>
            </el-form-item>
            <el-form-item label="背景图片：">
              <el-image :src="info.backgroundImg"></el-image>
            </el-form-item>
            <el-form-item label="课程介绍：">
              <el-button
                type="primary"
                round
                plain
                icon="el-icon-view"
                @click="open = true"
                >查看视图</el-button
              >
            </el-form-item>
            <div class="title-text">导学视频</div>
            <el-table :data="info.videoDataListVoList" border height="300">
              <el-table-column
                label="文件名"
                align="center"
                prop="sectionTitle"
              />
              <el-table-column label="大小" align="center" prop="videoSize" />
              <!-- <el-table-column
                label="操作"
                align="center"
                v-if="false"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleDelete(scope.$index)"
                    >删除
                  </el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="title-text">营销设置</div>
            <el-form-item label="课程价格：">￥{{ info.price }}</el-form-item>
            <el-form-item label="价格显示：">{{
              info.showPrice == 1 ? "显示" : "不显示"
            }}</el-form-item>
            <el-form-item label="启用优惠：" v-if="info.discount == 1"
              >￥{{ info.discountPrice }} {{ info.discountPrice }}</el-form-item
            >
            <el-form-item label="启用折扣：" v-if="info.discount == 2"
              >折{{ info.discountPrice }}</el-form-item
            >
            <div class="title-text">课程配置信息</div>
            <el-form-item label="加入学习：">{{
              info.flowOnline == 1 ? "自主支付" : "联系业务人员"
            }}</el-form-item>
            <el-form-item label="报名时间：">{{
              info.applyTimeType == 0 ? "无限期" : info.onlineEndtime
            }}</el-form-item>
            <el-form-item label="实名认证：">{{
              info.isAuth == 1 ? "需要" : "不需要"
            }}</el-form-item>
            <el-form-item label="学习有效期：">{{
              info.studyDeadline == 0
                ? "长期有效"
                : info.studyDeadline == 1
                ? `截止日期${info.studyEndTime}`
                : `有效天数 ${info.onlineIndate}天`
            }}</el-form-item>
            <el-form-item label="上架设定：">{{
              info.status == 0
                ? "上架"
                : info.status == 1
                ? "下架"
                : info.status == 4
                ? "隐藏"
                : info.status == 3
                ? `${info.onUpTime}上架`
                : ""
            }}</el-form-item>
            <el-form-item label="是否推荐：">{{
              info.recommend == 0 ? "否" : "是"
            }}</el-form-item>
            <div class="title-text" v-if="chapterList.length">课程内容</div>
            <div class="left-chapter" v-if="chapterList.length">
              <div class="chapter" v-for="item in chapterList" :key="item.id">
                <div class="chapter-item flex flex-center">
                  <i class="el-icon-lock is-lock" v-show="item.isLock == 1"></i>
                  <div class="flex flex-end">
                    <div class="chapter-name">{{ item.title }}</div>
                    <div
                      class="question flex flex-end"
                      v-show="item.paperId > 0"
                    >
                      <i class="el-icon-document icon"></i>
                      <div class="question-name">
                        {{ item.paperExamName }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="child-chapter">
                  <div
                    class="child-item flex flex-center"
                    v-for="child in item.sectionList"
                    :key="child.sectionId"
                  >
                    <i
                      class="el-icon-lock is-lock"
                      v-show="child.isLock == 1"
                    ></i>
                    <div class="flex flex-center">
                      <div class="chapter-name">
                        {{ child.sectionTitle }}
                      </div>
                      <div
                        class="question flex flex-end"
                        v-show="child.sectionPaperId > 0"
                      >
                        <i class="el-icon-document icon"></i>
                        <div class="question-name">
                          {{ child.sectionPaperExamName }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="title-text" v-if="helpOption.length">常见问题</div>
            <div class="problem" v-if="helpOption.length">
              <div
                class="problem-grouy"
                v-for="(item, index) in helpOption"
                :key="index"
              >
                <div>Q：{{ item.title }}</div>
                <div class="flex flex-center">
                  A：<span v-html="item.content"></span>
                </div>
              </div>
            </div>
          </el-form>
        </el-scrollbar>
      </div>
    </el-dialog>
    <el-dialog title="课程介绍" width="600px" :visible.sync="open">
      <div v-html="introduce"></div>
    </el-dialog>
    <update-course :openUpload.sync="openUpload" :courseId="courseId" @success="updateSuccess" v-if="openUpload"></update-course>
  </div>
</template>

<script>
import { getCourseSubject, getChapterList } from "@/api/resource/courseSubject";
import updateCourse from "./updateCourse"; //更新课程
export default {
  components:{
    updateCourse
  },
  props: {
    //课程详情
    detailShow: {
      type: Boolean,
      default: true,
    },
    //课程id
    courseId: {
      type: String,
      default: "",
    },
    //状态
    statusType:{
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      list: [],
      //章节列表
      chapterList: [],
      //常见问题
      helpOption: [],
      //详情
      info: null,
      //课程介绍弹窗
      open: false,
      //课程介绍
      introduce: null,
      //更新弹窗
      openUpload:false
    };
  },
  created() {
    this.getDetail();
    this.getChapter();
  },
  methods: {
    updateSuccess(){
      this.handleClose()
      this.$emit('success')
    },
    //关闭弹窗
    handleClose() {
      this.$emit("update:detailShow", false);
    },
    //获取详情
    getDetail() {
      getCourseSubject(this.courseId).then((res) => {
        this.info = res.data;
        this.helpOption = res.data.eyHelpContentVoList;
        this.introduce = res.data.subjectIntroduction;
      });
    },
    //获取章节以及小节
    getChapter() {
      getChapterList(this.courseId).then((res) => {
        res.data.chapterList.forEach((item) => {
          item.sectionList = item.sectionList.filter(
            (ite) => ite.sectionId > 0
          );
        });
        this.chapterList = res.data.chapterList;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.salesman {
  .wx-code {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
  .name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    line-height: 18px;
    margin-bottom: 20px;
  }
  .phone {
    font-size: 14px;
    line-height: 14px;
    color: #666;
    margin-top: 14px;
  }
}
.info {
  height: 650px;
}
.left-chapter {
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #ececec;
  .chapter-item {
    background-color: #ececec;
  }
  .chapter-item,
  .child-item {
    width: 100%;
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    .is-lock {
      width: 24px;
      height: 24px;
      line-height: 24px;
      font-size: 18px;
      color: #000;
      font-weight: bold;
    }

    .chapter-name {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }

    .question {
      margin-left: 20px;
      font-size: 12px;
      color: #409eff;
      .question-name {
        margin: 0 4px;
      }
    }
  }

  .child-chapter {
    width: 100%;
    padding-left: 20px;
    box-sizing: border-box;
  }
}
.problem {
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  max-height: 450px;
  overflow-y: auto;
  .problem-grouy {
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0px;
    div {
      line-height: 25px;
    }
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
.mb10 {
  margin-bottom: 10px;
}
</style>