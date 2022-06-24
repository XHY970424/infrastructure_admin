<template>
  <div>
    <el-dialog
      title="新增课程-选择类型"
      :visible.sync="isShow"
      :before-close="addClose"
      v-if="!isUpdate && !isKnobble"
      width="1200px"
      append-to-body
    >
      <div
        class="flex flex-center flex-between"
        style="padding: 0 20px; box-sizing: border-box"
      >
        <div class="type-item" @click="addCurriculum(0)">
          <div class="icon">
            <img
              src="https://vo.bbazxw.com/admin_infrastructure/recorded_icon.png"
              alt=""
            />
          </div>
          <div class="title">录播课</div>
          <div class="introduce">
            将教学课程内容录制好，上传到平台，学员可以自由选择观看时间
          </div>
        </div>
        <div class="type-item">
          <div class="icon">
            <img
              src="https://vo.bbazxw.com/admin_infrastructure/offline_icon.png"
              alt=""
            />
          </div>
          <div class="title">面授课</div>
          <div class="introduce">
            模拟线下真实教学场景进行配置，学员根据课程信息到指定地点上课
          </div>
        </div>
        <div class="type-item">
          <div class="icon">
            <img
              src="https://vo.bbazxw.com/admin_infrastructure/live_icon.png"
              alt=""
            />
          </div>
          <div class="title">直播课</div>
          <div class="introduce">
            打造教师和学员无缝对接，学员可以在指定时间进入直播间学习
          </div>
        </div>
        <div class="type-item">
          <div class="icon">
            <img
              src="https://vo.bbazxw.com/admin_infrastructure/subject_icon.png"
              alt=""
            />
          </div>
          <div class="title">专题</div>
          <div class="introduce">
            将录播课、面授课、直播课一体化，实现课程多样性
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="`新增课程-${title}`"
      :visible.sync="open"
      width="1000px"
      append-to-body
      :before-close="close"
    >
      <div class="steps-box">
        <el-steps :active="active" align-center>
          <el-step title="课程信息" v-if="!isKnobble"></el-step>
          <el-step title="添加小节"></el-step>
          <el-step title="内容配置"></el-step>
        </el-steps>
      </div>
      <div class="info" v-show="active == 1" v-if="!isKnobble">
        <el-scrollbar style="height: 100%">
          <el-form
            ref="infoForm"
            :model="infoForm"
            label-width="120px"
            :rules="rules"
          >
            <div class="title-text">{{ title }}课程信息</div>
            <el-form-item label="课程名称" prop="subjectTitle">
              <el-input
                v-model="infoForm.subjectTitle"
                :maxlength="35"
                placeholder="请输入课程名称"
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
                @close="deleTag(i)"
                closable
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
                v-if="open"
                v-model="infoForm.subjectIntroduction"
              />
            </el-form-item>
            <div class="title-text">上传导学视频</div>
            <upload-hd-video
              @creatVideo="creatLearnVideo"
              :videoList="videoDataListVoList"
            ></upload-hd-video>
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
            <el-form-item label="优惠规则" prop="discount">
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
                <el-col :span="5" v-if="infoForm.discount != 0">
                  <el-form-item
                    label=""
                    prop="discountPrice"
                    v-if="infoForm.discount == 2"
                    :rules="validateForm(infoForm.discount)"
                  >
                    <el-input-number
                      style="width: 100%"
                      v-model="infoForm.discountPrice"
                      placeholder="优惠折扣"
                      :min="0"
                      :controls="false"
                      :precision="1"
                    />
                  </el-form-item>
                  <el-input-number
                    style="width: 100%"
                    v-model="infoForm.discountPrice"
                    v-show="infoForm.discount != 2"
                    placeholder="优惠价格"
                    :min="0"
                    :controls="false"
                    :precision="2"
                  />
                </el-col>
                <el-col :span="5" v-if="infoForm.discount != 0">
                  <el-form-item
                    label=""
                    prop="discountStartTime"
                    :rules="[
                      {
                        message: '起始时间不能大于结束时间',
                        validator: this.validatorDate,
                        trigger: ['blur', 'change'],
                      },
                    ]"
                  >
                    <el-date-picker
                      style="width: 100%"
                      v-model="infoForm.discountStartTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="优惠开始期限"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="5" v-if="infoForm.discount != 0">
                  <el-form-item
                    label=""
                    prop="discountEndTime"
                    :rules="[
                      {
                        message: '起始时间不能大于结束时间',
                        validator: this.validatorDate,
                        trigger: ['blur', 'change'],
                      },
                    ]"
                  >
                    <el-date-picker
                      style="width: 100%"
                      v-model="infoForm.discountEndTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="优惠结束期限"
                    >
                    </el-date-picker>
                  </el-form-item>
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
                >下一步</el-button
              >
            </div>
          </el-form>
        </el-scrollbar>
      </div>
      <div
        class="upload"
        style="padding-top: 20px"
        v-show="(!isKnobble && active == 2) || (isKnobble && active == 1)"
      >
        <div class="title-text">添加小节</div>
        <upload-hd-video
          v-if="isViewUpload"
          @creatVideo="creatVideo"
          :isNext.sync="isNext"
        ></upload-hd-video>
        <div class="flex flex-center flex-jcenter" style="margin-top: 20px">
          <el-button
            type="primary"
            @click="goEditInfo"
            plain
            round
            v-if="!isKnobble"
            style="width: 25%"
            >上一步</el-button
          >
          <el-button
            type="primary"
            @click="submitVideo"
            round
            style="width: 25%"
            >下一步</el-button
          >
        </div>
      </div>
      <div
        class="content-set"
        v-show="(!isKnobble && active == 3) || (isKnobble && active == 2)"
      >
        <div class="flex box">
          <div class="left-chapter">
            <el-scrollbar style="height: 100%">
              <div
                class="chapter"
                v-for="(item, index) in chapterList"
                :key="item.id"
              >
                <div class="chapter-item flex flex-center flex-between">
                  <i class="el-icon-lock is-lock" v-show="item.isLock == 1"></i>
                  <!-- 全选 -->
                  <div
                    class="check-box flex flex-center flex-jcenter"
                    :class="{ on: item.isSelectAll }"
                    @click="selectAll(index)"
                    v-show="setType == 2 && item.sectionList.length > 0"
                  >
                    <img
                      v-show="item.isSelectAll"
                      src="https://vo.bbazxw.com/admin_infrastructure/check_on.png"
                      class="check"
                      alt=""
                    />
                  </div>
                  <!-- 全选end -->
                  <div
                    class="radio-box flex flex-center flex-jcenter"
                    @click="selectChapter(index)"
                    :class="{ on: item.isSelect }"
                    v-show="setType == 1"
                  >
                    <div class="radio" v-show="item.isSelect"></div>
                  </div>
                  <div
                    class="radio-box flex flex-center flex-jcenter"
                    @click="selectChapterAndChid(-1, index)"
                    :class="{ on: item.isSelect }"
                    v-show="setType == 3"
                  >
                    <div class="radio" v-show="item.isSelect"></div>
                  </div>
                  <div class="flex flex-end">
                    <el-tooltip
                      effect="dark"
                      :content="item.title"
                      placement="bottom"
                      v-show="!item.isEdit"
                    >
                      <div class="chapter-name" @click="editName(index)">
                        {{ item.title }}
                      </div>
                    </el-tooltip>
                    <el-input
                      v-model="item.title"
                      size="small"
                      :id="`editChapter${index}`"
                      :maxlength="35"
                      :autofocus="true"
                      v-show="item.isEdit"
                      :ref="`editChapter${index}`"
                      @keyup.enter.native="
                        editChapter(item.id, item.title, index)
                      "
                      @blur="editChapter(item.id, item.title, index)"
                      placeholder="请输入章节名称"
                    />

                    <div
                      class="question flex flex-end"
                      v-show="item.paperId > 0"
                    >
                      <i class="el-icon-document icon"></i>
                      <div class="question-name">{{ item.paperExamName }}</div>
                      <i
                        class="el-icon-close close"
                        @click="deleteExam(item.id, 1)"
                      ></i>
                    </div>
                  </div>
                  <i
                    class="el-icon-close close-btn"
                    @click="removeChapter(index)"
                  ></i>
                </div>
                <div class="child-chapter">
                  <div
                    class="child-item flex flex-center flex-between"
                    v-for="(child, i) in item.sectionList"
                    :key="child.sectionId"
                  >
                    <i
                      class="el-icon-lock is-lock"
                      v-show="child.isSectionLock == 1"
                    ></i>
                    <div
                      class="radio-box flex flex-center flex-jcenter"
                      :class="{ on: child.isSelect }"
                      v-show="setType == 3"
                      @click="selectChapterAndChid(index, i)"
                    >
                      <div class="radio" v-show="child.isSelect"></div>
                    </div>
                    <div
                      class="check-box flex flex-center flex-jcenter"
                      :class="{ on: child.isSelect }"
                      @click="checkCild(index, i)"
                      v-show="setType == 2"
                    >
                      <img
                        v-show="child.isSelect"
                        src="https://vo.bbazxw.com/admin_infrastructure/check_on.png"
                        class="check"
                        alt=""
                      />
                    </div>
                    <i
                      class="el-icon-setting setting"
                      v-show="child.isUpdate == 1"
                    ></i>
                    <div class="flex flex-center">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="child.sectionTitle"
                        placement="bottom"
                      >
                        <div
                          class="chapter-name"
                          @click="selectItem(child)"
                          :class="{ hove: setType == 2 }"
                        >
                          {{ child.sectionTitle }}
                        </div>
                      </el-tooltip>

                      <div
                        class="question flex flex-end"
                        v-show="child.sectionPaperId > 0"
                      >
                        <i class="el-icon-document icon"></i>
                        <div class="question-name">
                          {{ child.sectionPaperExamName }}
                        </div>
                        <i
                          class="el-icon-close close"
                          @click="deleteExam(child.sectionId, 2)"
                        ></i>
                      </div>
                    </div>
                    <div class="flex flex-center">
                      <i
                        class="el-icon-refresh refresh-btn"
                        @click="refreshVideo(child.sectionId)"
                      ></i>
                      <i
                        class="el-icon-remove-outline remove-btn"
                        @click="delVideo(child.sectionId)"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <el-button
                v-show="!isAdd"
                type="primary"
                icon="el-icon-plus"
                style="margin-top: 20px"
                size="mini"
                @click="isAdd = true"
                plain
                >新增章节</el-button
              >
              <div
                class="flex flex-center"
                style="margin-top: 20px"
                v-show="isAdd"
              >
                <el-input
                  v-model="addTitle"
                  placeholder="请输入章节名称"
                  clearable
                  style="flex: 1"
                  size="small"
                  @keyup.enter.native="addChapter"
                />
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  style="margin-left: 10px"
                  size="mini"
                  @click="addChapter"
                  >新增</el-button
                >
              </div>
            </el-scrollbar>
          </div>
          <div class="right">
            <el-tabs v-model="setType" v-if="isView" @tab-click="handleClick">
              <el-tab-pane label="小节" name="1"></el-tab-pane>
              <el-tab-pane label="设置" name="2"></el-tab-pane>
              <el-tab-pane label="试题" name="3"></el-tab-pane>
            </el-tabs>
            <div class="knobble" v-show="setType == 1">
              <div class="flex flex-center">
                <el-input
                  v-model="chapterParams.titleName"
                  placeholder="请输入小节名称"
                  clearable
                  style="flex: 1"
                  size="small"
                  @keyup.enter.native="getVideoList"
                />
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  style="margin-left: 10px"
                  size="mini"
                  @click="getVideoList"
                  >搜索</el-button
                >
              </div>
              <div class="knobble-list">
                <el-scrollbar style="height: 100%">
                  <div
                    class="knobble-item flex flex-center flex-between"
                    v-for="(item, index) in videoList"
                    :key="item.id"
                    @click="selectVideo(index)"
                  >
                    <div class="flex flex-center">
                      <div
                        class="check-box flex flex-center flex-jcenter"
                        :class="{ on: item.select }"
                      >
                        <img
                          v-show="item.select"
                          src="https://vo.bbazxw.com/admin_infrastructure/check_on.png"
                          class="check"
                          alt=""
                        />
                      </div>
                      <div class="name">{{ item.sectionTitle }}</div>
                    </div>
                    <i
                      class="el-icon-close close-btn"
                      @click="removeKnobble(item.videoId)"
                    ></i>
                  </div>
                </el-scrollbar>
              </div>
              <div class="flex flen-end">
                <div class="check-all flex flex-center">
                  <div
                    class="check-box flex flex-center flex-jcenter"
                    :class="{ on: isAll }"
                    @click="selectAllVideo"
                  >
                    <img
                      v-show="isAll"
                      src="https://vo.bbazxw.com/admin_infrastructure/check_on.png"
                      class="check"
                      alt=""
                    />
                  </div>
                  <div class="name">全选</div>
                </div>
                <el-button
                  type="success"
                  icon="el-icon-back"
                  style="margin-left: 20px"
                  size="mini"
                  @click="bindKnobble"
                  plain
                  >加入章节</el-button
                >
              </div>
            </div>
            <div class="set" v-show="setType == 2">
              <el-form ref="form" :model="knobbleForm" label-width="100px">
                <div class="title-text">小节配置</div>
                <el-form-item label="活体检测" prop="type" class="set-item">
                  <el-radio-group v-model="knobbleForm.onlineAuth">
                    <el-radio :label="0">不需要</el-radio>
                    <el-radio :label="1">定时验证码</el-radio>
                    <el-radio :label="2">活体检测</el-radio>
                    <el-radio :label="3">人脸检测</el-radio>
                    <el-radio :label="4">人脸识别</el-radio>
                    <el-radio :label="5">人脸抓拍录制</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="检测间隔时间" prop="onlineAuthInterval">
                  <el-row type="flex" align="top">
                    <el-col :span="10">
                      <el-input
                        v-model="knobbleForm.onlineAuthInterval"
                        placeholder="间隔时间"
                      ></el-input>
                    </el-col>
                    <el-col :span="10">
                      <span style="margin-left: 10px">分钟</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="学习类型" prop="learnType">
                  <el-radio-group v-model="knobbleForm.learnType">
                    <el-radio :label="0">选学</el-radio>
                    <el-radio :label="1">必学</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="试看视频"
                  prop="tryAndSee"
                  class="set-item"
                >
                  <el-radio-group v-model="knobbleForm.tryAndSee">
                    <el-radio :label="0">关闭</el-radio>
                    <el-radio :label="1">
                      <p style="margin-right: 10px; display: inline-block">
                        视频前
                      </p>
                      <el-input
                        style="width: 20%"
                        v-model="knobbleForm.tryTime"
                        placeholder="s(秒)"
                      ></el-input>
                      <p style="margin-left: 10px; display: inline-block">
                        s(秒)试看
                      </p>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-button type="primary" @click="submitCofing" round
                  >保存设置</el-button
                >
              </el-form>
            </div>
            <div class="question-box" v-show="setType == 3">
              <div class="flex flex-center">
                <el-input
                  v-model="questionParams.examName"
                  placeholder="请输入试题名称"
                  clearable
                  style="flex: 1"
                  size="small"
                  @keyup.enter.native="getExampaperList"
                />
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  style="margin-left: 10px"
                  size="mini"
                  @click="getExampaperList"
                  >搜索</el-button
                >
              </div>
              <div class="question-list">
                <el-scrollbar style="height: 100%">
                  <!-- <el-collapse accordion>
                    <el-collapse-item
                      title="英语"
                      v-for="(item, index) in 10"
                      :key="index"
                    >
                      <div
                        class="question-item flex flex-center"
                        v-for="(question, i) in 10"
                        :key="i"
                      >
                        <div class="radio-box on flex flex-center flex-jcenter">
                          <div class="radio"></div>
                        </div>
                        <div class="name">试题名称</div>
                      </div>
                    </el-collapse-item>
                  </el-collapse> -->
                  <div
                    class="question-item flex flex-center"
                    v-for="(question, i) in exampaper"
                    @click="selectQuestion(i)"
                    :key="question.id"
                  >
                    <div
                      class="radio-box flex flex-center flex-jcenter"
                      :class="{ on: question.id == questionId }"
                    >
                      <div
                        class="radio"
                        v-show="question.id == questionId"
                      ></div>
                    </div>
                    <div class="name">{{ question.examName }}</div>
                  </div>
                </el-scrollbar>
              </div>
              <el-button
                type="success"
                icon="el-icon-back"
                size="mini"
                @click="bindEexam"
                plain
                >配置试题</el-button
              >
            </div>
          </div>
        </div>
        <div class="unlock-type">
          <el-form ref="form" :model="unlockTypeForm" label-width="100px">
            <el-form-item label="内容解锁模式" prop="type">
              <el-radio-group
                v-model="unlockTypeForm.lockType"
                @change="changeLockType"
              >
                <el-radio :label="1">自由式</el-radio>
                <el-radio :label="2">小节解锁式</el-radio>
                <el-radio :label="3">章节解锁式</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="flex flex-center flex-jcenter" style="margin-top: 20px">
          <el-button
            type="primary"
            plain
            round
            style="width: 25%"
            @click="goTop"
            >上一步</el-button
          >
          <el-button type="primary" round style="width: 25%" @click="complete"
            >完成</el-button
          >
        </div>
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
import uploadHdVideo from "./uploadHdVideo"; //上传视频
import Labelconfig from "./Labelconfig"; //标签配置
import ImgCutter from "vue-img-cutter";
import EditorTow from "@/components/Tinymce";
import Treeselect from "@riophae/vue-treeselect";
import CourseCategory from "@/components/CourseCategory";
import {
  getChapterList,
  addChapterItem,
  removeChapterItem,
  saveVideoMessage,
  quitVideo,
  exampaperList,
  bindQuestion,
  deleteQuestions,
  updatelock,
  configure,
  bindvideo,
  replaceVideo,
  removeSection,
  addCourseSubject,
  getTeacherlist,
  getSalesMan,
  uploadImage,
  changeSteps,
  getCourseSubject,
  updateCourseSubject,
  editChapterItem,
} from "@/api/resource/courseSubject";
import { delVideo } from "@/api/course/scene";
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
  props: {
    //新增课程-选择类型弹窗
    isShow: {
      type: Boolean,
      default: false,
    },
    //是否是继续添加课程
    isUpdate: {
      type: Boolean,
      default: false,
    },
    //课程id
    updateId: {
      type: String,
      default: "",
    },
    //是否是小节配置
    isKnobble: {
      type: Boolean,
      default: false,
    },
    //步骤-是小节配置时启用
    steps: {
      type: Number,
      default: 1,
    },
  },
  data() {
    const validator = (rule, value, callback) => {
      let num = Number(value);
      if (!(num > 0 && num < 10)) {
        return callback(new Error("折扣需大于0小于10"));
      }else{
        return callback()
      }
    };
    const validatorDate = (rule, value, callback) => {
      let startTime = this.infoForm.discountStartTime
      let endTime = this.infoForm.discountEndTime
      if(new Date(startTime).getTime() > new Date(endTime).getTime()){
        return callback(new Error("起始时间不能大于结束时间"));
      }else{
        return callback()
      }
    };
    return {
      validatorDate:validatorDate,
      validator: validator,
      //是否重新渲染上传视频
      isViewUpload: true,
      //上传视频是否下一步
      isNext: true,
      //导学视频
      videoDataListVoList: [],
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
      //是否渲染
      isView: true,
      //课程id
      courseId: "",
      //章节列表-树形
      chapterList: [],
      //是否新增章节
      isAdd: false,
      //新增章节名称
      addTitle: "",
      //试卷列表
      exampaper: [],
      //小节参数
      chapterParams: {
        titleName: "",
        isBind: 0,
        type: 1,
      },
      //未分配的小节列表
      videoList: [],
      //是否全选
      isAll: false,
      //小节是否全选
      isSelectAll: false,
      //试卷参数
      questionParams: {
        examName: "",
        isBind: 0,
      },
      //试卷id
      questionId: "",
      //试卷名称
      paperName: "",
      //新增弹窗
      open: false,
      //新增标题
      title: "录播",
      //步骤
      active: 1,
      //选择类型
      setType: "1",
      //新增分类
      categoryForm: {},
      //基本信息
      infoForm: {
        subjectTitle: "", //课程标题
        teacherIds: undefined, //讲师id
        categoryId: undefined, //分类id
        salesmanId: undefined, //业务员id
        subjectHours: "", //总学时//总学时 可带小数
        tagBoList: [], //标签数组
        subjectImageUrl: "", //课程封面
        backgroundImg: "", //课程背景图
        subjectIntroduction: "", //课程简介
        videoIds: [], //导学视频id
        price: "",
        showPrice: 1, //是否展示价格
        discount: 0, //优惠规则
        discountPrice: "", //优惠价格
        discountStartTime: "", //优惠/折扣开始时间
        discountEndTime: "", //优惠/折扣结束时间
        isAuth: 0,
        flowOnline: 1,
        applyTimeType: 0, //报名截止时间类型
        onlineEndtime: "", //自定义的报名截止时间
        studyDeadline: 0, //学习有效期限制类型
        studyEndTime: "", //截止时间
        onlineIndate: "", //有效天数
        status: 0, //上架设定
        onUpTime: "", //定时上架的时间
        recommend: 0, //是否推荐
        method: 0, //课程类型
        needCheck: 0, //是否需要校验数据 -草稿不需要
      },
      unlockTypeForm: {
        lockType: 1,
      },
      //小节配置
      knobbleForm: {
        onlineAuth: 0, //是否需要活体检测 0-不校验 1-定时验证码 2-活体检测 3-人脸检测 4-人脸识别 5-人脸抓拍录制
        onlineAuthInterval: "", //验证间隔(每隔多少秒验证一次)
        learnType: 0, //	必学选学 0-选学 1-必学
        tryAndSee: 0, // 是否试看(0否，1是)
        tryTime: "", //试看时长(秒) 0-不允许试看
        lockType: 1,
        subjectId: "",
      },
      rules: {
        subjectTitle: [
          { required: true, message: "课程名称不能为空", trigger: "blur" },
        ],
        teacherIds: [
          { required: true, message: "授课老师不能为空", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "课程分类不能为空", trigger: "blur" },
        ],
        salesmanId: [
          { required: true, message: "业务人员不能为空", trigger: "blur" },
        ],
        subjectImageUrl: [
          { required: true, message: "课程封面不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    //监听弹窗显示
    isShow(newVal) {
      this.initForm();
      this.active = 1;
      this.courseId = "";
      if (this.isUpdate && newVal) {
        this.open = true;
        this.courseId = this.updateId;
        this.getDetail();
      }
      if (this.isKnobble && newVal) {
        this.open = true;
        this.courseId = this.updateId;
        this.active = this.steps;
      }
    },
    //监听步骤
    active(newVal) {
      if (this.isKnobble) {
        if (newVal == 2) {
          this.isViewUpload = false;
          //isKnobble=true时newVal==2为最后一步
          this.getChapter();
          if (this.setType == 1) {
            this.getVideoList();
          } else if (this.setType == 3) {
            this.getExampaperList();
          }
        } else {
          this.isViewUpload = true;
        }
      } else {
        if (newVal == 1) {
          this.isViewUpload = true;
          this.getTreeselect();
          this.getTeacher();
          this.getSalesManList();
        } else if (newVal == 3) {
          this.isViewUpload = false;
          this.getChapter();
          if (this.setType == 1) {
            this.getVideoList();
          } else if (this.setType == 3) {
            this.getExampaperList();
          }
        } else {
          this.isViewUpload = true;
        }
      }
    },
    //监听第三步骤-类型改变
    setType(newVal, oldVal) {
      if (newVal == 2) {
        let length = this.chapterList.filter(
          (item) => item.sectionList && item.sectionList.length > 0
        ).length;
        if (length <= 0) {
          this.msgError("必须配置小节才能进行设置小节和配置试题");
          this.setType = oldVal;
          this.isView = false;
          setTimeout(() => {
            this.isView = true;
          });
        }
      }
    },
  },
  created() {
    if (this.isKnobble) {
      if (this.active == 2) {
        //isKnobble=true时this.active==2为最后一步
        this.getChapter();
        if (this.setType == 1) {
          this.getVideoList();
        } else if (this.setType == 3) {
          this.getExampaperList();
        }
      }
    } else {
      if (this.active == 1) {
        this.getTreeselect();
        this.getTeacher();
        this.getSalesManList();
      } else if (this.active == 3) {
        this.getChapter();
        if (this.setType == 1) {
          this.getVideoList();
        } else if (this.setType == 3) {
          this.getExampaperList();
        }
      }
    }
  },
  computed: {
    validateForm() {
      return (item) => {
        return item == 2
          ? [
              {
                validator: this.validator,
                trigger: "blur",
              },
            ]
          : null;
      };
    },
    //数字转文字
    convertToChinaNum() {
      return (num) => {
        var arr1 = new Array(
          "零",
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九"
        );

        var arr2 = new Array(
          "",
          "十",
          "百",
          "千",
          "万",
          "十",
          "百",
          "千",
          "亿",
          "十",
          "百",
          "千",
          "万",
          "十",
          "百",
          "千",
          "亿"
        ); //可继续追加更高位转换值

        if (!num || isNaN(num)) {
          return "零";
        }

        var english = num.toString().split("");

        var result = "";

        for (var i = 0; i < english.length; i++) {
          var des_i = english.length - 1 - i; //倒序排列设值

          result = arr2[i] + result;

          var arr1_index = english[des_i];

          result = arr1[arr1_index] + result;
        }

        //将【零千、零百】换成【零】 【十零】换成【十】

        result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十");

        //合并中间多个零为一个零

        result = result.replace(/零+/g, "零");

        //将【零亿】换成【亿】【零万】换成【万】

        result = result.replace(/零亿/g, "亿").replace(/零万/g, "万");

        //将【亿万】换成【亿】

        result = result.replace(/亿万/g, "亿");

        //移除末尾的零

        result = result.replace(/零+$/, "");

        //将【零一十】换成【零十】

        //result = result.replace(/零一十/g, '零十');

        //貌似正规读法是零一十

        //将【一十】换成【十】

        result = result.replace(/^一十/g, "十");

        return result;
      };
    },
  },
  mounted() {},
  methods: {
    //修改章节名称-自动聚焦
    editName(index) {
      this.chapterList[index].isEdit = true;
      setTimeout(() => {
        document.getElementById(`editChapter${index}`).focus();
      }, 200);
    },
    //第二步骤返回上一层
    goEditInfo() {
      this.active = 1;
      if (this.isUpdate) {
        this.getDetail(false);
      }
    },
    //第三步骤返回上一层
    goTop() {
      this.isNext = true;
      if (this.isKnobble) {
        this.active = 1;
      } else {
        this.active = 2;
      }
    },
    //初始化
    initForm() {
      this.infoForm = {
        subjectTitle: "", //课程标题
        teacherIds: undefined, //讲师id
        categoryId: undefined, //分类id
        salesmanId: undefined, //业务员id
        subjectHours: "", //总学时//总学时 可带小数
        tagBoList: [], //标签数组
        subjectImageUrl: "", //课程封面
        backgroundImg: "", //课程背景图
        subjectIntroduction: "", //课程简介
        videoIds: [], //导学视频id
        price: "",
        showPrice: 1, //是否展示价格
        discount: 0, //优惠规则
        discountPrice: "", //优惠价格
        discountStartTime: "", //优惠/折扣开始时间
        discountEndTime: "", //优惠/折扣结束时间
        isAuth: 0,
        flowOnline: 1,
        applyTimeType: 0, //报名截止时间类型
        onlineEndtime: "", //自定义的报名截止时间
        studyDeadline: 0, //学习有效期限制类型
        studyEndTime: "", //截止时间
        onlineIndate: "", //有效天数
        status: 0, //上架设定
        onUpTime: "", //定时上架的时间
        recommend: "0", //是否推荐
        method: 0, //课程类型
        needCheck: 0, //是否需要校验数据 -草稿不需要
      };
    },
    //获取课程详情
    getDetail(isGo = true) {
      getCourseSubject(this.courseId).then((res) => {
        this.infoForm = res.data;
        this.infoForm.id = this.courseId;
        this.videoDataListVoList = res.data.videoDataListVoList;
        if (isGo) {
          this.active = res.data.isSteps ? res.data.isSteps : 1;
        }
      });
    },
    //关闭
    addClose() {
      this.$emit("update:isShow", false);
    },
    //课程信息第一步保存
    submitInfo() {
      this.$refs["infoForm"].validate((valid) => {
        if (valid) {
          this.infoForm.needCheck = 1;
          if (this.isUpdate) {
            this.infoForm.edit = 0;
            updateCourseSubject(this.infoForm).then((res) => {
              this.active = 2;
            });
          } else {
            addCourseSubject(this.infoForm).then((res) => {
              this.courseId = res.data;
              this.active = 2;
            });
          }
        }
      });
    },
    //课程添加小节点击下一步
    submitVideo() {
      if (!this.isNext) {
        this.$confirm(`还有视频还未上传完成是否下一步`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.isNext = true;
            if (this.isKnobble) {
              this.active = 2;
            } else {
              changeSteps({
                courseId: this.courseId,
                step: this.active,
              }).then((res) => {
                this.active = 3;
              });
            }
          })
          .finally(() => {});
        return;
      }
      if (this.isKnobble) {
        this.active = 2;
      } else {
        changeSteps({
          courseId: this.courseId,
          step: this.active,
        }).then((res) => {
          this.active = 3;
        });
      }
    },
    //第三步骤点击完成
    complete() {
      if (this.isKnobble) {
        this.open = false;
        this.$emit("success");
        this.$emit("update:isShow", false);
      } else {
        changeSteps({
          courseId: this.courseId,
          step: this.active,
        }).then((res) => {
          if (res.data.code == 1) {
            this.$confirm(
              `绑定视频章节需获取视频时长信息还在转码中，请等待`,
              "提示",
              {
                confirmButtonText: "确定",
                showCancelButton: false,
                showClose: false,
                type: "info",
              }
            ).then(() => {
              this.open = false;
              this.$emit("success");
            });
            return;
          }
          this.open = false;
          this.$emit("success");
        });
      }
    },
    //关闭
    close() {
      if (
        this.active == 1 &&
        !this.isKnobble &&
        this.infoForm.subjectTitle != ""
      ) {
        this.$confirm(`是否保存草稿?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$refs["infoForm"].validate((valid) => {
              if (valid) {
                this.infoForm.needCheck = 0;
                return addCourseSubject(this.infoForm).then(() => {
                  this.open = false;
                  this.msgSuccess("保存成功");
                });
              }
            });
          })
          .catch(() => {
            this.open = false;
            if (this.isUpdate) {
              this.$emit("update:isShow", false);
            }
          });
      } else {
        this.open = false;
        if (this.isUpdate || this.isKnobble) {
          this.$emit("update:isShow", false);
        }
      }
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
      // this.infoForm.tagBoList = [];
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
    //删除标签
    deleTag(index) {
      this.infoForm.tagBoList.splice(index, 1);
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
        this.infoForm.videoIds.push(res.data.data);
      });
    },
    //删除导学视频
    delectLearnVideo(id) {},
    //全选视频/小节
    selectAllVideo() {
      this.isAll = !this.isAll;
      this.videoList.forEach((item) => {
        item.select = this.isAll;
      });
    },
    //选择视频/小节
    selectVideo(index) {
      this.videoList[index].select = !this.videoList[index].select;
      if (
        this.videoList.length ==
        this.videoList.filter((item) => item.select).length
      ) {
        this.isAll = true;
      } else {
        this.isAll = false;
      }
    },
    //绑定小节进章节
    async bindKnobble() {
      let index = this.chapterList.findIndex((item) => item.isSelect);
      let data = {
        chapterId: index != -1 ? this.chapterList[index].id : "",
        Ids: [],
        subjectId: this.courseId,
        isLock: this.unlockTypeForm.lockType == 2 ? 1 : 0,
      };
      this.videoList.forEach((item) => {
        if (item.select) {
          data.Ids.push(item.id);
        }
      });
      if (data.Ids.length == 0) {
        this.msgError("请先选择小节");
        return;
      }
      if (data.chapterId == "") {
        let res = await addChapterItem({
          title: `第${this.convertToChinaNum(this.chapterList.length + 1)}章`,
          subjectId: this.courseId,
          isLock: 0,
        });
        data.chapterId = res.data.chapterId;
      }
      bindvideo(data).then((res) => {
        this.getVideoList();
        this.getChapter();
      });
    },
    //替换视频
    refreshVideo(sectionId) {
      let data = {
        videoId: "",
        sectionId,
      };
      let length = this.videoList.filter((item) => item.select).length;
      if (length == 0) {
        this.msgError("请先选择小节");
        return;
      }
      if (length > 1) {
        this.msgError("只能选择一个小节");
        return;
      }
      this.videoList.forEach((item) => {
        if (item.select) {
          data.videoId = item.videoId;
        }
      });
      this.$confirm(`是否替换小节视频?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return replaceVideo(data);
        })
        .then(() => {
          this.getChapter();
          this.getVideoList();
          this.msgSuccess("替换成功");
        })
        .finally(() => {});
    },
    //删除小节
    delVideo(id) {
      this.$confirm(`是否删除小节?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return removeSection(id);
        })
        .then(() => {
          this.getChapter();
          this.getVideoList();
          this.msgSuccess("删除成功");
        })
        .finally(() => {});
    },
    //删除未分配的视频/小节
    removeKnobble(id) {
      this.$confirm(`是否删除该视频?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return delVideo(id);
        })
        .then(() => {
          this.getVideoList();
          this.msgSuccess("删除成功");
        })
        .finally(() => {});
    },
    //获取未分配视频/小节列表
    getVideoList() {
      this.chapterParams.subjectId = this.courseId;
      quitVideo(this.chapterParams).then((res) => {
        res.data.forEach((item) => {
          item.select = false;
        });
        this.videoList = res.data;
      });
    },
    //提交小节配置
    submitCofing() {
      let sectionIds = [];
      this.chapterList.forEach((item) => {
        item.sectionList.forEach((child) => {
          if (child.isSelect) {
            sectionIds.push(child.sectionId);
          }
        });
      });
      if (sectionIds.length == 0) {
        this.msgError("请先选择小节");
        return;
      }
      this.knobbleForm.sectionIds = sectionIds;
      this.knobbleForm.lockType = this.unlockTypeForm.lockType;
      this.knobbleForm.subjectId = this.courseId;
      configure(this.knobbleForm).then((res) => {
        this.msgSuccess("保存配置成功");
        this.getChapter();
      });
    },
    //修改解锁状态
    changeLockType() {
      this.unlockTypeForm.courseId = this.courseId;
      updatelock(this.unlockTypeForm).then((res) => {
        this.getChapter();
      });
    },
    //试卷解除绑定
    deleteExam(sectionId, type) {
      this.$confirm(`是否解绑试卷?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return deleteQuestions({ sectionId, type });
        })
        .then(() => {
          this.getChapter();
          this.getExampaperList();
          this.msgSuccess("解绑成功");
        })
        .finally(() => {});
    },
    //绑定试卷到章节或者小节
    bindEexam() {
      if (this.questionId == "") {
        this.msgError("请先选择试卷");
        return;
      }
      if (!this.getChapterId()) {
        this.msgError("请先选择章节或小节");
        return;
      }
      let data = this.getChapterId();
      data.paperId = this.questionId;
      data.paperName = this.paperName;
      bindQuestion(data).then((res) => {
        this.questionId = "";
        this.paperName = "";
        this.getExampaperList();
        this.getChapter();
      });
    },
    //获取章节或者小节的id
    getChapterId() {
      for (let index in this.chapterList) {
        let item = this.chapterList[index];
        if (item.isSelect) {
          return { type: 1, sectionChapterId: item.id };
        }
        for (let i in item.sectionList) {
          let child = item.sectionList[i];
          if (child.isSelect) {
            return { type: 2, sectionChapterId: child.sectionId };
          }
        }
      }
      return false;
    },
    //选择试卷
    selectQuestion(index) {
      this.questionId = this.exampaper[index].id;
      this.paperName = this.exampaper[index].examName;
    },
    //获取试卷列表
    getExampaperList() {
      if (this.questionParams.examName == "") {
        this.questionParams.examName = undefined;
      }
      exampaperList(this.questionParams).then((res) => {
        this.exampaper = res.rows;
      });
    },
    //上传视频添加小节
    creatVideo(data) {
      data.subjectId = this.courseId;
      saveVideoMessage(data);
    },
    //点击小节-setType==2启用
    selectItem(item) {
      if (this.setType != 2) return;
      item.isSelect = true;
      this.knobbleForm = {
        onlineAuth: item.onlineAuth, //是否需要活体检测 0-不校验 1-定时验证码 2-活体检测 3-人脸检测 4-人脸识别 5-人脸抓拍录制
        onlineAuthInterval: item.onlineAuthInterval, //验证间隔(每隔多少秒验证一次)
        learnType: item.learnType, //	必学选学 0-选学 1-必学
        tryAndSee: item.tryAndSee, // 是否试看(0否，1是)
        tryTime: item.tryTime, //试看时长(秒) 0-不允许试看
      };
    },
    //第三步骤切换配置类型
    handleClick() {
      this.chapterList.forEach((item) => {
        item.isSelect = false;
        item.sectionList.forEach((child) => {
          child.isSelect = false;
        });
      });
      if (this.setType == 1) {
        this.getVideoList();
      } else if (this.setType == 3) {
        this.getExampaperList();
      }
    },
    //小节多选
    checkCild(fIndex, index) {
      this.chapterList[fIndex].sectionList[index].isSelect =
        !this.chapterList[fIndex].sectionList[index].isSelect;
      let list = this.chapterList[fIndex].sectionList.filter(
        (item) => item.isSelect
      );
      if (list.length == this.chapterList[fIndex].sectionList.length) {
        this.chapterList[fIndex].isSelectAll = true;
      } else {
        this.chapterList[fIndex].isSelectAll = false;
      }
    },
    //小节全选
    selectAll(fIndex) {
      this.chapterList[fIndex].isSelectAll =
        !this.chapterList[fIndex].isSelectAll;
      this.chapterList[fIndex].sectionList.forEach((item) => {
        item.isSelect = this.chapterList[fIndex].isSelectAll;
      });
    },
    //章节与小节联动单选
    selectChapterAndChid(index, cIndex) {
      this.chapterList.forEach((item, i) => {
        if (index == -1) {
          //点击章节
          if (i == cIndex) {
            item.isSelect = true;
          } else {
            item.isSelect = false;
          }
          item.sectionList.forEach((child) => {
            child.isSelect = false;
          });
        } else {
          item.isSelect = false;
          if (i == index) {
            item.sectionList.forEach((child, ind) => {
              if (cIndex == ind) {
                child.isSelect = true;
              } else {
                child.isSelect = false;
              }
            });
          }
        }
      });
    },
    //章节单选
    selectChapter(index) {
      this.chapterList.forEach((item, i) => {
        if (index == i) {
          item.isSelect = true;
        } else {
          item.isSelect = false;
        }
      });
    },
    //移除章节
    removeChapter(index) {
      if (
        this.chapterList[index].sectionList &&
        this.chapterList[index].sectionList.length > 0
      ) {
        this.msgError("存在小节的章节不可删除");
        return;
      }
      let id = this.chapterList[index].id;
      let name = this.chapterList[index].title;
      this.$confirm(`是否删除名为${name}的章节?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return removeChapterItem(id);
        })
        .then(() => {
          this.getChapter();
          this.msgSuccess("删除成功");
        })
        .finally(() => {});
    },
    //新增章节
    addChapter() {
      if (this.addTitle == "") {
        this.msgError("请先输入章节名称");
        return;
      }
      addChapterItem({
        title: this.addTitle,
        subjectId: this.courseId,
        isLock: 0,
      }).then((res) => {
        this.addTitle = "";
        this.isAdd = false;
        this.getChapter();
      });
    },
    //修改章节
    editChapter(id, title, index) {
      if (title == "") {
        this.msgError("请先输入章节名称");
        return;
      }
      editChapterItem({
        id,
        title,
      }).then((res) => {
        this.chapterList[index].isEdit = false;
        this.msgSuccess("修改成功");
      });
    },
    //获取章节以及小节
    getChapter() {
      getChapterList(this.courseId).then((res) => {
        let data = res.data;
        data.chapterList.forEach((item) => {
          item.isSelect = false;
          item.isSelectAll = false;
          item.isEdit = false;
          item.sectionList = item.sectionList.filter(
            (ite) => ite.sectionId > 0
          );
          item.sectionList.forEach((child, index) => {
            child.isSelect = false;
          });
        });
        this.unlockTypeForm.lockType = data.isUnlockType;
        this.chapterList = data.chapterList;
        console.log(this.chapterList);
      });
    },
    //新增课程
    addCurriculum(type) {
      this.infoForm.method = type;
      if (type == 0) {
        this.title = "录播";
      }
      this.$emit("update:isShow", false);
      this.open = true;
    },
  },
};
</script>
<style lang="scss" scope>
.type-item {
  cursor: pointer;
  width: 260px;
  height: 360px;
  padding: 70px 20px 0 20px;
  box-sizing: border-box;
  border: 1px solid #ecf2f5;
  border-radius: 6px;
  text-align: center;
  background-color: #ecf2f5;
  &:hover {
    border-color: #0091ff;
    background-color: #f3fbff;
  }
  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    margin-bottom: 66px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #666666;
    margin-bottom: 12px;
  }
  .introduce {
    font-size: 14px;
    line-height: 18px;
    text-align: left;
    color: #666666;
  }
}

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

