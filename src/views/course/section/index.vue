<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="" prop="sectionTitle">
        <el-input
          v-model="queryParams.sectionTitle"
          placeholder="请输入小节标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="学习类型" prop="learnType">
        <el-select
          v-model="queryParams.learnType"
          placeholder="请选择类型"
          clearable
          size="small"
        >
          <el-option label="选学" :value="0" />
          <el-option label="必学" :value="1" />
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
          v-hasPermi="['course:section:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['course:section:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['course:section:export']"
          >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-plus"
          size="mini"
          @click="setting"
          >内容配置
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :data="sectionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="100" />

      <el-table-column
        label="小节标题"
        align="center"
        prop="sectionTitle"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-show="!scope.row.isEdit" @click="scope.row.isEdit=true"> {{ scope.row.sectionTitle }} </span>
          <el-input
            v-model="scope.row.sectionTitle"
            size="small"
            :maxlength="35"
            v-show="scope.row.isEdit"
            @keyup.enter.native="editSection(scope.row,scope.$index)"
            @blur="editSection(scope.row,scope.$index)"
            placeholder="请输入章节名称"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="时长"
        align="center"
        prop="durationStr"
        :formatter="fzm"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="学习类型" align="center" prop="learnType">
        <template slot-scope="scope">
          <span> {{ scope.row.learnType == 0 ? "选学" : "必学" }} </span>
        </template>
      </el-table-column>

      <el-table-column label="内含试题" align="center" prop="paperId">
        <template slot-scope="scope">
          <span> {{ scope.row.paperId == 0 ? "无" : "有" }} </span>
        </template>
      </el-table-column>

      <el-table-column label="免费试看" align="center" prop="tryAndSee">
        <template slot-scope="scope">
          <span> {{ scope.row.tryAndSee == 0 ? "关闭" : "开放" }} </span>
        </template>
      </el-table-column>

      <el-table-column label="活体检测" align="center" prop="onlineAuth">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.onlineAuth == 0
                ? "不校验"
                : scope.row.onlineAuth == 1
                ? "定时验证码"
                : scope.row.onlineAuth == 2
                ? "活体检测"
                : scope.row.onlineAuth == 3
                ? "人脸检测"
                : scope.row.onlineAuth == 4
                ? "人脸识别"
                : scope.row.onlineAuth == 5
                ? "人脸抓拍录制"
                : "-"
            }}
          </span>
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

    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      >
      </video-player>
    </el-drawer>

    <el-dialog
      :visible.sync="hdDrawer"
      title="播放视频"
      :before-close="handleClose"
    >
      <div ref="hdVideo" id="hd-video"></div>
    </el-dialog>

    <!-- 添加或修改课程章节 对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      v-loading="loadingVideo"
      element-loading-text="视频上传加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0.5, 0.5)"
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="sectionTitle">
              <el-input
                v-model="form.sectionTitle"
                placeholder="请输入"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学习类型" prop="learnType">
              <el-radio-group
                v-model="form.learnType"
                :disabled="courseStatus != 2"
              >
                <el-radio :label="0">选学</el-radio>
                <el-radio :label="1">必学</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.learnType == 1">
            <el-form-item label="活体检测">
              <el-radio-group v-model="form.onlineAuth">
                <el-radio :label="0">不需要</el-radio>
                <el-radio :label="1">需要</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.learnType == 1">
            <el-form-item label="检测间隔时间(秒)" label-width="130">
              <el-input-number v-model="form.onlineAuthInterval" :min="10" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="封面图" prop="sectionImgUrl">
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
                  @cutDown="cutDownImg"
                >
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-upload"
                    slot="open"
                    @click="oneTOone"
                    >上传(比例1:1)
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-upload"
                    slot="open"
                    @click="sixtTOnine"
                  >
                    上传(比例16:9)
                  </el-button>
                </ImgCutter>
                <el-image
                  v-if="form.sectionImgUrl != null && form.sectionImgUrl != ''"
                  style="max-width: 40px; max-height: 40px"
                  :src="form.sectionImgUrl"
                  :preview-src-list="[form.sectionImgUrl]"
                >
                </el-image>
                <el-input v-model="form.sectionImgUrl" v-show="false" />
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否试看">
              <el-radio-group v-model="form.tryAndSee">
                <el-radio
                  v-for="dict in tryAndSeeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-show="form.tryAndSee == 1">
            <el-form-item label="试看类型">
              <el-radio-group v-model="form.tryType">
                <el-radio :label="0">本视频试看</el-radio>
                <!--                <el-radio :label="1">上传试看视频</el-radio>-->
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-show="form.tryType == 0 && form.tryAndSee == 1">
            <el-form-item label="试看时长">
              <el-input-number
                v-model="form.tryTime"
                :min="0"
                placeholder="请输入试看时长(秒)"
              ></el-input-number>
              <span>(秒)</span>
            </el-form-item>
          </el-col>

          <el-col :span="17" v-show="form.tryType == 1 && form.tryAndSee == 1">
            <el-form-item label="试看视频" prop="videoUrl" v-if="fileVideo">
              <el-input
                v-model="tryVideoUrl"
                placeholder="请输入文件路径链接"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            style="margin-left: 5px"
            v-if="fileVideo"
            v-show="form.tryType == 1 && form.tryAndSee == 1"
          >
            <div>
              <div style="float: left">
                <el-upload
                  ref="sectionVideoUrl"
                  :file-list="tryVideofileList"
                  action=""
                  :http-request="fileVideoUpload"
                  :before-upload="tryVideoBeforeUpload"
                  :limit="1"
                  :auto-upload="true"
                  list-type="video"
                  accept="video/*"
                  name="video_file"
                >
                  <el-button size="small" type="primary" icon="el-icon-upload"
                    >点击上传</el-button
                  >
                </el-upload>
              </div>
              <div style="float: left; margin-left: 5px">
                <el-button
                  size="small"
                  v-if="tryVideoUrl != null && tryVideoUrl != ''"
                  @click="openvideo(tryVideoUrl)"
                  >播放
                </el-button>
              </div>
            </div>
            <input type="text" ref="playTime" v-show="false" />
          </el-col>

          <el-col :span="12">
            <el-form-item label="章节练习">
              <el-radio-group
                v-model="form.exercise"
                :disabled="courseStatus != 2"
              >
                <el-radio
                  v-for="dict in exerciseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-show="form.exercise == 1">
            <el-form-item label="测试试卷">
              <div
                v-for="(item, index) in paperInfo"
                :key="index"
                style="margin-bottom: 10px"
              >
                <el-select
                  v-model="item.paperId"
                  filterable
                  clearable
                  :disabled="courseStatus != 2 || paperDisabled"
                >
                  <el-option
                    v-for="item in paperOptions"
                    :key="item.id"
                    :label="item.examName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <!-- <el-input-number v-model="item.sort" :min="0" :max="10000"/> -->
                <!-- <el-button type="danger" @click="deleteElement(item,index)">-</el-button> -->
              </div>
              <!-- <el-button type="primary" @click="addElement">+</el-button> -->
            </el-form-item>
          </el-col>

          <!-- <el-form-item label="课程分类" prop="categoryId">
             <treeselect v-model="form.categoryId" :options="CourseCategoryOptions" placeholder="请选择课程分类类型" />
           </el-form-item> -->

          <!-- <el-col :span="24" v-show="form.exercise==1">
            <transition name="el-zoom-in-top">
              <el-row>
                <el-col :span="8.5">
                  <el-form-item label="试题分类">
                    <el-select v-model="form.prefaceId" placeholder="请选择题库" @change="handleChange(2)" filterable>
                      <el-option
                        v-for="dict in selectCategory"
                        :key="dict.id"
                        :label="dict.title"
                        :value="dict.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="updExaminationId" placeholder="请选择章节" filterable @change="handleChange(3)">
                    <el-option
                      v-for="dict in selectExamination"
                      :key="dict.id"
                      :label="dict.title"
                      :value="dict.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <el-select v-model="updPid" placeholder="请选择小节" filterable>
                    <el-option
                      v-for="dict in selectPid"
                      :key="dict.id"
                      :label="dict.title"
                      :value="dict.id"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </transition>
          </el-col> -->

          <!-- <el-col :span="24">
            <transition name="el-zoom-in-top">
              <el-form-item label="试题规则" v-show="form.exercise==1" prop="specificationId">
                <el-select v-model="form.specificationId" filterable clearable placeholder="请选择试题测试">

                  <el-option-group
                    v-for="group in specifications"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </transition>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="章节类型" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择类型"
                @change="changeClass()"
                :disabled="courseStatus != 2"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                  :disabled="dict.dictValue === '0'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
                :max="500"
                :disabled="courseStatus != 2"
              />
            </el-form-item>
          </el-col>

          <el-col :span="17">
            <el-form-item
              label="*视频URL/播放代码"
              prop="videoUrl"
              v-show="fileVideo && urlIsShow"
            >
              <el-input
                type="textarea"
                v-model="videoUrl"
                placeholder="请输入文件路径链接"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="* 文档URL" prop="pdfUrl" v-show="filePDF">
              <el-input
                v-model="pdfUrl"
                placeholder="请输入文件路径链接"
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col style="margin-left: 30px" v-show="fileVideo">
            <div>
              <!--              <div style="float: left">-->
              <!--                <el-upload ref="sectionVideoUrl" :file-list="videofileList" action="" :http-request="fileUpload"-->
              <!--                           :before-upload="videoBeforeUpload" :limit="1" :auto-upload="true"-->
              <!--                           list-type="video" accept="video/*" name="video_file">-->
              <!--                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>-->
              <!--                </el-upload>-->
              <!--              </div>-->
              <div class="uploader" v-show="courseStatus == 2">
                <el-input v-model="form.videoId" v-show="false" />
                <!--                <UploadAuth @changeVideo="changeVideo" @changePlayTime="changePlayTime" :statusText="statusText" @changeTxt="changeTxt"/>-->
                <SceneUploadVideo
                  ref="uploadVideoRef"
                  v-show="form.type === '3'"
                  @changeVideo="changeVideo"
                  @changePlayTime="changePlayTime"
                  :statusText="statusText"
                  @changeTxt="changeTxt"
                />
              </div>
              <!--              <div style="float: left;margin-left: 5px">-->
              <!--                <el-button size="small" v-if="videoUrl!=null && videoUrl!=''" @click="openvideo(videoUrl)">播放-->
              <!--                </el-button>-->
              <!--              </div>-->
            </div>
            <input type="text" ref="playTime" v-show="false" />
          </el-col>

          <el-col :span="6" style="margin-left: 5px" v-show="filePDF">
            <div>
              <div style="float: left">
                <el-upload
                  ref="sectionVideoUrl"
                  :file-list="filePDFList"
                  action=""
                  :http-request="fileUploadpdf"
                  :before-upload="filePDFBeforeUpload"
                  :limit="1"
                  :auto-upload="true"
                  list-type="pdf"
                  accept="pdf/*"
                  name="pdf_file"
                >
                  <el-button size="small" type="primary" icon="el-icon-upload"
                    >点击上传</el-button
                  >
                </el-upload>
              </div>
            </div>
          </el-col>

          <el-col :span="10" v-show="filePDF">
            <el-form-item label="* 观看时长" prop="durationStr">
              <el-input
                v-model="durationStrImput"
                controls-position="right"
                v-on:change="durationKeyup"
                :min="0"
                :max="500"
                :disabled="courseStatus != 2"
              />
              <span>格式应该为: 00:00:00 到 23:59:59</span>
            </el-form-item>
          </el-col>

          <!--          <el-col :span="24" v-show="fileVideo">-->
          <!--            <el-form-item label="视频时长" prop="durationTime">-->
          <!--              <el-input-number placeholder="请输入视频时长(秒)" :min="0" v-model="form.durationTime" controls-position="right" :disabled="courseStatus!=2"/>-->
          <!--              <span>秒</span>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--    <div class="uploader">-->
    <!--      <UploadAuth v-show="picked === 'one'"/>-->
    <!--    </div>-->
    <add-course
      :isShow.sync="isAdd"
      :updateId="subjectId"
      :steps="steps"
      :isKnobble="true"
      @success="addSuccess"
    ></add-course>
  </div>