.content-set {
  width: 100%;
  padding-top: 10px;
  height: 600px;
  box-sizing: border-box;
  .box {
    width: 100%;
    height: 500px;
  }
  .unlock-type {
    width: 100%;
    box-sizing: border-box;
  }
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .left-chapter {
    width: 50%;
    height: 100%;
    border-bottom: 1px solid #ececec;
    .chapter-item {
      background-color: #ececec;
    }
    .chapter-item,
    .child-item {
      width: 100%;
      height: 40px;
      padding: 0 20px 0 84px;
      box-sizing: border-box;
      position: relative;
      .is-lock {
        position: absolute;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 18px;
        left: 20px;
        top: 8px;
        color: #000;
        font-weight: bold;
      }

      .setting {
        position: absolute;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 18px;
        left: 80px;
        top: 8px;
        color: #000;
        font-weight: bold;
      }

      .radio-box,
      .check-box {
        cursor: pointer;
        position: absolute;
        width: 14px;
        height: 14px;
        border: 1px solid #999;
        border-radius: 50%;
        left: 60px;
        top: 13px;
        &:hover {
          border-color: #409eff;
        }

        .radio {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #fff;
        }
      }

      .check-box {
        border-radius: 2px;
        .check {
          width: 8px;
          height: 8px;
        }
      }

      .on {
        border-color: #409eff;
        background-color: #409eff;
      }

      .chapter-name {
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }

      .hove {
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }

      .question {
        margin-left: 20px;
        font-size: 12px;
        color: #409eff;
        .question-name {
          margin: 0 4px;
        }
        .close {
          cursor: pointer;
        }
      }

      .close-btn,
      .remove-btn,
      .refresh-btn {
        cursor: pointer;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 18px;
        color: #000;
        font-weight: bold;
        &:hover {
          color: #409eff;
        }
      }

      .refresh-btn {
        margin-right: 10px;
      }
    }

    .child-chapter {
      width: 100%;
      padding-left: 20px;
      box-sizing: border-box;

      .child-item {
        padding-left: 104px;
      }
    }
  }

  .right {
    width: 50%;
    padding: 0 20px;
    box-sizing: border-box;
    border: 1px solid #ececec;

    .check-all {
      .name {
        font-size: 14px;
        color: #333;
        margin-left: 10px;
      }
    }

    .radio-box,
    .check-box {
      cursor: pointer;
      width: 14px;
      height: 14px;
      border: 1px solid #999;
      border-radius: 50%;
      &:hover {
        border-color: #409eff;
      }

      .radio {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #fff;
      }
    }

    .check-box {
      border-radius: 2px;
      .check {
        width: 8px;
        height: 8px;
      }
    }

    .on {
      border-color: #409eff;
      background-color: #409eff;
    }

    .knobble,
    .question-box {
      width: 100%;
      height: calc(100% - 54px);

      .knobble-list,
      .question-list {
        width: 100%;
        height: calc(100% - 70px);
        padding: 20px;
        box-sizing: border-box;

        /deep/.el-scrollbar__wrap {
          overflow-x: hidden;
        }

        .knobble-item,
        .question-item {
          width: 100%;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .name {
            font-size: 14px;
            color: #333;
            font-weight: bold;
            margin-left: 20px;
          }
          .close-btn {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: #333;
            cursor: pointer;
            font-weight: bold;
            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }

    .set {
      .set-item {
        /deep/.el-radio {
          margin-bottom: 10px;
        }
        /deep/.el-form-item__label {
          line-height: 14px;
        }
      }
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

.steps-box {
  width: 100%;
  padding: 0 60px 20px 60px;
  box-sizing: border-box;
  border-bottom: 1px solid #ececec;
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