</template>

<script>
import {
  addSection,
  delSection,
  exportSection,
  fileUpload2,
  fileUploadVideo,
  getSection,
  imgBase64Upload,
  listSection,
  updateSection,
  sectionEdit
} from "@/api/course/section";
import ImgCutter from "vue-img-cutter";
import UploadAuth from "@/components/UploadVideo/UploadAuth";
import { specification } from "@/api/course/subject";
import { selectCategory } from "@/api/exam/examination";
import { selectExamination } from "@/api/exam/questions";
import SceneUploadVideo from "@/components/HdSceneUploadVideo/index";
import addCourse from "@/views/resource/components/addCourse"; //小节配置
export default {
  name: "Section",
  components: { ImgCutter, UploadAuth, SceneUploadVideo, addCourse },
  data() {
    return {
      //新增弹窗
      isAdd: false,
      //内容配置步骤，新增/配置
      steps: 1,
      paperDisabled: false,
      courseStatus: 2,
      statusText: "",
      id: undefined,
      //课程id
      subjectId: undefined,
      //大章id
      chapterId: undefined,
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
      // 课程章节 表格数据
      sectionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //题库下拉参数
      selectCategory: undefined,
      //添加修改章节下拉
      selectExamination: undefined,
      //添加修改小节下拉
      selectPid: undefined,
      // 类型字典
      typeOptions: [],
      // 是否试看(0否，1是)字典
      tryAndSeeOptions: [],
      // 开启章节练习(0否，1是)字典
      exerciseOptions: [],
      // 视频类型显示
      fileVideo: true,
      // 视频url是否展示 新增不展示 修改展示禁用
      urlIsShow: false,
      // PDF类型显示
      filePDF: false,
      // 视频的url
      videoUrl: undefined,
      // 试看视频的url
      tryVideoUrl: undefined,
      // pdf的url
      pdfUrl: undefined,
      // pdf观看时长
      durationStrImput: undefined,
      // 截图比例
      rate: "16:9",
      // 视频文件数组
      videofileList: [],
      // 试看视频文件数组
      tryVideofileList: [],
      // pdf文件数组
      filePDFList: [],
      // 视频loading状态
      loadingVideo: false,
      // 视频播放插件参数
      drawer: false,
      hdDrawer: false,
      // 视频播放插件参数
      direction: "rtl",
      //获得场景对象
      player: null,
      // 视频播放
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: "auto",
        language: "zh-CN",
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: "16:9",
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [
          {
            //类型
            type: "video/mp4",
            //url地址
            src: "",
          },
        ],
        rate: "16:9",
        //你的封面地址
        poster: "",
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true,
        },
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        subjectId: undefined,
        chapterId: undefined,
        sectionTitle: undefined,
        type: undefined,
        learnType: undefined,
      },
      //试题规则
      specifications: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        subjectId: [
          { required: true, message: "课程ID不能为空", trigger: "blur" },
        ],
        sectionTitle: [
          { required: true, message: "小节标题不能为空", trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message: "类型（0视频1PDF）不能为空",
            trigger: "blur",
          },
        ],
        tryAndSee: [
          {
            required: true,
            message: "是否试看(0否，1是)不能为空",
            trigger: "blur",
          },
        ],
        exercise: [
          {
            required: true,
            message: "开启小节练习(0否，1是)不能为空",
            trigger: "blur",
          },
        ],
        sort: [
          { required: true, message: "小节排序不能为空", trigger: "blur" },
        ],
        learnType: [
          { required: true, message: "请选择学习类型", trigger: "blur" },
        ],
        // sectionImgUrl: [
        //   { required: true, message: "小节封面不能为空", trigger: "blur" }
        // ],
      },
      //存储变量值(this.from.prefaceId、this.from.examinationId)
      updPrefaceId: undefined,
      updExaminationId: undefined,
      updPid: undefined,
      // 多选试卷数据
      paperInfo: [
        {
          paperId: undefined,
          sort: 100,
        },
      ],
      // 试卷选项数据
      paperOptions: [],
    };
  },
  created() {
    // // 路由获取课程id
    // const subjectId = this.$route.params && this.$route.params.subjectId;
    // // 复制给列表的查询条件课程id
    // this.queryParams.subjectId = subjectId;
    // // 表单赋值课程id
    // this.subjectId = subjectId;

    this.subjectId = this.$route.path.split("/")[3];
    if (this.subjectId) {
      this.queryParams.subjectId = this.subjectId;
    }

    this.getList();
    this.getDicts("course_section_type").then((response) => {
      this.typeOptions = response.data;
    });
    this.getDicts("cust_yes_no").then((response) => {
      this.tryAndSeeOptions = response.data;
    });
    this.getDicts("cust_yes_no").then((response) => {
      this.exerciseOptions = response.data;
    });
    //试题规则列表
    specification().then((response) => {
      this.specifications[0] = response.data[0];
    });
    selectCategory().then((response) => {
      this.selectCategory = response.data;
    });
  },
  methods: {
    //修改小节名称
    editSection(row,index){
      if(row.sectionTitle == ''){
        this.msgError("请先输入小节名称");
        return;
      }
      sectionEdit({
        id:row.id,
        sectionTitle:row.sectionTitle
      }).then(res=>{
        this.sectionList[index].isEdit = false
        this.msgSuccess("修改成功");
      })
    },
    //内容配置
    setting() {
      this.isAdd = true;
      this.steps = 2;
    },
    //小节配置成功
    addSuccess() {
      this.getList();
    },
    changeTxt(val) {
      this.statusText = val;
    },
    changeVideo(val, vid) {
      this.videoUrl = val;
      this.form.videoId = vid;
    },
    changePlayTime(val) {
      this.form.durationTime = val;
      this.$forceUpdate();
    },
    //更新排序
    updateSort(data) {
      updateSection(data).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 查询课程章节 列表 */
    getList() {
      this.loading = true;
      listSection(this.queryParams).then((response) => {
        this.sectionList = response.rows;
        this.total = response.total;
        this.sectionList.forEach((item) => {
          item.isEdit = false;
        });
        if (this.total > 0) {
          this.courseStatus = response.rows[0].courseStatus;
        }
        this.loading = false;
      });
    },
    // 删除一个试卷组
    deleteElement(item, index) {
      if (this.paperInfo.length <= 1) {
        // 如果只有一个输入框则不可以删除
        return false;
      }
      // 删除了数组中对应的数据也就将这个位置的输入框删除
      this.paperInfo.splice(index, 1);
    },
    // 添加一个试卷组
    addElement(item) {
      this.paperInfo.push({
        paperId: undefined,
        sort: 100,
      });
    },
    // 类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 是否试看(0否，1是)字典翻译
    tryAndSeeFormat(row, column) {
      return this.selectDictLabel(this.tryAndSeeOptions, row.tryAndSee);
    },

    fzm(row, column) {
      if (row.durationStr == null || row.durationStr == undefined) {
        return "0";
      }
      var a1, a2, a3, a4;
      var a = row.durationStr.split(":");
      if (a.length == 2) {
        a1 = a[0] * 60;
        a2 = a[1];
        a3 = Number(a1) + Number(a2);
      } else if (a.length == 3) {
        a3 = Number(a[0]) * 3600 + Number(a[1]) * 60 + Number(a[2]);
      } else {
        a3 = a[0];
      }

      if (a3 != row.durationTime) {
        a3 = "错误";
      } else {
        a3 = row.durationStr + "(" + a3 + ")";
      }
      return a3;
    },
    // 开启章节练习(0否，1是)字典翻译
    exerciseFormat(row, column) {
      return this.selectDictLabel(this.exerciseOptions, row.exercise);
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
        sectionImgUrl: undefined,
        sectionTitle: undefined,
        subjectId: undefined,
        chapterId: this.chapterId,
        prefaceId: undefined,
        type: "3",
        sectionVideoUrl: undefined,
        durationStr: undefined,
        tryAndSee: "0",
        exercise: "0",
        sort: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        tryTime: undefined,
        tryType: undefined,
        tryVideoUrl: undefined,
        learnType: 1,
        videoId: undefined,
        onlineAuth: 0,
        onlineAuthInterval: 0,
      };
      this.resetForm("form");
      this.videoUrl = undefined;
      this.tryVideoUrl = undefined;
      this.pdfUrl = undefined;
      this.durationStrImput = "00:10:00";
      this.updPrefaceId = undefined;
      this.updExaminationId = undefined;
      this.updPid = undefined;
      this.paperInfo = [
        {
          paperId: undefined,
          sort: 100,
        },
      ];
      this.changeClass();
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
      this.isAdd = true;
      this.steps = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.urlIsShow = true;
      const id = row.id || this.ids;
      getSection(id).then((response) => {
        this.form = response.data;
        if (response.data.papersVos.length > 0) {
          this.paperInfo = response.data.papersVos;
          if (
            response.data.papersVos != undefined &&
            response.data.papersVos.length > 0
          ) {
            this.paperDisabled = true;
          } else {
            this.paperDisabled = false;
          }
        }
        var type = this.form.type;
        if (this.form.tryAndSee == "0") {
          this.form.tryType = undefined;
        }
        if (this.form.tryAndSee == "1" && this.form.tryType == 1) {
          this.tryVideoUrl = this.form.tryVideoUrl;
        }
        if (type == 0 || type == 3) {
          this.fileVideo = true;
          this.filePDF = false;
          this.videoUrl = this.form.sectionVideoUrl;
        }
        if (type == 1) {
          this.fileVideo = false;
          this.filePDF = true;
          this.pdfUrl = this.form.sectionVideoUrl;
          this.durationStrImput = this.form.durationStr;
        }
        this.updPrefaceId = this.form.prefaceId;
        this.updExaminationId = this.form.examinationId;
        this.updPid = this.form.examinationPid;
        this.handleChange(2);
        this.handleChange(3);
        this.open = true;
        this.title = "修改课程小节 ";
        if (this.fileVideo && this.$refs.uploadVideoRef) {
          this.$refs.uploadVideoRef.resetInfo();
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        var type = this.form.type;
        if (type == 0 || type == 3) {
          // var playTime =  this.$refs.playTime.value;
          // if (playTime!=null) this.form.durationTime = playTime;
          this.form.sectionVideoUrl = this.videoUrl;
          if (this.videoUrl == undefined || this.videoUrl == "") {
            this.msgError("请上传视频");
            return false;
          }
          // if (this.form.durationTime == undefined || this.form.durationTime == '') {
          //   this.msgError('视频时长为空')
          //   return false
          // }
        }
        if (type == 1) {
          this.form.sectionVideoUrl = this.pdfUrl;
          this.form.durationStr = this.durationStrImput;
          if (this.pdfUrl == undefined || this.pdfUrl == "") {
            this.msgError("文档地址url为空");
            return false;
          }
          if (
            this.durationStrImput == undefined ||
            this.durationStrImput == ""
          ) {
            this.msgError("观看时长为空");
            return false;
          }
          if (!this.durationIsTime(this.durationStrImput)) {
            this.$message.error("观看时间格式应该为: 00:00:00");
            return false;
          }
        }
        // 选择是测试 则必须选择试卷
        if (this.form.exercise == "1") {
          if (!this.paperInfo[0].paperId) {
            this.msgError("请选择试卷!");
            return;
          }
        }
        // 选择试看，进入判断
        if (this.form.tryAndSee == 1) {
          // 选择了试看，必须选择试看类型
          if (this.form.tryType == undefined || this.form.tryType == null) {
            this.$message.error("请选择试看类型");
            return false;
          }
          // 类型为上传试看视频
          if (this.form.tryType == 1) {
            // 判断是否为空
            if (
              this.tryVideoUrl == undefined ||
              this.tryVideoUrl == null ||
              this.tryVideoUrl == ""
            ) {
              this.$message.error("试看视频url不能为空");
              return false;
            }
            this.form.tryVideoUrl = this.tryVideoUrl;
          }
        } else {
          // 不试看，置空条件
          this.form.tryType = null;
        }
        //赋值
        this.form.examinationId = this.updExaminationId;
        this.form.examinationPid = this.updPid;
        // console.log(this.form);
        // return false;

        if (valid) {
          // 处理试卷数据
          this.form.papersVos = this.paperInfo;
          if (this.form.id != undefined) {
            updateSection(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addSection(this.form).then((response) => {
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
        '是否确认删除课程章节 编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSection(ids);
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
      this.$confirm("是否确认导出所有课程章节 数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSection(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 类型选择事件 */
    changeClass() {
      let type = this.form.type;
      if (type == 0 || type == 3) {
        this.fileVideo = true;
        this.filePDF = false;
      }
      if (type == 1) {
        this.fileVideo = false;
        this.filePDF = true;
      }
    },

    /**上传(比例1:1) */
    oneTOone: function (res) {
      this.rate = "1:1";
    },

    /**上传(比例16:9) */
    sixtTOnine: function (res) {
      this.rate = "16:9";
    },

    cutDownImg: function (res) {
      imgBase64Upload(res.dataURL).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.sectionImgUrl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },

    /** 上传pdf文件, 入参一定要添加file默认参数 */
    fileUploadpdf(file) {
      this.loadingVideo = true;
      fileUpload2(file).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.pdfUrl = res.url;
          this.loadingVideo = false;
          this.filePDFList = [];
        } else {
          this.$message.error("上传pdf文件异常");
          this.loadingVideo = false;
        }
      });
    },

    //入参一定要添加file默认参数
    fileUpload(file) {
      this.loadingVideo = true;
      //上传短视频图片
      fileUploadVideo(file).then((res) => {
        //alert(JSON.stringify(res));
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.videoUrl = res.url;
          this.loadingVideo = false;
          this.videofileList = [];
        } else {
          this.$message.error("上传视频异常");
          this.loadingVideo = false;
        }
      });
    },
    // 试看视频上传
    fileVideoUpload(file) {
      this.loadingVideo = true;
      //上传短视频图片
      fileUploadVideo(file).then((res) => {
        //alert(JSON.stringify(res));
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.tryVideoUrl = res.url;
          this.loadingVideo = false;
          this.tryVideofileList = [];
        } else {
          this.$message.error("上传视频异常");
          this.loadingVideo = false;
        }
      });
    },

    /*上传pdf文件前校验*/
    filePDFBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 20;
      if (!isRightSize) {
        this.$message.error("文件大小超过 20M");
      }
      let isAccept = new RegExp("pdf/*").test(file.type);
      if (!isAccept) {
        this.$message.error("应该选择pdf/*类型的文件");
      }
      this.filePDFList = [];
      return isRightSize && isAccept;
    },

    /** 上传视频前的校验 */
    videoBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 1024;
      if (!isRightSize) {
        this.$message.error("文件大小超过 1G");
      }
      let isAccept = new RegExp("video/*").test(file.type);
      if (!isAccept) {
        this.$message.error("应该选择video/*类型的文件");
      }

      let url = URL.createObjectURL(file);
      var audioElement = new Audio(url);
      var ele = this.$refs.playTime;
      audioElement.addEventListener("loadedmetadata", () => {
        let playTime = audioElement.duration; //playTime就是当前视频长度
        ele.value = parseInt(playTime); //目前使用这种方式解决js与vue之间的传值问题
        this.form.durationTime = parseInt(playTime);
        console.info("时长：" + playTime);
      });
      this.videofileList = [];
      return isRightSize && isAccept;
    },
    /** 上传试看视频前的校验 */
    tryVideoBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 1024;
      if (!isRightSize) {
        this.$message.error("文件大小超过 1G");
      }
      let isAccept = new RegExp("video/*").test(file.type);
      if (!isAccept) {
        this.$message.error("应该选择video/*类型的文件");
      }

      let url = URL.createObjectURL(file);
      this.tryVideofileList = [];
      return isRightSize && isAccept;
    },

    /** 打开视频弹窗 */
    openvideo(video) {
      this.drawer = true;
      this.playerOptions["sources"][0]["src"] = video;
    },

    openHdVideo(vid) {
      this.hdDrawer = true;
      this.player && this.player.destroy();
      setTimeout(() => {
        this.$nextTick(() => {
          let video = document.getElementById("hd-video");
          this.player = window.createCCH5Player({
            vid,
            siteid: "0474F386F7309CC9",
            autoStart: true,
            width: "100%",
            height: "500px",
            parentNode: video,
          });
        });
      }, 500);
    },

    /** 视频关闭 */
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    /** PDF文件打开窗口 */
    methodPrint(row) {
      const id = row.id || this.id;
      getSection(id).then((response) => {
        debugger;
        window.open(response.data.sectionVideoUrl, "blank");
      });
    },

    /** 观看时间按键事件 */
    durationKeyup() {
      this.durationIsTime(this.durationStrImput);
    },

    /** 观看时间格式判断 */
    durationIsTime(str) {
      var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
      if (a == null) {
        this.$message.error("格式应该为: 00:00:00");
        return false;
      }
      if (a[1] > 24 || a[3] > 60 || a[4] > 60) {
        this.$message.error("格式应该为: 00:00:00");
        return false;
      }
      return true;
    },
    /** 筛选题库ID获取下属试卷 */
    handleChange(id) {
      if (id == 2) {
        var zsd = { id: this.form.prefaceId };
        selectExamination(zsd).then((response) => {
          this.selectExamination = response.data;
          if (this.form.prefaceId != this.updPrefaceId)
            this.updExaminationId = undefined;
          if (this.form.prefaceId == this.updPrefaceId)
            this.updExaminationId = this.form.examinationId;
          if (this.form.examinationId != this.updExaminationId)
            this.updPid = undefined;
          if (this.form.examinationId == this.updExaminationId)
            this.updPid = this.form.examinationPid;
        });
      } else if (id == 3) {
        var zsd = { pid: this.updExaminationId };
        selectExamination(zsd).then((response) => {
          this.selectPid = response.data;
          if (this.form.examinationId != this.updExaminationId)
            this.updPid = undefined;
          if (this.form.examinationId == this.updExaminationId)
            this.updPid = this.form.examinationPid;
        });
      }
    },
  },
};
</script>
<style scoped>
.upload-type-switch {
  text-align: center;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.input-control {
  margin: 5px 0;
}

.input-control label {
  font-size: 14px;
  color: #333;
  width: 30%;
  text-align: right;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}

.input-control input {
  width: 30%;
  height: 30px;
  padding: 0 5px;
}

.upload {
  padding: 5px 50px;
}

.progress {
  font-size: 14px;
}

.progress i {
  font-style: normal;
}

.upload-type {
  color: #666;
  font-size: 12px;
  padding: 10px 0;
}

.upload-type button {
  margin: 0 10px 0 20px;
}

.status {
  font-size: 14px;
  margin-left: 30px;
}

.info {
  font-size: 14px;
  padding-left: 30px;
}
</style>
